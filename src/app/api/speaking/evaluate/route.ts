import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { prisma } from '../../../../lib/prisma';
import { getSessionUserId } from '../../../../lib/session';
import { ieltsOverall } from '../../../../lib/scoring';

function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
  });
}

// Round to nearest 0.5, clamp to 0..9.
function toHalfBand(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.round(Math.max(0, Math.min(9, n)) * 2) / 2;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Gemini occasionally returns 503 UNAVAILABLE / 429 RESOURCE_EXHAUSTED during
// capacity spikes — these are transient and worth a few retries with backoff.
// Anything else (400 bad request, 401/403 auth, etc.) is not retried since
// retrying won't change the outcome.
function isRetryableStatus(status: unknown): boolean {
  return status === 503 || status === 429;
}

async function generateContentWithRetry(
  ai: ReturnType<typeof getGenAIClient>,
  params: Parameters<ReturnType<typeof getGenAIClient>['models']['generateContent']>[0],
  maxAttempts = 2,
) {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await ai.models.generateContent(params);
    } catch (err: unknown) {
      lastErr = err;
      const status = (err as { status?: number; code?: number })?.status
        ?? (err as { code?: number })?.code;
      const retryable = isRetryableStatus(status);
      if (!retryable || attempt === maxAttempts) throw err;
      // Exponential backoff with jitter: ~1s, ~2s, ~4s (capped).
      const delayMs = Math.min(1000 * 2 ** (attempt - 1), 8000) + Math.random() * 300;
      console.warn(
        `Gemini request failed with status ${status} (attempt ${attempt}/${maxAttempts}), retrying in ${Math.round(delayMs)}ms…`,
      );
      await sleep(delayMs);
    }
  }
  throw lastErr;
}

// Newer models (e.g. gemini-3.6-flash) can have free-tier capacity that runs
// well below its advertised quota right after launch — Google's own docs
// note listed rate limits "are not guaranteed." Rather than hammering the
// same overloaded model, fall back to an older, more established model once
// retries on the primary are exhausted.
const MODEL_FALLBACK_CHAIN = ['gemini-3.6-flash', 'gemini-2.5-flash'] as const;

async function generateContentResilient(
  ai: ReturnType<typeof getGenAIClient>,
  baseParams: Omit<Parameters<ReturnType<typeof getGenAIClient>['models']['generateContent']>[0], 'model'>,
) {
  let lastErr: unknown;
  for (const model of MODEL_FALLBACK_CHAIN) {
    try {
      return await generateContentWithRetry(ai, { ...baseParams, model });
    } catch (err: unknown) {
      lastErr = err;
      const status = (err as { status?: number; code?: number })?.status
        ?? (err as { code?: number })?.code;
      if (!isRetryableStatus(status)) throw err; // not a capacity issue — no point trying another model
      console.warn(`Model "${model}" unavailable after retries, falling back to the next model…`);
    }
  }
  throw lastErr;
}

const SYSTEM_INSTRUCTION = `You are a certified senior IELTS Speaking Examiner. You mark strictly and consistently against the official public IELTS Speaking band descriptors, exactly as a real examiner would after a live interview. You are calibrated and NOT lenient — you do not inflate scores to be encouraging. A mediocre performance receives a mediocre band.

You will receive up to three audio clips: the candidate's recorded answers for Part 1 (Introduction & Interview), Part 2 (Individual Long Turn / cue card), and Part 3 (Two-Way Discussion), each preceded by the exact questions/cue card that was asked. Some parts may be missing — grade holistically on whatever is provided, and say in generalSummary which parts you could not assess.

Mark on the four official criteria, each 0-9 in whole or half bands:
1. Fluency & Coherence: speech rate and continuity, hesitation, self-correction, logical development and linking of ideas, appropriate use of discourse markers.
2. Lexical Resource: range and precision of vocabulary, paraphrase ability, idiomatic and topic-specific language, natural collocation.
3. Grammatical Range & Accuracy: range of simple and complex structures attempted, frequency and impact of errors.
4. Pronunciation: individual sounds, word and sentence stress, intonation, rhythm, and overall intelligibility to a listener (infer this from the audio itself, not the transcript).

CALIBRATION ANCHORS (apply honestly):
- Band 5: keeps going but with noticeable hesitation and repetition; limited range of structures/vocabulary with frequent errors; pronunciation causes some listener strain.
- Band 6: willing to speak at length but coherence sometimes breaks down; mix of simple and complex structures with some errors; some mispronunciations that rarely impede understanding.
- Band 7: speaks at length without noticeable effort, some hesitation over language rather than ideas; flexible vocabulary; a range of complex structures with some errors; generally clear pronunciation, some L1 influence.
- Band 8: fluent with only occasional repetition/self-correction, minimal hesitation; wide, natural, idiomatic vocabulary; wide range of structures with rare errors; wide range of pronunciation features used effectively.
- Band 9: fully natural, effortless, native-like fluency, precision and pronunciation.

RULES:
- Penalise short, underdeveloped answers, memorised/scripted-sounding responses, and answers that don't actually address the question asked.
- If a clip is silent, empty, off-topic, unintelligible, or not English speech, mark that part at or below Band 3 and say so plainly in generalSummary — do not guess content that isn't there.
- overallBand MUST equal the average of the four criterion scores, rounded to nearest 0.5.
- All five band numbers MUST be in 0.5 increments.
- Feedback must be specific to what was actually said — reference real words/phrases the candidate used. No generic praise.
- Transcribe each provided part as accurately as possible (best-effort orthographic transcript, fillers like "um"/"uh" included) into the transcript object; use an empty string for any part that was not provided.`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    overallBand: { type: Type.NUMBER },
    fluencyScore: { type: Type.NUMBER },
    lexicalScore: { type: Type.NUMBER },
    grammarScore: { type: Type.NUMBER },
    pronunciationScore: { type: Type.NUMBER },
    fluencyFeedback: { type: Type.STRING },
    lexicalFeedback: { type: Type.STRING },
    grammarFeedback: { type: Type.STRING },
    pronunciationFeedback: { type: Type.STRING },
    generalSummary: { type: Type.STRING },
    keyImprovements: { type: Type.ARRAY, items: { type: Type.STRING } },
    transcript: {
      type: Type.OBJECT,
      properties: {
        part1: { type: Type.STRING },
        part2: { type: Type.STRING },
        part3: { type: Type.STRING },
      },
      required: ['part1', 'part2', 'part3'],
    },
  },
  required: [
    'overallBand', 'fluencyScore', 'lexicalScore', 'grammarScore', 'pronunciationScore',
    'fluencyFeedback', 'lexicalFeedback', 'grammarFeedback', 'pronunciationFeedback',
    'generalSummary', 'keyImprovements', 'transcript',
  ],
};

interface SpeakingEval {
  overallBand: number;
  fluencyScore: number;
  lexicalScore: number;
  grammarScore: number;
  pronunciationScore: number;
  fluencyFeedback: string;
  lexicalFeedback: string;
  grammarFeedback: string;
  pronunciationFeedback: string;
  generalSummary: string;
  keyImprovements: string[];
  transcript: { part1: string; part2: string; part3: string };
}

interface AudioClip {
  // data URL ("data:audio/webm;base64,...") or raw base64 — both accepted.
  base64: string;
  mimeType?: string;
}

interface PartInput {
  audio?: AudioClip | null;
  contextText: string; // the questions / cue card the candidate was answering
}

function toInlineAudioPart(clip: AudioClip) {
  let base64 = clip.base64;
  let mimeType = clip.mimeType || 'audio/webm';

  // Handles any number of ";param=value" segments before ";base64," —
  // e.g. "data:audio/webm;codecs=opus;base64,XXXX" (MediaRecorder's actual
  // mime type includes a codecs parameter, which a naive single-";" regex
  // does not expect, so a broader match on the first comma is needed).
  if (base64.startsWith('data:')) {
    const commaIdx = base64.indexOf(',');
    if (commaIdx !== -1) {
      const header = base64.slice('data:'.length, commaIdx);
      const [mt] = header.split(';');
      if (mt) mimeType = mt;
      base64 = base64.slice(commaIdx + 1);
    }
  }

  // Strip any leftover codec parameters — Gemini expects a bare mime type.
  mimeType = mimeType.split(';')[0].trim();

  return { inlineData: { mimeType, data: base64 } };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { testId, testTitle, part1, part2, part3 } = body as {
      testId?: string;
      testTitle?: string;
      part1?: PartInput;
      part2?: PartInput;
      part3?: PartInput;
    };

    const parts: { label: 'Part 1' | 'Part 2' | 'Part 3'; input?: PartInput }[] = [
      { label: 'Part 1', input: part1 },
      { label: 'Part 2', input: part2 },
      { label: 'Part 3', input: part3 },
    ];

    const recorded = parts.filter((p) => p.input?.audio?.base64);
    if (recorded.length === 0) {
      return NextResponse.json(
        { error: 'Record at least one part before submitting for evaluation.' },
        { status: 400 },
      );
    }

    const ai = getGenAIClient();
    const userId = await getSessionUserId();

    const contentParts: unknown[] = [];
    for (const p of parts) {
      if (!p.input?.audio?.base64) continue;
      contentParts.push({
        text: `${p.label} — the candidate was asked:\n"""\n${p.input.contextText || '(no prompt text provided)'}\n"""\nHere is the candidate's recorded audio response for ${p.label}:`,
      });
      contentParts.push(toInlineAudioPart(p.input.audio));
    }
    contentParts.push({
      text: 'Now transcribe each provided part and mark this candidate\'s overall Speaking performance against the official band descriptors. Be strict and specific.',
    });

    const response = await generateContentResilient(ai, {
      contents: [{ role: 'user', parts: contentParts as never }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    if (!response.text) throw new Error('No evaluation returned from AI.');
    const raw = JSON.parse(response.text.trim());

    const fluencyScore = toHalfBand(Number(raw.fluencyScore));
    const lexicalScore = toHalfBand(Number(raw.lexicalScore));
    const grammarScore = toHalfBand(Number(raw.grammarScore));
    const pronunciationScore = toHalfBand(Number(raw.pronunciationScore));
    const overallBand = toHalfBand(
      (fluencyScore + lexicalScore + grammarScore + pronunciationScore) / 4,
    );

    const evalResult: SpeakingEval = {
      ...raw,
      fluencyScore,
      lexicalScore,
      grammarScore,
      pronunciationScore,
      overallBand,
    };

    let submissionId: string | null = null;
    if (userId) {
      try {
        const created = await prisma.submissions.create({
          data: {
            user_id: userId,
            kind: 'single_test',
            test_id: testId || null,
            skill: 'speaking',
            status: 'scored',
            band_score: overallBand,
            feedback: evalResult,
            answers: {
              testTitle: testTitle || null,
              partsRecorded: recorded.map((p) => p.label),
              transcript: evalResult.transcript,
            },
            scored_at: new Date(),
          },
          select: { id: true },
        });
        submissionId = created.id;

        // Update the user's speaking skill band to their BEST band so far,
        // then recompute the overall band from all known skill bands —
        // mirrors the pattern in listening/submit/route.ts so the dashboard
        // (which reads from user_skill_bands, not submissions directly)
        // picks up the new speaking score.
        const existing = await prisma.user_skill_bands.findUnique({
          where: { user_id_skill: { user_id: userId, skill: 'speaking' } },
          select: { band: true },
        });
        const prevBest = existing?.band !== null && existing?.band !== undefined
          ? Number(existing.band)
          : null;
        const bestBand = prevBest === null ? overallBand : Math.max(prevBest, overallBand);

        if (bestBand !== prevBest) {
          await prisma.user_skill_bands.upsert({
            where: { user_id_skill: { user_id: userId, skill: 'speaking' } },
            create: { user_id: userId, skill: 'speaking', band: bestBand },
            update: { band: bestBand, updated_at: new Date() },
          });
        }

        const allBands = await prisma.user_skill_bands.findMany({
          where: { user_id: userId },
          select: { band: true },
        });
        const overall = ieltsOverall(
          allBands.map((b) => (b.band !== null ? Number(b.band) : NaN)).filter((n) => !Number.isNaN(n)),
        );
        if (overall !== null) {
          await prisma.users.update({ where: { id: userId }, data: { overall_band: overall } });
        }
      } catch (saveErr) {
        console.error('Speaking submission save failed:', saveErr);
      }
    }

    return NextResponse.json({ ...evalResult, submissionId, saved: submissionId !== null });
  } catch (err: unknown) {
    console.error('Speaking evaluation error:', err);
    const errorObj = err as Error & { status?: number; code?: number };
    const status = errorObj?.status ?? errorObj?.code;
    const message = isRetryableStatus(status)
      ? 'The AI service is experiencing high demand right now. This is temporary and unrelated to your recording — please try submitting again in a minute.'
      : (errorObj.message || 'Speaking evaluation failed.');
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
