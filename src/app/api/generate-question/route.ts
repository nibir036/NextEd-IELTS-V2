import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function GET() {
  try {
    // Gemini API দিয়ে প্রতিবার নতুন প্রশ্ন জেনারেট করা
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Generate one unique and standard IELTS Writing Task 2 essay topic. Output ONLY the topic/question text directly without any introduction, options, or extra text.',
    });

    const question = response.text?.trim() || 'Some people believe that technology makes life complex. To what extent do you agree or disagree?';

    return NextResponse.json({ question });
  } catch (error) {
    console.error('Error generating question with Gemini:', error);
    // ফলব্যাক প্রশ্ন যদি API ব্যর্থ হয়
    return NextResponse.json({
      question: 'Some people believe that university education should be free for everyone. To what extent do you agree or disagree?',
    });
  }
}