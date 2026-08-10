import { cookies } from 'next/headers';
import crypto from 'crypto';

const COOKIE_NAME = 'nexted_session';
const SECRET = process.env.SESSION_SECRET;

if (!SECRET) {
  throw new Error(
    'SESSION_SECRET environment variable is missing. Add it to .env (any long random string).',
  );
}

function sign(userId: string): string {
  const hmac = crypto.createHmac('sha256', SECRET as string);
  hmac.update(userId);
  return `${userId}.${hmac.digest('hex')}`;
}

function verify(token: string): string | null {
  const [userId, sig] = token.split('.');
  if (!userId || !sig) return null;
  const expected = sign(userId).split('.')[1];
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return null;
  return crypto.timingSafeEqual(sigBuf, expBuf) ? userId : null;
}

export async function createSession(userId: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, sign(userId), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function getSessionUserId(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verify(token);
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}