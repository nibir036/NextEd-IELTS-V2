import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, transcriptText } = await req.json();

    if (!transcriptText || transcriptText.trim().length < 10) {
      return NextResponse.json({ error: 'Speaking transcript is too short for evaluation.' }, { status: 400 });
    }

    const ai = getGenAIClient();

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `Evaluate this IELTS Speaking candidate response for prompt: "${prompt}".
Response transcript: "${transcriptText}".
Return JSON with overallBand, fluencyScore, lexicalScore, grammarScore, pronunciationScore, and keyTips array.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallBand: { type: Type.NUMBER },
            fluencyScore: { type: Type.NUMBER },
            lexicalScore: { type: Type.NUMBER },
            grammarScore: { type: Type.NUMBER },
            pronunciationScore: { type: Type.NUMBER },
            feedback: { type: Type.STRING },
            keyTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['overallBand', 'fluencyScore', 'lexicalScore', 'grammarScore', 'pronunciationScore', 'feedback', 'keyTips'],
        },
      },
    });

    const data = JSON.parse(response.text || '{}');
    return NextResponse.json(data);
  } catch (err: unknown) {
    const errorObj = err as Error;
    return NextResponse.json({ error: errorObj.message || 'Speaking evaluation failed.' }, { status: 500 });
  }
}
