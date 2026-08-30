import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getSessionUserId } from '../../../../lib/session';
import { ieltsOverall } from '../../../../lib/scoring';
import {
  submitAndAwaitReport,
  SpeakingApiError,
  type SpeakingReport,
  type SpeakingSessionStatus,
  type SubmitSegmentInput,
} from '../../../../lib/speakingApiClient';

// Round to nearest 0.5, clamp to 0..9.
function toHalfBand(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.round(Math.max(0, Math.min(9, n)) * 2) / 2;
}

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
  [key: string]: unknown; // satisfies Prisma's InputJsonValue for the `feedback` Json column
}

interface IncomingSegment {
  id: string;
  partNumber: 1 | 2 | 3;
  label: string;
  questionText: string;
  audio: { base64: string; mimeType?: string };
}

// Maps the FastAPI service's session + report shape onto the SpeakingEval
// contract the frontend (SpeakingView.tsx) already expects, so no frontend
// changes are needed for this swap.
function mapReportToSpeakingEval(report: SpeakingReport): SpeakingEval {
  const fluencyScore = toHalfBand(Number(report.scores.fluency));
  const lexicalScore = toHalfBand(Number(report.scores.lexical));
  const grammarScore = toHalfBand(Number(report.scores.grammar));
  const pronunciationScore = toHalfBand(Number(report.scores.pronunciation));
  const overallBand = toHalfBand((fluencyScore + lexicalScore + grammarScore + pronunciationScore) / 4);

  const perPart = report.evidence.per_part_feedback || [];
  const generalSummary = report.evidence.generalSummary
    || perPart.join(' ')
    || 'Evaluation completed.';

  return {
    overallBand,
    fluencyScore,
    lexicalScore,
    grammarScore,
    pronunciationScore,
    fluencyFeedback: report.evidence.fluency || '',
    lexicalFeedback: report.evidence.lexical || '',
    grammarFeedback: report.evidence.grammar || '',
    pronunciationFeedback: report.evidence.pronunciation || '',
    generalSummary,
    keyImprovements: report.evidence.keyImprovements || [],
  };
}

// Builds a per-segment transcript summary keyed by label, for storing
// alongside the submission (not shown to the user inline, but useful for
// support/debugging and any future "review your transcript" feature).
function buildTranscriptSummary(session: SpeakingSessionStatus): Record<string, string> {
  const out: Record<string, string> = {};
  for (const p of session.parts) {
    out[p.label || p.segment_id] = p.transcript || '';
  }
  return out;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { testId, testTitle, segments } = body as {
      testId?: string;
      testTitle?: string;
      segments?: IncomingSegment[];
    };

    const recorded = (segments || []).filter((s) => s?.audio?.base64);
    if (recorded.length === 0) {
      return NextResponse.json(
        { error: 'Record at least one segment before submitting for evaluation.' },
        { status: 400 },
      );
    }

    const userId = await getSessionUserId();

    const submitSegments: SubmitSegmentInput[] = recorded.map((s) => ({
      id: s.id,
      partNumber: s.partNumber,
      label: s.label,
      questionText: s.questionText,
      audio: s.audio,
    }));

    const { session, report } = await submitAndAwaitReport({ userId, segments: submitSegments });

    const evalResult = mapReportToSpeakingEval(report);
    const overallBand = evalResult.overallBand;

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
              segmentsRecorded: recorded.map((s) => s.label),
              transcript: buildTranscriptSummary(session),
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
    const status = err instanceof SpeakingApiError && err.status ? 502 : 500;
    const message = err instanceof Error ? err.message : 'Speaking evaluation failed.';
    return NextResponse.json({ error: message }, { status });
  }
}
