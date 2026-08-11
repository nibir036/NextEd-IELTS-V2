import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { prisma } from '../../../../lib/prisma';
import { getSessionUserId } from '../../../../lib/session';

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

const SYSTEM_INSTRUCTION = `You are a certified senior IELTS Writing Examiner. You mark strictly and consistently against the official public IELTS Writing band descriptors. You are calibrated and NOT lenient — you do not inflate scores to be encouraging. A mediocre essay receives a mediocre band.

Mark on the four official criteria, each 0-9 in whole or half bands:
1. Task Achievement (Task 1) / Task Response (Task 2): For Task 1, does it accurately select, report and compare the KEY features shown in the visual, with a clear overview? For Task 2, does it fully address all parts of the task with a clear, developed, supported position?
2. Coherence & Cohesion: logical organisation, paragraphing, natural (non-mechanical) cohesion and referencing.
3. Lexical Resource: range, precision and natural control of vocabulary/collocation; spelling.
4. Grammatical Range & Accuracy: range of structures; frequency/impact of errors; punctuation.

CALIBRATION ANCHORS (apply honestly):
- Band 5: task addressed only partially; ideas underdeveloped; frequent errors causing some difficulty; limited/repetitive vocabulary.
- Band 6: task addressed but development uneven; generally organised; mix of accurate and faulty structures; adequate vocabulary with errors.
- Band 7: all parts addressed with a clear position/overview; well organised; good range with only occasional errors.
- Band 8: fully addressed; well developed; wide, natural, precise language with rare errors.
- Band 9: fully extended, near-flawless, fully natural control.

RULES:
- Penalise off-topic, memorised or template-heavy responses.
- Penalise responses under the word count (150 for Task 1, 250 for Task 2).
- For Task 1: if an image/visual is provided, judge factual ACCURACY against it — penalise invented, missing or misreported data; reward a clear overview of the main trends/changes.
- If the response is empty, irrelevant, gibberish or not English prose, give bands at or below 3.0 and say so plainly.
- overallBand MUST equal the average of the four criterion scores, rounded to nearest 0.5.
- All five band numbers MUST be in 0.5 increments.
- Feedback must be specific to THIS response — reference actual words/sentences. No generic praise.`;

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
    enhancedVersionSnippet: { type: Type.STRING },
  },
  required: [
    'overallBand', 'taskResponseScore', 'coherenceScore', 'lexicalScore', 'grammarScore',
    'taskResponseFeedback', 'coherenceFeedback', 'lexicalFeedback', 'grammarFeedback',
    'generalSummary', 'keyImprovements',
  ],
};

interface TaskEval {
  overallBand: number;
  taskResponseScore: number;
  coherenceScore: number;
  lexicalScore: number;
  grammarScore: number;
  taskResponseFeedback: string;
  coherenceFeedback: string;
  lexicalFeedback: string;
  grammarFeedback: string;
  generalSummary: string;
  keyImprovements: string[];
  enhancedVersionSnippet?: string;
}

// Fetch a remote image and return Gemini inlineData (base64 + mime).
async function fetchImagePart(imageUrl: string) {
  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`Could not load the Task 1 image (HTTP ${res.status}).`);
  const mimeType = res.headers.get('content-type') || 'image/png';
  const buf = Buffer.from(await res.arrayBuffer());
  return { inlineData: { mimeType, data: buf.toString('base64') } };
}

// Evaluate a single task (optionally with an image) and normalise the bands.
async function evaluateTask(
  ai: ReturnType<typeof getGenAIClient>,
  opts: { taskLabel: string; prompt: string; essayText: string; imageUrl?: string | null },
): Promise<TaskEval> {
  const wordCount = opts.essayText.trim().split(/\s+/).length;

  const textPart = {
    text: `IELTS Writing ${opts.taskLabel} — mark this candidate response.

TASK PROMPT:
"""
${opts.prompt || 'IELTS Writing Task'}
"""

CANDIDATE RESPONSE (${wordCount} words):
"""
${opts.essayText}
"""

${opts.imageUrl ? 'The image provided is the visual this Task 1 refers to. Judge the accuracy of what the candidate reported against it.' : ''}
Mark it now against the official band descriptors. Be strict and specific.`,
  };

  const parts: unknown[] = [textPart];
  if (opts.imageUrl) {
    parts.unshift(await fetchImagePart(opts.imageUrl));
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: [{ role: 'user', parts: parts as never }],
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
  const overallBand = toHalfBand(
    (taskResponseScore + coherenceScore + lexicalScore + grammarScore) / 4,
  );

  return {
    ...raw,
    taskResponseScore,
    coherenceScore,
    lexicalScore,
    grammarScore,
    overallBand,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      testId,
      task1,
      task2,
      // Back-compat: allow the old single-task shape too.
      prompt,
      essayText,
      taskType,
    } = body ?? {};

    const ai = getGenAIClient();
    const userId = await getSessionUserId();

    // ---- Legacy single-task request (kept so nothing else breaks) ----
    if (!task1 && !task2 && essayText) {
      const single = await evaluateTask(ai, {
        taskLabel: taskType || 'Task 2',
        prompt: prompt || '',
        essayText,
      });
      let submissionId: string | null = null;
      if (userId) {
        try {
          const created = await prisma.submissions.create({
            data: {
              user_id: userId, kind: 'single_test', skill: 'writing', status: 'scored',
              band_score: single.overallBand, feedback: single,
              answers: { taskType: taskType || 'Task 2', prompt: prompt || '', essayText },
              scored_at: new Date(),
            },
            select: { id: true },
          });
          submissionId = created.id;
        } catch (e) { console.error('Writing save failed:', e); }
      }
      return NextResponse.json({ ...single, submissionId, saved: submissionId !== null });
    }

    // ---- Two-task test request ----
    if (!task1?.essayText || task1.essayText.trim().length < 20) {
      return NextResponse.json({ error: 'Your Task 1 response is too short to evaluate.' }, { status: 400 });
    }
    if (!task2?.essayText || task2.essayText.trim().length < 20) {
      return NextResponse.json({ error: 'Your Task 2 response is too short to evaluate.' }, { status: 400 });
    }

    // Evaluate both tasks. Task 1 carries the image.
    const [t1, t2] = await Promise.all([
      evaluateTask(ai, {
        taskLabel: 'Task 1',
        prompt: task1.prompt || '',
        essayText: task1.essayText,
        imageUrl: task1.imageUrl || null,
      }),
      evaluateTask(ai, {
        taskLabel: 'Task 2',
        prompt: task2.prompt || '',
        essayText: task2.essayText,
      }),
    ]);

    // Real IELTS weighting: Task 2 counts double.
    const overallBand = toHalfBand((t1.overallBand + t2.overallBand * 2) / 3);

    const feedback = { overallBand, weighting: 'Task1x1 + Task2x2 / 3', task1: t1, task2: t2 };

    let submissionId: string | null = null;
    if (userId) {
      try {
        const created = await prisma.submissions.create({
          data: {
            user_id: userId,
            kind: 'single_test',
            test_id: testId || null,
            skill: 'writing',
            status: 'scored',
            band_score: overallBand,
            feedback,
            answers: {
              task1: {
                prompt: task1.prompt || '',
                imageUrl: task1.imageUrl || null,
                essayText: task1.essayText,
                wordCount: task1.essayText.trim().split(/\s+/).length,
              },
              task2: {
                prompt: task2.prompt || '',
                essayText: task2.essayText,
                wordCount: task2.essayText.trim().split(/\s+/).length,
              },
            },
            scored_at: new Date(),
          },
          select: { id: true },
        });
        submissionId = created.id;
      } catch (saveErr) {
        console.error('Writing submission save failed:', saveErr);
      }
    }

    return NextResponse.json({ overallBand, task1: t1, task2: t2, submissionId, saved: submissionId !== null });
  } catch (err: unknown) {
    console.error('Writing evaluation error:', err);
    const e = err as Error;
    return NextResponse.json({ error: e.message || 'Failed to evaluate.' }, { status: 500 });
  }
}
