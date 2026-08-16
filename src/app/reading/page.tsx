"use client";

import { useState } from "react";
import { BookOpen, Lightbulb } from "lucide-react";
import { TestSelector } from "@/components/practice/TestSelector";
import ReadingTipsList from "@/components/reading/ReadingTipsList";

type Tab = "tests" | "tips";

export default function ReadingPage() {
  const [tab, setTab] = useState<Tab>("tests");

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header — সবসময় থাকবে */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--accent-a)]/30 text-[var(--accent-a)] text-sm mb-3">
          <BookOpen className="w-4 h-4" />
          Reading Practice
        </span>
        <h1 className="font-display text-4xl font-bold text-[var(--text)]">
          IELTS Reading Simulator
        </h1>
        <p className="text-[var(--text-dim)] mt-2">
          Passage paragraph analysis with AI-examined evidence justification &amp; band feedback.
        </p>
      </div>

      {/* বাম দিকে list, ডান দিকে button */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* বাম পাশ — list */}
        <div className="flex-1">
          <h2 className="font-display text-2xl font-bold text-[var(--text)] mb-4">
            {tab === "tests" ? "Reading Tests" : "Reading Tips"}
          </h2>

          {tab === "tests" ? (
            <TestSelector
              skill="reading"
              onSelect={(testId) => {
                console.log("selected test:", testId);
              }}
            />
          ) : (
            <ReadingTipsList />
          )}
        </div>

        {/* ডান পাশ — Tests / Tips button */}
        <div className="flex flex-row md:flex-col gap-2 md:w-44 shrink-0">
          <button
            onClick={() => setTab("tests")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              tab === "tests"
                ? "bg-[var(--accent-a)]/15 text-[var(--accent-a)] border border-[var(--accent-a)]/30"
                : "border border-[var(--border)] text-[var(--text-dim)] hover:border-[var(--accent-a)]/40"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Tests
          </button>

          <button
            onClick={() => setTab("tips")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              tab === "tips"
                ? "bg-[var(--accent-a)]/15 text-[var(--accent-a)] border border-[var(--accent-a)]/30"
                : "border border-[var(--border)] text-[var(--text-dim)] hover:border-[var(--accent-a)]/40"
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            Tips
          </button>
        </div>
      </div>
    </div>
  );
}