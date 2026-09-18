// Single source for the support/counselling WhatsApp number -- referenced
// by PromoBanners' "free consultation" gift modal and the site-wide
// SupportWidget (both the "free consultation" and "technical issue" call
// buttons use the same number), so it only ever needs to be typed once.
export const SUPPORT_PHONE_DISPLAY = '+8801626794269';
export const SUPPORT_PHONE_DIGITS = '8801626794269'; // no "+" -- wa.me wants it bare

export function whatsAppLink(prefilledMessage?: string): string {
  const base = `https://wa.me/${SUPPORT_PHONE_DIGITS}`;
  return prefilledMessage ? `${base}?text=${encodeURIComponent(prefilledMessage)}` : base;
}
