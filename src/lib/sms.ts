// Thin client for Alpha SMS BD (api.sms.net.bd) -- the SMS gateway used to
// text one-time verification codes to candidates during signup. Only OTP
// delivery goes through here for now; nothing else in the app sends SMS.
//
// API reference (https://sms.bd/api):
//   POST https://api.sms.net.bd/sendsms
//   body: api_key, msg, to (comma-separated for multiple recipients)
//   success: { "error": 0, "msg": "...", "data": { "request_id": N } }
//   failure: { "error": <non-zero>, "msg": "..." }
//
// Notable failure the account can hit on a low/unrecharged balance: error
// 421 ("Please recharge or send SMS to your registered number only.") --
// surfaced as-is in the thrown error so the caller/UI can explain it.

const SEND_URL = 'https://api.sms.net.bd/sendsms';
const API_KEY = process.env.ALPHA_SMS_API_KEY;

export class SmsError extends Error {
  constructor(message: string, public code?: number) {
    super(message);
    this.name = 'SmsError';
  }
}

/**
 * Normalizes a Bangladeshi phone number to the bare-digits 8801XXXXXXXXX
 * form Alpha SMS expects. Strips any "+880"/"880" country-code prefix
 * first, then strips whatever's left over of a local leading zero, then
 * re-adds a single clean "880" -- this handles every shape the signup
 * form's country-code select + free-typed number field can produce,
 * including the double-prefix case where a candidate picks "+880" *and*
 * still types the conventional local "01..." form (e.g. "+880 01712345678"),
 * which would otherwise become the invalid "88001712345678".
 */
export function toAlphaSmsNumber(rawPhone: string): string {
  let digits = rawPhone.replace(/[^\d]/g, '');
  if (digits.startsWith('880')) {
    digits = digits.slice(3);
  }
  digits = digits.replace(/^0+/, '');
  return `880${digits}`;
}

// Bangladeshi mobile numbers: 880 + 1 + 9 more digits (13 digits total).
const BD_MOBILE_RE = /^8801\d{9}$/;

export async function sendSms(toPhone: string, message: string): Promise<{ requestId: number }> {
  if (!API_KEY) {
    throw new SmsError('ALPHA_SMS_API_KEY environment variable is missing.');
  }

  const to = toAlphaSmsNumber(toPhone);
  if (!BD_MOBILE_RE.test(to)) {
    // Alpha SMS BD only delivers to Bangladeshi numbers (the account's own
    // dashboard explicitly warns against using it for international OTP),
    // so fail with a clear, actionable message instead of the API's opaque
    // "No valid number found" (error 416).
    throw new SmsError(
      'SMS verification currently only supports Bangladeshi mobile numbers (+880). Please use a +880 number to receive the code.',
    );
  }

  const body = new URLSearchParams({ api_key: API_KEY, msg: message, to });

  const res = await fetch(SEND_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  const data = (await res.json().catch(() => null)) as
    | { error: number; msg: string; data?: { request_id: number } }
    | null;

  if (!data || data.error !== 0) {
    throw new SmsError(data?.msg || `SMS send failed (HTTP ${res.status}).`, data?.error);
  }

  return { requestId: data.data?.request_id ?? 0 };
}
