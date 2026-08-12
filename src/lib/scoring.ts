// Auto-scoring for structured (listening/reading) tests.

// Normalise a free-text answer for comparison: lowercase, trim, collapse
// spaces, strip surrounding punctuation. Keeps internal hyphens/apostrophes.
export function normalizeAnswer(s: string): string {
  return String(s ?? '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/^[^a-z0-9'-]+|[^a-z0-9'-]+$/g, '');
}

// Is a user's answer correct against the accepted list?
// - text_input: normalised exact match against any accepted variant.
// - single_choice: letter must equal the (single) accepted letter.
// - multi_choice: the SET of chosen letters must equal the accepted set exactly.
export function isCorrect(
  type: string,
  userAnswer: unknown,
  accepted: string[],
): boolean {
  const acc = accepted.map((a) => normalizeAnswer(a));

  if (type === 'multi_choice') {
    const chosen = Array.isArray(userAnswer)
      ? userAnswer.map((x) => normalizeAnswer(String(x)))
      : [];
    if (chosen.length !== acc.length) return false;
    const set = new Set(acc);
    return chosen.every((c) => set.has(c)) && new Set(chosen).size === chosen.length;
  }

  const ans = normalizeAnswer(
    Array.isArray(userAnswer) ? userAnswer.join(' ') : String(userAnswer ?? ''),
  );
  if (!ans) return false;
  return acc.includes(ans);
}

// IELTS Listening raw-score (out of 40) -> band. Standard public conversion.
// For partial tests we scale the raw score up to a /40 basis before lookup.
const LISTENING_BANDS: { min: number; band: number }[] = [
  { min: 39, band: 9.0 },
  { min: 37, band: 8.5 },
  { min: 35, band: 8.0 },
  { min: 32, band: 7.5 },
  { min: 30, band: 7.0 },
  { min: 26, band: 6.5 },
  { min: 23, band: 6.0 },
  { min: 18, band: 5.5 },
  { min: 16, band: 5.0 },
  { min: 13, band: 4.5 },
  { min: 10, band: 4.0 },
  { min: 8, band: 3.5 },
  { min: 6, band: 3.0 },
  { min: 4, band: 2.5 },
];

export function listeningBand(rawScore: number, total: number): number {
  if (total <= 0) return 0;
  const scaled = Math.round((rawScore / total) * 40);
  for (const row of LISTENING_BANDS) {
    if (scaled >= row.min) return row.band;
  }
  return 2.5;
}

// Academic Reading uses a different curve; ready for when reading is wired.
export function readingBand(rawScore: number, total: number): number {
  if (total <= 0) return 0;
  const scaled = Math.round((rawScore / total) * 40);
  const table: { min: number; band: number }[] = [
    { min: 39, band: 9.0 }, { min: 37, band: 8.5 }, { min: 35, band: 8.0 },
    { min: 33, band: 7.5 }, { min: 30, band: 7.0 }, { min: 27, band: 6.5 },
    { min: 23, band: 6.0 }, { min: 19, band: 5.5 }, { min: 15, band: 5.0 },
    { min: 13, band: 4.5 }, { min: 10, band: 4.0 }, { min: 8, band: 3.5 },
    { min: 6, band: 3.0 },
  ];
  for (const row of table) if (scaled >= row.min) return row.band;
  return 2.5;
}

// IELTS overall band = mean of the component bands, rounded to the nearest
// half band with IELTS's rule: a .25 mean rounds UP to the next half band,
// and a .75 mean rounds UP to the next whole band.
export function ieltsOverall(bands: number[]): number | null {
  const vals = bands.filter((b) => typeof b === 'number' && !Number.isNaN(b));
  if (vals.length === 0) return null;
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  const rounded = Math.round(mean * 2) / 2;
  return Math.max(0, Math.min(9, rounded));
}
