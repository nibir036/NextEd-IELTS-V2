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
    const { prompt, essayText, taskType } = await req.json();

    if (!essayText || essayText.trim().length < 20) {
      return NextResponse.json(
        { error: 'Essay response is too short. Please provide at least 20 words.' },
        { status: 400 },
      );
    }

    const ai = getGenAIClient();

    const systemInstruction = `You are an expert official Cambridge IELTS Writing Examiner with 15+ years of experience.
Evaluate the user's essay strictly against official IELTS Band Descriptors for Task Response / Achievement, Coherence & Cohesion, Lexical Resource, and Grammatical Range & Accuracy.
Provide realistic scores in half-band increments (e.g. 6.0, 6.5, 7.0, 7.5, 8.0).
Return response as JSON with scores and actionable feedback.`;

    const userMessage = `IELTS Writing ${taskType || 'Task 2'} Evaluation Request.
Prompt: ${prompt || 'General IELTS Writing Task'}
Student Essay:
"""
${essayText}
"""`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: userMessage,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallBand: { type: Type.NUMBER, description: 'Overall IELTS Band score between 0 and 9 in half steps' },
            taskResponseScore: { type: Type.NUMBER },
            coherenceScore: { type: Type.NUMBER },
            lexicalScore: { type: Type.NUMBER },
            grammarScore: { type: Type.NUMBER },
            taskResponseFeedback: { type: Type.STRING },
            coherenceFeedback: { type: Type.STRING },
            lexicalFeedback: { type: Type.STRING },
            grammarFeedback: { type: Type.STRING },
            generalSummary: { type: Type.STRING },
            keyImprovements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            enhancedVersionSnippet: { type: Type.STRING },
          },
          required: [
            'overallBand',
            'taskResponseScore',
            'coherenceScore',
            'lexicalScore',
            'grammarScore',
            'taskResponseFeedback',
            'coherenceFeedback',
            'lexicalFeedback',
            'grammarFeedback',
            'generalSummary',
            'keyImprovements',
          ],
        },
      },
    });

    if (!response.text) {
      throw new Error('No evaluation response returned from AI.');
    }

    const evalData = JSON.parse(response.text.trim());
    return NextResponse.json(evalData);
  } catch (err: unknown) {
    console.error('Writing evaluation error:', err);
    const errorObj = err as Error;
    return NextResponse.json({ error: errorObj.message || 'Failed to evaluate essay.' }, { status: 500 });
  }
}
