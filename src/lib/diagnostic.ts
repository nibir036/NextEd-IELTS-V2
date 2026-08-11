// Static diagnostic prompt. Kept in one place so the view and any future
// consumer share a single source of truth. The diagnostic is intentionally a
// single, universal opinion task — no images, no specialised knowledge — so a
// short response can still reveal position, reasoning, vocabulary and grammar.

export const DIAGNOSTIC_PROMPT =
  'Some people believe that success in life comes mainly from hard work, while others think it depends more on luck. Discuss both views and give your own opinion.';

export const DIAGNOSTIC_MIN_WORDS = 80;
export const DIAGNOSTIC_TARGET_WORDS = 150;