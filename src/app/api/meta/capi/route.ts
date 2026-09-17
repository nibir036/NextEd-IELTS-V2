import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Config from environment variables
// ---------------------------------------------------------------------------
const GRAPH_VERSION = "v26.0"; // current as of Sep 2026
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE; // remove before go-live
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

// Only these events are accepted. Add more as needed.
const ALLOWED_EVENTS = new Set([
  "Lead",
  "CompleteRegistration",
  "Purchase",
  "Contact",
  "SubmitApplication",
]);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type Body = {
  eventName: string;
  eventId: string;
  eventSourceUrl?: string;
  customData?: { value?: number; currency?: string; content_name?: string };
  user?: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    externalId?: string;
  };
  fbc?: string;
  fbp?: string;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");

function clean(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim().toLowerCase();
  return t.length ? t : undefined;
}

/**
 * Meta wants digits only, with country code.
 * BD numbers: 01XXXXXXXXX (11 digits) become 8801XXXXXXXXX.
 */
function cleanPhone(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  let d = v.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.length === 11 && d.startsWith("01")) d = "88" + d;
  return d.length ? d : undefined;
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    return NextResponse.json(
      { ok: false, error: "Meta env vars missing" },
      { status: 500 }
    );
  }

  // Reject calls from other websites
  const origin = req.headers.get("origin");
  if (SITE_URL && origin && new URL(origin).host !== new URL(SITE_URL).host) {
    return NextResponse.json(
      { ok: false, error: "forbidden" },
      { status: 403 }
    );
  }

  let body: Partial<Body>;
  try {
    body = (await req.json()) as Partial<Body>;
  } catch {
    return NextResponse.json(
      { ok: false, error: "bad json" },
      { status: 400 }
    );
  }

  const {
    eventName,
    eventId,
    eventSourceUrl,
    customData,
    user = {},
    fbc,
    fbp,
  } = body;

  // Validate
  if (
    !eventName ||
    !ALLOWED_EVENTS.has(eventName) ||
    typeof eventId !== "string"
  ) {
    return NextResponse.json(
      { ok: false, error: "invalid event" },
      { status: 400 }
    );
  }
  if (
    eventName === "Purchase" &&
    (typeof customData?.value !== "number" || !customData?.currency)
  ) {
    return NextResponse.json(
      { ok: false, error: "Purchase needs value and currency" },
      { status: 400 }
    );
  }

  // Extract IP from proxy headers
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    undefined;

  // Build user_data (hash PII, pass fbc/fbp/ip/ua as-is)
  const email = clean(user.email);
  const phone = cleanPhone(user.phone);
  const firstName = clean(user.firstName);
  const lastName = clean(user.lastName);
  const externalId =
    typeof user.externalId === "string" && user.externalId
      ? user.externalId
      : undefined;

  const userData: Record<string, unknown> = {
    client_user_agent: req.headers.get("user-agent") ?? undefined,
    client_ip_address: ip,
    fbc: typeof fbc === "string" ? fbc : undefined,
    fbp: typeof fbp === "string" ? fbp : undefined,
    em: email ? [sha256(email)] : undefined,
    ph: phone ? [sha256(phone)] : undefined,
    fn: firstName ? sha256(firstName) : undefined,
    ln: lastName ? sha256(lastName) : undefined,
    external_id: externalId ? [sha256(externalId)] : undefined,
  };
  // Strip undefined keys
  for (const key of Object.keys(userData)) {
    if (userData[key] === undefined) delete userData[key];
  }

  // Build event payload
  const event: Record<string, unknown> = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
    action_source: "website",
    event_source_url:
      typeof eventSourceUrl === "string" ? eventSourceUrl : SITE_URL,
    user_data: userData,
  };
  if (customData) {
    event.custom_data = {
      value: customData.value,
      currency: customData.currency,
      content_name: customData.content_name,
    };
  }

  // Build top-level request body
  const payload: Record<string, unknown> = {
    data: [event],
    access_token: ACCESS_TOKEN,
  };
  if (TEST_EVENT_CODE) {
    payload.test_event_code = TEST_EVENT_CODE;
  }

  // Send to Meta
  const res = await fetch(
    `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    }
  );
  const json = await res.json();

  if (!res.ok) {
    console.error("Meta CAPI error", json);
    return NextResponse.json(
      { ok: false, error: json?.error?.message },
      { status: 502 }
    );
  }
  return NextResponse.json({
    ok: true,
    events_received: json?.events_received,
  });
}
