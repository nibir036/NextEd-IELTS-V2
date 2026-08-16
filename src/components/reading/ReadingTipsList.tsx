"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Loader2 } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  titleBn: string;
  position: number;
  difficulty?: number;
  body?: { intro?: string; introBn?: string };
  intro?: string;
  introBn?: string;
}

// Difficulty → band badge label
function bandLabel(difficulty?: number) {
  switch (difficulty) {
    case 1:
      return "Band 6.0+";
    case 2:
      return "Band 6.5+";
    case 3:
      return "Band 7.0+";
    default:
      return "Band 6.0+";
  }
}

// Trim a long intro down to a preview
function preview(text?: string, max = 150) {
  if (!text) return "";
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > max ? clean.slice(0, max).trimEnd() + "…" : clean;
}

// TODO: Reading tips DB-তে কোন position range-এ আছে সেটা এখানে বসান।
// Speaking ছিল 24–29। নিচের দুটো সংখ্যা আপনার Reading tips-এর সাথে মিলিয়ে বদলান।
const READING_TIP_START = 18;
const READING_TIP_END = 25;

export default function ReadingTipsList() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTips() {
      try {
        const res = await fetch("/api/lessons?section=tips");
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();

        const readingTips = (data.lessons || data || [])
          .filter(
            (l: Lesson) =>
              l.position >= READING_TIP_START && l.position <= READING_TIP_END
          )
          .sort((a: Lesson, b: Lesson) => a.position - b.position);

        setLessons(readingTips);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTips();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--accent-a)]" />
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="text-sm text-[var(--text-dim)]">
          কোনো tips পাওয়া যায়নি। Seed script চালান।
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {lessons.map((lesson) => {
        const introEn = lesson.intro ?? lesson.body?.intro;
        const introBnText = lesson.introBn ?? lesson.body?.introBn;

        return (
          <div
            key={lesson.id}
            className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 hover:border-[var(--accent-a)]/40 transition"
          >
            {/* Top row: band badge + file number */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-2.5 py-1 rounded-full bg-[var(--accent-a)]/10 text-[var(--accent-a)] border border-[var(--accent-a)]/20 text-xs font-medium">
                {bandLabel(lesson.difficulty)}
              </span>
              <span className="text-xs text-[var(--text-dim)] font-mono">
                File {lesson.position}
              </span>
            </div>

            {/* Title + Bangla title */}
            <h3 className="font-display text-lg font-bold text-[var(--text)] leading-snug">
              {lesson.title}
            </h3>
            {lesson.titleBn && (
              <p className="text-sm text-[var(--text-dim)] mt-1">
                {lesson.titleBn}
              </p>
            )}

            {/* Intro preview (English + Bangla) */}
            {introEn && (
              <p className="text-sm text-[var(--text-dim)] mt-3 leading-relaxed">
                {preview(introEn)}
              </p>
            )}
            {introBnText && (
              <p className="text-xs text-[var(--text-dim)]/80 italic mt-2 leading-relaxed">
                {preview(introBnText, 120)}
              </p>
            )}

            {/* Button pinned to bottom */}
            <Link
              href={`/reading/${lesson.id}`}
              className="mt-auto pt-5 flex items-center justify-center gap-1.5 rounded-xl border border-[var(--border)] py-2.5 text-sm font-medium text-[var(--text)] hover:border-[var(--accent-a)]/40 hover:bg-[var(--accent-a)]/5 transition"
            >
              Start Reading Tips
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        );
      })}
    </div>
  );
}