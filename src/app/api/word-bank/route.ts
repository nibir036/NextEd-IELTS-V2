import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Adjust this path to where your word-bank JSON lives
const WORD_BANK_PATH = path.join(process.cwd(), 'data', 'vocab', 'word-bank-test.json');
// or if it's inside chapter folders:
// const WORD_BANK_PATH = path.join(process.cwd(), 'data', 'vocab', 'word-bank-test.json');

type WordEntry = {
  word: string;
  part_of_speech: string | null;
  meaning: string;
  translation_bn: string | null;
  example: string | null;
  ielts_usage: string | null;
  past: string | null;
  past_participle: string | null;
  ing_form: string | null;
  noun_form: string | null;
  adjective_form: string | null;
  adverb_form: string | null;
  synonyms: string[];
  antonyms: string[];
  collocations: string[];
  topic: string | null;
};

function loadWordBank(): WordEntry[] {
  try {
    const raw = fs.readFileSync(WORD_BANK_PATH, 'utf-8');
    const data = JSON.parse(raw);
    return Array.isArray(data.vocabulary) ? data.vocabulary : [];
  } catch (err) {
    console.error('Failed to load word bank:', err);
    return [];
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const q = searchParams.get('q')?.toLowerCase().trim() ?? '';
  const topic = searchParams.get('topic')?.trim() ?? '';
  const pos = searchParams.get('pos')?.toLowerCase().trim() ?? '';
  const letter = searchParams.get('letter')?.toLowerCase().trim() ?? '';
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '50', 10)));

  let words = loadWordBank();

  // Filters
  if (q) {
    words = words.filter(
      (w) =>
        w.word.toLowerCase().includes(q) ||
        (w.meaning && w.meaning.toLowerCase().includes(q)) ||
        (w.example && w.example.toLowerCase().includes(q)),
    );
  }

  if (topic) {
    words = words.filter((w) => w.topic === topic);
  }

  if (pos) {
    words = words.filter((w) => w.part_of_speech?.toLowerCase() === pos);
  }

  if (letter) {
    words = words.filter((w) => w.word.toLowerCase().startsWith(letter));
  }

  // Sort alphabetically
  words.sort((a, b) => a.word.localeCompare(b.word));

  // Unique topics for UI filter chips
  const allTopics = Array.from(
    new Set(loadWordBank().map((w) => w.topic).filter(Boolean)),
  ).sort() as string[];

  // Pagination
  const total = words.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paginated = words.slice(start, start + limit);

  return NextResponse.json({
    success: true,
    data: {
      words: paginated,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      filters: {
        topics: allTopics,
        availableLetters: Array.from(
          new Set(loadWordBank().map((w) => w.word[0]?.toUpperCase())),
        ).sort(),
      },
    },
  });
}