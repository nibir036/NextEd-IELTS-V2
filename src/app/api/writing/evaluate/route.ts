import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing');
  }
  return new GoogleGenAI({ apiKey });
}

export async function POST(req: NextRequest) {
  try {
    const { question, essay, targetBand } = await req.json();

    // শব্দের দৈর্ঘ্য চেক (কমপক্ষে ৫০ শব্দ না হলে এরর দেবে)
    const wordCount = essay ? essay.trim().split(/\s+/).length : 0;
    if (wordCount < 30) {
      return NextResponse.json({
        overall: 4.0,
        writing: 4.0,
        reading: 5.0,
        listening: 5.0,
        speaking: 5.0,
        feedback: "Your essay is too short. IELTS Task 2 requires at least 250 words.",
        errors: ["Word count issue: Please write at least 150-250 words for an accurate evaluation."]
      });
    }

    const ai = getGenAIClient();

    const prompt = `
You are an official IELTS Writing Task 2 Examiner.
Evaluate the candidate's essay objectively based on IELTS scoring criteria (Task Achievement, Coherence & Cohesion, Lexical Resource, Grammatical Accuracy).

Target Band: ${targetBand}
Question: "${question}"
Candidate Essay: "${essay}"

Provide:
1. Realistic IELTS Band Scores (Overall, Writing, Reading, Listening, Speaking).
2. A concise summary feedback.
3. A list of specific mistakes found (grammar, vocabulary, spelling, punctuation) with their corrections.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overall: { type: Type.NUMBER },
            writing: { type: Type.NUMBER },
            reading: { type: Type.NUMBER },
            listening: { type: Type.NUMBER },
            speaking: { type: Type.NUMBER },
            feedback: { type: Type.STRING },
            errors: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['overall', 'writing', 'reading', 'listening', 'speaking', 'feedback', 'errors']
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return NextResponse.json(data);

  } catch (error: unknown) {
    const err = error as Error;
    console.error("Evaluation Error:", err);
    return NextResponse.json({ error: err.message || "Failed to evaluate" }, { status: 500 });
  }
}