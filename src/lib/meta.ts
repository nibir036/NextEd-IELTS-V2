type FbqFn = (...args: unknown[]) => void;
declare global {
  interface Window {
    fbq?: FbqFn;
  }
}

export type MetaEvent =
  | "Lead"
  | "CompleteRegistration"
  | "Purchase"
  | "Contact"
  | "SubmitApplication";

export type MetaUser = {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  externalId?: string; // e.g. Firebase uid
};

export type MetaCustomData = {
  value?: number;
  currency?: string;
  content_name?: string;
};

function readCookie(name: string): string | undefined {
  const row = document.cookie
    .split("; ")
    .find((r) => r.startsWith(name + "="));
  return row ? decodeURIComponent(row.slice(name.length + 1)) : undefined;
}

function newEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Captures the fbclid query param from the current URL and stores it
 * as the _fbc cookie so it survives page changes and still works
 * even if an ad blocker stops the pixel from setting it.
 */
export function captureFbclid(): void {
  const fbclid = new URLSearchParams(window.location.search).get("fbclid");
  if (!fbclid) return;
  const current = readCookie("_fbc");
  if (current && current.includes(fbclid)) return;
  const value = `fb.1.${Date.now()}.${fbclid}`;
  document.cookie = `_fbc=${value}; path=/; max-age=${60 * 60 * 24 * 90}; SameSite=Lax; Secure`;
}

/**
 * Fires the SAME event to:
 *   1. The browser pixel (fbq('track', ...))
 *   2. Your server API route (/api/meta/capi) which forwards to Meta's
 *      Conversions API
 *
 * Both calls share the same eventId so Meta counts them as one event
 * (deduplication).
 */
export async function trackMetaEvent(
  eventName: MetaEvent,
  opts: { user?: MetaUser; customData?: MetaCustomData } = {}
): Promise<void> {
  const eventId = newEventId();

  // 1. Browser pixel
  window.fbq?.("track", eventName, opts.customData ?? {}, {
    eventID: eventId,
  });

  // 2. Server (Conversions API)
  try {
    await fetch("/api/meta/capi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        eventName,
        eventId,
        eventSourceUrl: window.location.href,
        customData: opts.customData,
        user: opts.user ?? {},
        fbc: readCookie("_fbc"),
        fbp: readCookie("_fbp"),
      }),
    });
  } catch (err) {
    console.warn("Meta CAPI call failed", err);
  }
}
