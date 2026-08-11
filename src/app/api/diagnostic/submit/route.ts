import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { prisma } from '../../../../lib/prisma';
import { getSessionUserId } from '../../../../lib/session';
import { DIAGNOSTIC_PROMPT, DIAGNOSTIC_MIN_WORDS } from '../../../../lib/diagnostic';

function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY environment variable is missing.');
  return new GoogleGenAI({ apiKey, httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } });
}

function toHalfBand(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.round(Math.max(0, Math.min(9, n)) * 2) / 2;
}

const SYSTEM_INSTRUCTION = `You are a certified senior IELTS Writing Examiner giving a PLACEMENT estimate from a short (80-150 word) writing sample. Mark strictly and consistently against the official public IELTS Writing band descriptors. You are calibrated and NOT lenient.

Score the four official criteria, each 0-9 in whole or half bands:
1. Task Response: clear position, relevant and developed ideas within the short length.
2. Coherence & Cohesion: logical organisation and natural linking.
3. Lexical Resource: range, precision and control of vocabulary; spelling.
4. Grammatical Range & Accuracy: range of structures; frequency/impact of errors.

CALIBRATION ANCHORS:
- Band 5: partial task response; underdeveloped; frequent errors; limited vocabulary.
- Band 6: addressed but uneven; generally organised; mix of accurate/faulty structures.
- Band 7: clear position; well organised; good range; only occasional errors.
- Band 8: fully developed for the length; wide, natural, precise language; rare errors.

RULES:
- This is a short sample: judge proportionally, but do not inflate. Do not reward mere length.
- Empty, off-topic, gibberish, or non-English prose scores at or below 3.0.
- overallBand MUST equal the average of the four criteria, rounded to nearest 0.5.
- All five band numbers MUST be in 0.5 increments.
- Feedback must reference the actual text. No generic praise.`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    overallBand: { type: Type.NUMBER },
    taskResponseScore: { type: Type.NUMBER },
    coherenceScore: { type: Type.NUMBER },
    lexicalScore: { type: Type.NUMBER },
    grammarScore: { type: Type.NUMBER },
    taskResponseFeedback: { type: Type.STRING },
    coherenceFeedback: { type: Type.STRING },
    lexicalFeedback: { type: Type.STRING },
    grammarFeedback: { type: Type.STRING },
    generalSummary: { type: Type.STRING },
    keyImprovements: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: [
    'overallBand', 'taskResponseScore', 'coherenceScore', 'lexicalScore', 'grammarScore',
    'taskResponseFeedback', 'coherenceFeedback', 'lexicalFeedback', 'grammarFeedback',
    'generalSummary', 'keyImprovements',
  ],
};

export async function POST(req: NextRequest) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ error: 'You must be logged in to take the diagnostic.' }, { status: 401 });
    }

    const { essayText } = (await req.json()) ?? {};
    const words = essayText ? String(essayText).trim().split(/\s+/).length : 0;
    if (!essayText || words < DIAGNOSTIC_MIN_WORDS) {
      return NextResponse.json(
        { error: `Please write at least ${DIAGNOSTIC_MIN_WORDS} words so we can estimate your level.` },
        { status: 400 },
      );
    }

    const ai = getGenAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `IELTS placement sample — estimate this candidate's level.

TASK PROMPT:
"""
${DIAGNOSTIC_PROMPT}
"""

CANDIDATE RESPONSE (${words} words):
"""
${essayText}
"""

Give a strict, specific placement estimate against the official band descriptors.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    if (!response.text) throw new Error('No evaluation returned from AI.');
    const raw = JSON.parse(response.text.trim());

    const taskResponseScore = toHalfBand(Number(raw.taskResponseScore));
    const coherenceScore = toHalfBand(Number(raw.coherenceScore));
    const lexicalScore = toHalfBand(Number(raw.lexicalScore));
    const grammarScore = toHalfBand(Number(raw.grammarScore));
    const overallBand = toHalfBand((taskResponseScore + coherenceScore + lexicalScore + grammarScore) / 4);

    const evalData = {
      ...raw,
      taskResponseScore, coherenceScore, lexicalScore, grammarScore, overallBand,
      diagnostic: true,
    };

    await prisma.$transaction([
      prisma.submissions.create({
        data: {
          user_id: userId,
          kind: 'single_test',
          skill: 'writing',
          status: 'scored',
          band_score: overallBand,
          feedback: evalData,
          answers: { diagnostic: true, prompt: DIAGNOSTIC_PROMPT, essayText, wordCount: words },
          scored_at: new Date(),
        },
      }),
      prisma.users.update({
        where: { id: userId },
        data: { overall_band: overallBand, onboarding_complete: true },
      }),
      prisma.user_skill_bands.upsert({
        where: { user_id_skill: { user_id: userId, skill: 'writing' } },
        create: { user_id: userId, skill: 'writing', band: overallBand },
        update: { band: overallBand, updated_at: new Date() },
      }),
    ]);

    return NextResponse.json({ ...evalData, estimatedBand: overallBand });
  } catch (err: unknown) {
    console.error('Diagnostic submit error:', err);
    const e = err as Error;
    return NextResponse.json({ error: e.message || 'Failed to evaluate the diagnostic.' }, { status: 500 });
  }
}
