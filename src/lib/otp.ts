import crypto from 'crypto';
import { prisma } from './prisma';

// Phone-OTP issuing + verification, backing the signup flow's "Send OTP" /
// "Verify" buttons (src/views/SignupView.tsx). Codes are never stored in
// plaintext -- only an HMAC of the code (keyed by phone+purpose) lives in
// phone_otps.otp_hash. A successful verify mints a short-lived signed
// "proof" string that /api/auth/register checks before it will create the
// account, so a client can't just claim "verified: true" on its own.

const SECRET = process.env.SESSION_SECRET;
if (!SECRET) {
  throw new Error(
    'SESSION_SECRET environment variable is missing. Add it to .env (any long random string).',
  );
}

const CODE_LENGTH = 6;
const CODE_TTL_MS = 5 * 60 * 1000; // how long a texted code stays valid
const RESEND_COOLDOWN_MS = 45 * 1000; // minimum gap between two sends for the same phone+purpose
const MAX_VERIFY_ATTEMPTS = 5; // wrong guesses allowed against one code before it's dead
const PROOF_TTL_MS = 15 * 60 * 1000; // how long a "verified" proof can be redeemed at /api/auth/register

export class OtpError extends Error {
  constructor(message: string, public code: 'rate_limited' | 'invalid_code' | 'expired' | 'too_many_attempts') {
    super(message);
    this.name = 'OtpError';
  }
}

function hmac(...parts: string[]): string {
  const h = crypto.createHmac('sha256', SECRET as string);
  h.update(parts.join('|'));
  return h.digest('hex');
}

function hashCode(phone: string, purpose: string, code: string): string {
  return hmac('otp-code', phone, purpose, code);
}

function timingSafeStringEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

function generateCode(): string {
  const max = 10 ** CODE_LENGTH;
  const n = crypto.randomInt(0, max);
  return n.toString().padStart(CODE_LENGTH, '0');
}

/**
 * Creates and stores a new OTP for (phone, purpose), enforcing a resend
 * cooldown so a client can't hammer the SMS API (and the Alpha SMS
 * balance). Returns the plaintext code -- the caller is responsible for
 * actually texting it (see /api/auth/otp/send).
 */
export async function createOtp(phone: string, purpose: string): Promise<string> {
  const recent = await prisma.phone_otps.findFirst({
    where: { phone, purpose },
    orderBy: { created_at: 'desc' },
  });
  if (recent && Date.now() - recent.created_at.getTime() < RESEND_COOLDOWN_MS) {
    const waitSec = Math.ceil((RESEND_COOLDOWN_MS - (Date.now() - recent.created_at.getTime())) / 1000);
    throw new OtpError(`Please wait ${waitSec}s before requesting another code.`, 'rate_limited');
  }

  const code = generateCode();
  await prisma.phone_otps.create({
    data: {
      phone,
      purpose,
      otp_hash: hashCode(phone, purpose, code),
      expires_at: new Date(Date.now() + CODE_TTL_MS),
    },
  });

  return code;
}

/**
 * Checks a candidate's entered code against the most recent unconsumed OTP
 * for (phone, purpose). On success, consumes it and returns a signed proof
 * string; on failure, records the attempt (so MAX_VERIFY_ATTEMPTS is
 * enforced across repeated bad guesses) and throws OtpError.
 */
export async function verifyOtp(phone: string, code: string, purpose: string): Promise<string> {
  const otp = await prisma.phone_otps.findFirst({
    where: { phone, purpose, consumed_at: null },
    orderBy: { created_at: 'desc' },
  });

  if (!otp) {
    throw new OtpError('No verification code was sent to this number. Request a new one.', 'expired');
  }
  if (otp.expires_at.getTime() < Date.now()) {
    throw new OtpError('This code has expired. Request a new one.', 'expired');
  }
  if (otp.attempts >= MAX_VERIFY_ATTEMPTS) {
    throw new OtpError('Too many incorrect attempts. Request a new code.', 'too_many_attempts');
  }

  const matches = timingSafeStringEqual(hashCode(phone, purpose, code), otp.otp_hash);
  if (!matches) {
    await prisma.phone_otps.update({
      where: { id: otp.id },
      data: { attempts: { increment: 1 } },
    });
    const remaining = MAX_VERIFY_ATTEMPTS - (otp.attempts + 1);
    throw new OtpError(
      remaining > 0 ? `Incorrect code. ${remaining} attempt(s) left.` : 'Incorrect code. Request a new one.',
      remaining > 0 ? 'invalid_code' : 'too_many_attempts',
    );
  }

  await prisma.phone_otps.update({
    where: { id: otp.id },
    data: { consumed_at: new Date() },
  });

  return signProof(phone, purpose);
}

function signProof(phone: string, purpose: string): string {
  const expiresAt = Date.now() + PROOF_TTL_MS;
  const sig = hmac('otp-proof', phone, purpose, String(expiresAt));
  return Buffer.from(`${phone}|${purpose}|${expiresAt}|${sig}`).toString('base64url');
}

/**
 * Validates a proof string minted by verifyOtp() -- used server-side by
 * /api/auth/register to confirm the phone on the registration request was
 * really OTP-verified, without trusting a plain boolean from the client.
 */
export function verifyProof(proof: string, phone: string, purpose: string): boolean {
  try {
    const decoded = Buffer.from(proof, 'base64url').toString('utf8');
    const [proofPhone, proofPurpose, expiresAtStr, sig] = decoded.split('|');
    if (!proofPhone || !proofPurpose || !expiresAtStr || !sig) return false;
    if (proofPhone !== phone || proofPurpose !== purpose) return false;
    if (Date.now() > Number(expiresAtStr)) return false;

    const expected = hmac('otp-proof', proofPhone, proofPurpose, expiresAtStr);
    return timingSafeStringEqual(sig, expected);
  } catch {
    return false;
  }
}
