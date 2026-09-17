import { createHash, randomUUID } from "crypto";

// Server-side-only Conversions API sender. lib/meta.ts's trackMetaEvent is
// browser-only (uses window.fbq + document.cookie), so a purely
// server-side flow with no request/response cycle to a browser -- like
// OTP verification -- can't use it. This factors out the same
// hash/payload logic api/meta/capi/route.ts uses for browser-triggered
// events, so a server route can send a CAPI event directly without an
// internal HTTP round trip, and both places stay in sync.
//
// Never throws -- a Meta/network hiccup here should never break whatever
// real user-facing flow (signup, etc.) is calling this.

const GRAPH_VERSION = "v26.0";
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE; // remove before go-live
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export type MetaCapiEventName =
  | "Lead"
  | "CompleteRegistration"
  | "Purchase"
  | "Contact"
  | "SubmitApplication";

export type MetaCapiUser = {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  externalId?: string;
};

export type MetaCapiCustomData = {
  value?: number;
  currency?: string;
  content_name?: string;
};

const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");

function clean(v?: string): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim().toLowerCase();
  return t.length ? t : undefined;
}

/**
 * Same normalization as api/meta/capi/route.ts's cleanPhone: BD numbers
 * (01XXXXXXXXX, 11 digits) get the country code prefixed to 8801XXXXXXXXX;
 * Meta wants digits only, with country code.
 */
function cleanPhoneForMeta(v?: string): string | undefined {
  if (typeof v !== "string") return undefined;
  let d = v.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.length === 11 && d.startsWith("01")) d = "88" + d;
  return d.length ? d : undefined;
}

export async function sendMetaCapiEvent(
  eventName: MetaCapiEventName,
  opts: {
    user?: MetaCapiUser;
    customData?: MetaCapiCustomData;
    eventSourceUrl?: string;
    fbc?: string;
    fbp?: string;
    clientIp?: string;
    userAgent?: string;
  } = {}
): Promise<void> {
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.warn(`Meta CAPI: PIXEL_ID/ACCESS_TOKEN not set, skipping ${eventName}`);
    return;
  }

  const { user = {}, customData, eventSourceUrl, fbc, fbp, clientIp, userAgent } = opts;

  const email = clean(user.email);
  const phone = cleanPhoneForMeta(user.phone);
  const firstName = clean(user.firstName);
  const lastName = clean(user.lastName);
  const externalId = user.externalId || undefined;

  const userData: Record<string, unknown> = {
    client_user_agent: userAgent,
    client_ip_address: clientIp,
    fbc,
    fbp,
    em: email ? [sha256(email)] : undefined,
    ph: phone ? [sha256(phone)] : undefined,
    fn: firstName ? sha256(firstName) : undefined,
    ln: lastName ? sha256(lastName) : undefined,
    external_id: externalId ? [sha256(externalId)] : undefined,
  };
  for (const key of Object.keys(userData)) {
    if (userData[key] === undefined) delete userData[key];
  }

  const event: Record<string, unknown> = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: randomUUID(),
    action_source: "website",
    event_source_url: eventSourceUrl ?? SITE_URL,
    user_data: userData,
  };
  if (customData) {
    event.custom_data = customData;
  }

  const payload: Record<string, unknown> = {
    data: [event],
    access_token: ACCESS_TOKEN,
  };
  if (TEST_EVENT_CODE) {
    payload.test_event_code = TEST_EVENT_CODE;
  }

  try {
    const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    if (!res.ok) {
      const json = await res.json().catch(() => null);
      console.error(`Meta CAPI error (${eventName})`, json);
    }
  } catch (err) {
    console.warn(`Meta CAPI call failed (${eventName})`, err);
  }
}
