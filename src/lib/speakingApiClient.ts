// Client for the external FastAPI + RunPod speaking-evaluation service.
// That service: VAD (Silero) -> ASR (Groq Whisper) -> pronunciation (RunPod
// GOP) -> one session-level Groq LLM call -> band scores + evidence.
//
// Each IELTS part is now potentially made up of several separately-recorded
// segments (e.g. Part 1 = intro + 3 topic cards, each its own short audio
// clip) rather than one audio file per part. The backend groups segments by
// part_number when building the LLM prompt, so Part 1's 4 segments still
// read as one coherent Part 1 to the scoring model.
//
// It's async: POST /sessions/submit kicks off a background task and returns
// immediately with status "pending". We poll GET /sessions/{id} until the
// session leaves "pending"/"processing", then read the final report from
// GET /sessions/{id}/report.

const BASE_URL = process.env.SPEAKING_API_BASE_URL;
const API_KEY = process.env.SPEAKING_API_KEY;

const POLL_INTERVAL_MS = 2000;
// Generous ceiling: VAD + Whisper + RunPod GOP per segment (up to 7 now,
// each involving a possible cold-worker wait on RunPod's side) + one Groq
// call can legitimately take a while on a cold RunPod worker.
const POLL_TIMEOUT_MS = 6 * 60 * 1000;

export class SpeakingApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'SpeakingApiError';
  }
}

function requireConfig() {
  if (!BASE_URL) throw new SpeakingApiError('SPEAKING_API_BASE_URL environment variable is missing.');
  if (!API_KEY) throw new SpeakingApiError('SPEAKING_API_KEY environment variable is missing.');
  return { baseUrl: BASE_URL.replace(/\/$/, ''), apiKey: API_KEY };
}

function authHeaders(apiKey: string): HeadersInit {
  return { 'X-Internal-Api-Key': apiKey };
}

export interface AudioClipInput {
  // data URL ("data:audio/webm;base64,...") or raw base64 -- both accepted.
  base64: string;
  mimeType?: string;
}

export interface SubmitSegmentInput {
  id: string; // stable slug, e.g. "p1_intro", "p1_topic1", "p2_main", "p3_topic1"
  partNumber: 1 | 2 | 3;
  label: string;
  questionText: string;
  audio: AudioClipInput;
}

export interface SpeakingSessionPart {
  id: string;
  segment_id: string;
  part_number: number;
  label: string;
  question_text: string;
  audio_url: string;
  transcript: string | null;
  fluency_features: Record<string, unknown> | null;
  pronunciation: Record<string, unknown> | null;
  status: string;
  error_reason: string | null;
}

export interface SpeakingSessionStatus {
  id: string;
  user_id: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'needs_rerecording';
  created_at: string;
  completed_at: string | null;
  parts: SpeakingSessionPart[];
}

export interface SpeakingReport {
  session_id: string;
  status: string;
  scores: {
    fluency: number;
    lexical: number;
    grammar: number;
    pronunciation: number;
    overall: number;
  };
  evidence: {
    fluency?: string;
    lexical?: string;
    grammar?: string;
    pronunciation?: string;
    per_part_feedback?: string[];
    generalSummary?: string;
    keyImprovements?: string[];
    partsRecorded?: number[];
    segmentsRecorded?: string[];
  };
  created_at: string;
}

// Splits a "data:audio/webm;codecs=opus;base64,XXXX" URL (or raw base64)
// into a Buffer + a bare mime type, mirroring the parsing already used on
// the Gemini path in the old route.
function decodeAudioClip(clip: AudioClipInput): { buffer: Buffer; mimeType: string; extension: string } {
  let base64 = clip.base64;
  let mimeType = clip.mimeType || 'audio/webm';

  if (base64.startsWith('data:')) {
    const commaIdx = base64.indexOf(',');
    if (commaIdx !== -1) {
      const header = base64.slice('data:'.length, commaIdx);
      const [mt] = header.split(';');
      if (mt) mimeType = mt;
      base64 = base64.slice(commaIdx + 1);
    }
  }
  mimeType = mimeType.split(';')[0].trim();

  const extension = mimeType.includes('webm') ? 'webm'
    : mimeType.includes('ogg') ? 'ogg'
    : mimeType.includes('mp4') || mimeType.includes('m4a') ? 'm4a'
    : mimeType.includes('mpeg') || mimeType.includes('mp3') ? 'mp3'
    : mimeType.includes('wav') ? 'wav'
    : 'webm';

  return { buffer: Buffer.from(base64, 'base64'), mimeType, extension };
}

export interface SubmitSessionInput {
  userId?: string | null;
  segments: SubmitSegmentInput[];
}

interface SegmentMetaEntry {
  id: string;
  part_number: number;
  label: string;
  question_text: string;
}

async function submitSession(input: SubmitSessionInput): Promise<{ sessionId: string }> {
  const { baseUrl, apiKey } = requireConfig();

  if (input.segments.length === 0) {
    throw new SpeakingApiError('At least one recorded segment is required.');
  }

  const form = new FormData();
  if (input.userId) form.set('user_id', input.userId);

  // One JSON blob describing every segment's metadata, plus one audio file
  // field per segment keyed by its id (audio_<segment id>) -- this avoids
  // hardcoding a fixed part1/part2/part3 shape on either side, so adding or
  // removing segments later doesn't require touching the request contract.
  const meta: SegmentMetaEntry[] = input.segments.map((s) => ({
    id: s.id,
    part_number: s.partNumber,
    label: s.label,
    question_text: s.questionText,
  }));
  form.set('segments_meta', JSON.stringify(meta));

  for (const seg of input.segments) {
    const { buffer, mimeType, extension } = decodeAudioClip(seg.audio);
    form.set(`audio_${seg.id}`, new Blob([Uint8Array.from(buffer)], { type: mimeType }), `${seg.id}.${extension}`);
  }

  const res = await fetch(`${baseUrl}/sessions/submit`, {
    method: 'POST',
    headers: authHeaders(apiKey),
    body: form,
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new SpeakingApiError(`Speaking service rejected submission: ${detail || res.statusText}`, res.status);
  }

  const data = (await res.json()) as { id: string };
  return { sessionId: data.id };
}

async function getSessionStatus(sessionId: string): Promise<SpeakingSessionStatus> {
  const { baseUrl, apiKey } = requireConfig();
  const res = await fetch(`${baseUrl}/sessions/${sessionId}`, { headers: authHeaders(apiKey) });
  if (!res.ok) {
    throw new SpeakingApiError(`Failed to fetch session status: ${res.statusText}`, res.status);
  }
  return res.json();
}

async function getSessionReport(sessionId: string): Promise<SpeakingReport> {
  const { baseUrl, apiKey } = requireConfig();
  const res = await fetch(`${baseUrl}/sessions/${sessionId}/report`, { headers: authHeaders(apiKey) });
  if (!res.ok) {
    throw new SpeakingApiError(`Failed to fetch session report: ${res.statusText}`, res.status);
  }
  return res.json();
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Submits a speaking session and blocks until it's fully scored (or errors
 * out / times out). This keeps the Next.js route's request/response shape
 * identical to the old synchronous Gemini call, at the cost of holding the
 * connection open for the duration of the pipeline -- acceptable for a
 * self-hosted/Node deployment; revisit with a job-status endpoint if this
 * ever moves behind a short-timeout serverless platform.
 */
export async function submitAndAwaitReport(
  input: SubmitSessionInput,
): Promise<{ sessionId: string; session: SpeakingSessionStatus; report: SpeakingReport }> {
  const { sessionId } = await submitSession(input);

  const deadline = Date.now() + POLL_TIMEOUT_MS;
  let session: SpeakingSessionStatus;

  while (true) {
    session = await getSessionStatus(sessionId);

    if (session.status === 'completed') break;
    if (session.status === 'needs_rerecording') {
      throw new SpeakingApiError(
        session.parts
          .filter((p) => p.status === 'no_speech_detected')
          .map((p) => `${p.label}: ${p.error_reason || 'no speech detected'}`)
          .join(' ') || 'One or more segments had no detectable speech. Please re-record and resubmit.',
      );
    }
    if (session.status === 'failed') {
      throw new SpeakingApiError('Speaking evaluation failed on the scoring service. Please try again.');
    }
    if (Date.now() > deadline) {
      throw new SpeakingApiError('Speaking evaluation timed out. Please try again in a minute.');
    }
    await sleep(POLL_INTERVAL_MS);
  }

  const report = await getSessionReport(sessionId);
  return { sessionId, session, report };
}
