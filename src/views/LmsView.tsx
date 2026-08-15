import React, { useCallback, useEffect, useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Button } from '../components/ui/Button';
import {
  GraduationCap,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
} from '../components/ui/icons';

interface LmsViewProps {
  initialTab?: string;
  id?: string;
}

/* =========================================================
   GRAMMAR TYPES
   ========================================================= */

type ChapterSummary = {
  id: string;
  slug: string;
  title: string;
  position: number;
  estimatedMin: number | null;
  difficulty: number | null;
  bandTarget: string | null;
  summary: string | null;
  status: string;
};

type GrammarModule = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  bandUnlock: string | null;
  description: string | null;
  position: number;
  chapters: ChapterSummary[];
};

type ContentBlock = {
  id: string;
  type: string;
  level?: number;
  text?: string;
  title?: string;
  body?: string;
  variant?: string;
  headers?: string[];
  rows?: string[][];
  incorrect?: string;
  correct?: string;
  why?: string;
  skills?: string[];
  examples?: Record<string, string>;
  error_types?: Array<{ label: string; incorrect: string; correct: string }>;
  exercise_slug?: string;
  label?: string;
  bn?: string;
  bn_note?: string;
};

type ChapterDetail = {
  id: string;
  slug: string;
  title: string;
  estimatedMin: number | null;
  bandTarget: string | null;
  summary: string | null;
  content: { version: number; blocks: ContentBlock[] };
  status: string;
  module: { id: string; slug: string; title: string };
  exercises: Array<{
    id: string;
    slug: string;
    title: string;
    kind: string;
    instructions: string | null;
    position: number;
  }>;
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
};

type ExerciseItem = {
  id: string;
  prompt: string;
  options?: unknown;
};

type ExerciseDetail = {
  id: string;
  slug: string;
  title: string;
  kind: string;
  instructions: string | null;
  itemCount: number;
  items: ExerciseItem[];
  chapter: { id: string; slug: string; title: string };
  lastAttempt: { id: string; score: number | null; max_score: number | null } | null;
};

type AttemptFeedback = {
  id: string;
  correct: boolean;
  yourAnswer: string;
  expected: string | null;
  reason: string | null;
  bnNote: string | null;
};

/* =========================================================
   WORD BANK TYPE
   ========================================================= */

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

/* =========================================================
   ZERO TO BAND 9 TYPES
   ========================================================= */

type ZeroChapterMeta = {
  id: string;
  number: number;
  title: string;
  difficulty: number;
  updatedAt: string;
};

type ZeroContentChapter = {
  number: number;
  slug: string;
  title: string;
  language: string;
  description?: string;
  learning_objectives?: string[];
};

type ZeroBlock = {
  id: string;
  type: string;
  [key: string]: any;
};

type ZeroChapterResponse = {
  success: boolean;
  chapter: ZeroChapterMeta;
  content: {
    schema_version: string;
    content_type?: string;
    chapter: ZeroContentChapter;
    blocks: ZeroBlock[];
    answer_key?: any;
    source?: any;
    source_text?: string;
    integrity?: any;
  };
};

type ZeroChapterData = {
  meta: ZeroChapterMeta;
  content: ZeroChapterResponse['content'];
};

/* =========================================================
   BANGLA NOTE
   ========================================================= */

function BnNote({ text }: { text?: string | null }) {
  if (!text) return null;
  return (
    <p
      lang="bn"
      className="mt-2 pt-2 border-t border-[var(--border)]/40 text-sm text-[var(--text-dim)] leading-relaxed"
    >
      <span className="font-mono text-[10px] uppercase text-[var(--accent-a)] mr-1.5 tracking-wide">
        BN
      </span>
      {text}
    </p>
  );
}

/* =========================================================
   GRAMMAR BLOCK RENDERER
   ========================================================= */

function GrammarBlockRenderer({
  block,
  onStartExercise,
}: {
  block: ContentBlock;
  onStartExercise: (slug: string) => void;
}) {
  switch (block.type) {
    case 'heading': {
      const isH3 = block.level === 3;
      return isH3 ? (
        <h3 className="font-display text-base font-bold text-[var(--text)] mt-6 mb-2">
          {block.text}
        </h3>
      ) : (
        <h2 className="font-display text-xl font-bold text-[var(--text)] mt-8 mb-3">
          {block.text}
        </h2>
      );
    }
    case 'paragraph':
      return (
        <div className="mb-3">
          <p className="text-sm text-[var(--text-dim)] leading-relaxed">{block.text}</p>
          <BnNote text={block.bn ?? block.bn_note} />
        </div>
      );
    case 'table':
      return (
        <div className="overflow-x-auto mb-4 rounded-lg border border-[var(--border)]">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[var(--panel-2)]">
                {(block.headers ?? []).map((h, i) => (
                  <th
                    key={i}
                    className="text-left px-3 py-2 font-mono font-semibold text-[var(--text)] border-b border-[var(--border)]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(block.rows ?? []).map((row, ri) => (
                <tr key={ri} className="border-b border-[var(--border)]/50 last:border-0">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-3 py-2 text-[var(--text-dim)]">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'callout':
      return (
        <div className="mb-4 p-4 rounded-xl border border-[var(--accent-a)]/30 bg-[var(--accent-a)]/8">
          {block.title && (
            <div className="text-[11px] font-mono font-semibold uppercase text-[var(--accent-a)] mb-1.5 tracking-wide">
              {block.title}
            </div>
          )}
          <p className="text-sm text-[var(--text)] leading-relaxed">{block.text}</p>
          <BnNote text={block.bn ?? block.bn_note} />
        </div>
      );
    case 'example_pair':
      return (
        <div className="mb-4 space-y-1.5 p-3 rounded-xl bg-[var(--panel-2)]/60 border border-[var(--border)]">
          <div className="text-xs text-red-400/90">
            <span className="font-mono font-semibold mr-1.5">X</span>
            {block.incorrect}
          </div>
          <div className="text-xs text-emerald-400/90">
            <span className="font-mono font-semibold mr-1.5">OK</span>
            {block.correct}
          </div>
          {block.why && (
            <div className="text-[11px] text-[var(--text-faint)] pt-1 border-t border-[var(--border)]/50">
              Why: {block.why}
            </div>
          )}
        </div>
      );
    case 'l1_error_fixer':
      return (
        <div className="mb-4 p-4 rounded-xl border border-amber-500/30 bg-amber-500/8 space-y-3">
          <div className="text-[11px] font-mono font-semibold uppercase text-amber-400 tracking-wide">
            L1 Error Fixer · {block.title}
          </div>
          <p className="text-sm text-[var(--text)] leading-relaxed">{block.body}</p>
          {(block.error_types ?? []).map((et, i) => (
            <div key={i} className="text-xs space-y-1 pl-3 border-l-2 border-amber-500/40">
              <div className="font-semibold text-[var(--text)]">{et.label}</div>
              <div className="text-red-400/80">X {et.incorrect}</div>
              <div className="text-emerald-400/80">OK {et.correct}</div>
            </div>
          ))}
          <BnNote text={block.bn ?? block.bn_note} />
        </div>
      );
    case 'ielts_impact':
      return (
        <div className="mb-4 p-4 rounded-xl border border-[var(--accent-a)]/25 bg-[var(--panel-2)]/80 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-mono font-semibold uppercase text-[var(--accent-a)] tracking-wide">
              IELTS Impact
            </span>
            {(block.skills ?? []).map((s) => (
              <span
                key={s}
                className="px-2 py-0.5 rounded-md bg-[var(--accent-a)]/15 text-[var(--accent-a)] font-mono text-[10px] uppercase"
              >
                {s}
              </span>
            ))}
          </div>
          <div className="font-display font-bold text-[var(--text)] text-sm">{block.title}</div>
          <p className="text-sm text-[var(--text-dim)] leading-relaxed">{block.body}</p>
          {block.examples && (
            <div className="space-y-1.5 pt-1">
              {Object.entries(block.examples).map(([k, v]) => (
                <div key={k} className="text-xs text-[var(--text-dim)]">
                  <span className="font-mono text-[var(--accent-a)] uppercase mr-1.5">{k}:</span>
                  <span className="italic">{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    case 'exercise_ref':
      return null;
    default:
      return null;
  }
}

/* =========================================================
   ZERO TO BAND 9 BLOCK RENDERER
   ========================================================= */

function ZeroBlockRenderer({ block }: { block: ZeroBlock }) {
  switch (block.type) {
    case 'intro':
      return (
        <div className="mb-6 p-5 rounded-xl bg-[var(--panel-2)]/60 border border-[var(--border)] space-y-3">
          {block.title && (
            <h3 className="font-display text-base font-bold text-[var(--text)]">{block.title}</h3>
          )}
          {block.part && (
            <span className="inline-block px-2 py-0.5 rounded-md bg-[var(--accent-a)]/15 text-[var(--accent-a)] font-mono text-[10px] uppercase">
              {block.part}
            </span>
          )}
          <p className="text-sm text-[var(--text-dim)] leading-relaxed whitespace-pre-wrap">
            {block.content || block.source_text}
          </p>
          {(block.instructions ?? block.how_to_use ?? []).length > 0 && (
            <ul className="text-xs text-[var(--text-faint)] list-disc list-inside space-y-1">
              {(block.instructions ?? block.how_to_use).map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      );

    case 'batch_intro':
      return (
        <div className="mb-6 p-5 rounded-xl bg-[var(--panel-2)]/60 border border-[var(--border)] space-y-3">
          {block.title && (
            <h3 className="font-display text-base font-bold text-[var(--text)]">{block.title}</h3>
          )}
          {block.batch && (
            <span className="inline-block px-2 py-0.5 rounded-md bg-[var(--accent-a)]/15 text-[var(--accent-a)] font-mono text-[10px] uppercase">
              Batch {block.batch}
            </span>
          )}
          <p className="text-sm text-[var(--text-dim)] leading-relaxed whitespace-pre-wrap">
            {block.content}
          </p>
        </div>
      );

    case 'topic_bundle':
      return (
        <div className="mb-10 space-y-6">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-2.5 py-1 rounded-md bg-[var(--accent-a)]/15 text-[var(--accent-a)] font-mono text-[11px] font-semibold">
              Topic {block.topic_number}
            </span>
            <h3 className="font-display text-xl font-bold text-[var(--text)]">{block.title}</h3>
          </div>
          {(block.sections ?? []).map((section: any, idx: number) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-[var(--border)] bg-[var(--panel-2)]/40 space-y-2"
            >
              <div className="text-[11px] font-mono uppercase text-[var(--accent-a)] tracking-wide">
                {section.title}
              </div>
              <div className="text-sm text-[var(--text-dim)] leading-relaxed whitespace-pre-wrap">
                {section.content}
              </div>
            </div>
          ))}
        </div>
      );

    case 'answer_key':
    case 'answer_key_section':
      return (
        <div className="mb-8 p-5 rounded-xl border border-[var(--border)] bg-[var(--panel-2)]/40 space-y-3">
          {block.title && (
            <h3 className="font-display text-lg font-bold text-[var(--text)]">{block.title}</h3>
          )}
          <div className="text-sm text-[var(--text-dim)] leading-relaxed whitespace-pre-wrap">
            {block.content}
          </div>
          {block.source_chapter && (
            <div className="text-[11px] font-mono text-[var(--text-faint)]">
              Source: Chapter {block.source_chapter}
            </div>
          )}
        </div>
      );

    case 'closing':
      return (
        <div className="mb-8 p-5 rounded-xl border border-[var(--border)] bg-[var(--panel-2)]/50 space-y-3">
          {block.title && (
            <h3 className="font-display text-lg font-bold text-[var(--text)]">{block.title}</h3>
          )}
          <div className="text-sm text-[var(--text-dim)] leading-relaxed whitespace-pre-wrap">
            {block.content}
          </div>
        </div>
      );

    case 'register_rule':
      return (
        <div className="mb-6 p-5 rounded-xl border border-[var(--accent-a)]/30 bg-[var(--accent-a)]/8 space-y-3">
          <div className="text-[11px] font-mono font-semibold uppercase text-[var(--accent-a)] tracking-wide">
            {block.title || 'Register Rule'}
          </div>
          <p className="text-sm text-[var(--text)] leading-relaxed whitespace-pre-wrap">
            {block.content}
          </p>
          {block.decision_rule && (
            <div className="text-xs space-y-1 pt-2 border-t border-[var(--border)]/40">
              <div>
                <span className="font-semibold text-emerald-400">Safe for Task 2:</span>{' '}
                {block.decision_rule.safe_for_task2}
              </div>
              <div>
                <span className="font-semibold text-amber-400">Keep for Speaking:</span>{' '}
                {block.decision_rule.keep_for_speaking}
              </div>
            </div>
          )}
          {block.phrasal_verb_note && (
            <p className="text-xs text-[var(--text-faint)] pt-1">{block.phrasal_verb_note}</p>
          )}
        </div>
      );

    case 'error_matrix':
      return (
        <div className="mb-8 space-y-4">
          <div>
            <h3 className="font-display text-lg font-bold text-[var(--text)]">{block.title}</h3>
            {block.instructions && (
              <p className="text-sm text-[var(--text-dim)] mt-1">{block.instructions}</p>
            )}
          </div>
          {(block.items ?? []).map((item: any) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-amber-500/25 bg-amber-500/5 space-y-2"
            >
              <div className="font-mono text-[11px] text-amber-400 font-semibold">
                Error {item.number}
              </div>
              <div className="text-sm text-red-400/90">
                <span className="font-mono font-semibold mr-1.5">X</span>
                {item.incorrect_sentence}
              </div>
              {(item.band_9_corrections ?? []).map((c: string, i: number) => (
                <div key={i} className="text-sm text-emerald-400/90">
                  <span className="font-mono font-semibold mr-1.5">OK</span>
                  {c}
                </div>
              ))}
              {item.bangla_logic && (
                <p className="text-xs text-[var(--text-faint)] pt-1 border-t border-[var(--border)]/30">
                  <span className="font-semibold">Bangla logic:</span> {item.bangla_logic}
                </p>
              )}
              {item.grammar_lexical_rule && (
                <p className="text-xs text-[var(--text-dim)]">
                  <span className="font-semibold">Rule:</span> {item.grammar_lexical_rule}
                </p>
              )}
              {item.examiner_insight && (
                <p className="text-xs text-[var(--text-faint)] italic">
                  Examiner: {item.examiner_insight}
                </p>
              )}
            </div>
          ))}
        </div>
      );

    case 'vocabulary_matrix':
      return (
        <div className="mb-8 space-y-4">
          <div>
            <h3 className="font-display text-lg font-bold text-[var(--text)]">{block.title}</h3>
            {block.instructions && (
              <p className="text-sm text-[var(--text-dim)] mt-1">{block.instructions}</p>
            )}
          </div>
          {(block.items ?? []).map((item: any) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-[var(--border)] bg-[var(--panel-2)]/50 space-y-2"
            >
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-display font-bold text-[var(--text)]">
                  {item.number}. {item.term}
                </span>
                {item.transliteration && (
                  <span className="text-xs font-mono text-[var(--text-faint)]">
                    {item.transliteration}
                  </span>
                )}
              </div>
              {item.levels && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div className="font-mono text-[10px] uppercase text-red-400 mb-1">Band 5.5</div>
                    {item.levels.band_5_5}
                  </div>
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <div className="font-mono text-[10px] uppercase text-amber-400 mb-1">Band 7.5</div>
                    {item.levels.band_7_5}
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <div className="font-mono text-[10px] uppercase text-emerald-400 mb-1">Band 9.0</div>
                    {item.levels.band_9_0}
                  </div>
                </div>
              )}
              {item.speaking_vs_writing && (
                <p className="text-xs text-[var(--text-dim)]">
                  <span className="font-semibold">Speaking vs Writing:</span>{' '}
                  {item.speaking_vs_writing}
                </p>
              )}
              {item.bangla_nuance && (
                <p className="text-xs text-[var(--text-faint)]">
                  <span className="font-semibold">Bangla nuance:</span> {item.bangla_nuance}
                </p>
              )}
            </div>
          ))}
        </div>
      );

    case 'verb_matrix':
      return (
        <div className="mb-8 space-y-4">
          <div>
            <h3 className="font-display text-lg font-bold text-[var(--text)]">{block.title}</h3>
            {block.instructions && (
              <p className="text-sm text-[var(--text-dim)] mt-1">{block.instructions}</p>
            )}
            {block.spelling_note && (
              <p className="text-xs text-[var(--text-faint)] mt-1">{block.spelling_note}</p>
            )}
          </div>
          <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[var(--panel-2)]">
                  {(block.columns ?? ['#', 'V1', 'V2', 'V3', 'V4', 'Noun', 'Adj', 'Prep']).map(
                    (h: string, i: number) => (
                      <th
                        key={i}
                        className="text-left px-3 py-2 font-mono font-semibold text-[var(--text)] border-b border-[var(--border)]"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {(block.items ?? []).map((row: any) => (
                  <tr key={row.number} className="border-b border-[var(--border)]/40 last:border-0">
                    <td className="px-3 py-1.5 text-[var(--text-faint)]">{row.number}</td>
                    <td className="px-3 py-1.5 font-semibold text-[var(--text)]">{row.base_v1}</td>
                    <td className="px-3 py-1.5 text-[var(--text-dim)]">{row.past_v2}</td>
                    <td className="px-3 py-1.5 text-[var(--text-dim)]">{row.participle_v3}</td>
                    <td className="px-3 py-1.5 text-[var(--text-dim)]">{row.ing_v4}</td>
                    <td className="px-3 py-1.5 text-[var(--text-dim)]">{row.noun}</td>
                    <td className="px-3 py-1.5 text-[var(--text-dim)]">{row.adjective}</td>
                    <td className="px-3 py-1.5 text-[var(--text-dim)]">{row.preposition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(block.notes ?? []).map((note: string, i: number) => (
            <p key={i} className="text-xs text-[var(--text-faint)]">
              {note}
            </p>
          ))}
        </div>
      );

    case 'linking_guide':
      return (
        <div className="mb-8 space-y-5">
          <div>
            <h3 className="font-display text-lg font-bold text-[var(--text)]">{block.title}</h3>
            {block.introduction && (
              <p className="text-sm text-[var(--text-dim)] mt-1">{block.introduction}</p>
            )}
          </div>
          {(block.categories ?? []).map((cat: any, i: number) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-[var(--border)] bg-[var(--panel-2)]/40 space-y-2"
            >
              <div className="font-semibold text-[var(--text)]">{cat.category}</div>
              <div className="text-xs text-[var(--text-faint)]">
                Basic: {(cat.basic ?? []).join(', ')}
              </div>
              <div className="text-xs text-emerald-400/90">
                Upgrades: {(cat.upgrades ?? []).join(', ')}
              </div>
              {cat.example && (
                <p className="text-xs text-[var(--text-dim)] italic pt-1">e.g. {cat.example}</p>
              )}
            </div>
          ))}
          {(block.traps ?? []).map((trap: any) => (
            <div
              key={trap.id}
              className="p-4 rounded-xl border border-red-500/25 bg-red-500/5 space-y-1"
            >
              <div className="font-semibold text-red-400 text-sm">{trap.title}</div>
              <p className="text-xs text-[var(--text-dim)]">{trap.explanation}</p>
              {trap.wrong && <div className="text-xs text-red-400/80">X {trap.wrong}</div>}
              {(trap.right ?? []).map((r: string, i: number) => (
                <div key={i} className="text-xs text-emerald-400/80">
                  OK {r}
                </div>
              ))}
            </div>
          ))}
        </div>
      );

    case 'idiom_list':
    case 'collocation_list':
      return (
        <div className="mb-8 space-y-4">
          <div>
            <h3 className="font-display text-lg font-bold text-[var(--text)]">{block.title}</h3>
            {block.intro && (
              <p className="text-sm text-[var(--text-dim)] mt-1">{block.intro}</p>
            )}
            {block.usage && (
              <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-[var(--accent-a)]/15 text-[var(--accent-a)] font-mono text-[10px] uppercase">
                {block.usage}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(block.items ?? []).map((item: any) => (
              <div
                key={item.number}
                className="p-3 rounded-xl border border-[var(--border)] bg-[var(--panel-2)]/50 space-y-1"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold text-[var(--text)]">
                    {item.number}. {item.expression}
                  </span>
                  {(item.part || item.category) && (
                    <span className="text-[10px] font-mono text-[var(--text-faint)]">
                      {item.part || item.category}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--text-dim)]">{item.meaning}</p>
                {item.bangla && (
                  <p className="text-xs text-[var(--text-faint)]" lang="bn">
                    {item.bangla}
                  </p>
                )}
                {item.example && (
                  <p className="text-xs italic text-[var(--text-dim)]">“{item.example}”</p>
                )}
              </div>
            ))}
          </div>
        </div>
      );

    case 'exercise': {
      if (block.exercise_type === 'essay_rewrite' && Array.isArray(block.essays)) {
        return (
          <div className="mb-8 p-5 rounded-xl border border-[var(--border)] bg-[var(--panel-2)]/40 space-y-6">
            <div>
              <div className="text-[11px] font-mono uppercase text-[var(--accent-a)] mb-1">
                essay rewrite
              </div>
              <h3 className="font-display text-lg font-bold text-[var(--text)]">{block.title}</h3>
              {block.instructions && (
                <p className="text-sm text-[var(--text-dim)] mt-1">{block.instructions}</p>
              )}
            </div>
            {block.essays.map((essay: any) => (
              <div
                key={essay.id}
                className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] space-y-3"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[11px] text-[var(--accent-a)]">
                    Essay {essay.number}
                  </span>
                  {essay.question_type && (
                    <span className="px-2 py-0.5 rounded-md bg-[var(--panel-2)] text-[10px] font-mono text-[var(--text-faint)]">
                      {essay.question_type}
                    </span>
                  )}
                  {essay.band && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400 text-[10px] font-mono">
                      {essay.band}
                    </span>
                  )}
                </div>
                <div className="text-sm font-semibold text-[var(--text)]">{essay.prompt}</div>
                <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                  <div className="text-[10px] font-mono uppercase text-red-400 mb-1">
                    Band 6.0 Draft
                  </div>
                  <p className="text-xs text-[var(--text-dim)] whitespace-pre-wrap leading-relaxed">
                    {essay.draft}
                  </p>
                </div>
                {essay.model_answer && (
                  <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                    <div className="text-[10px] font-mono uppercase text-emerald-400 mb-1">
                      Model Band 8.5–9.0
                    </div>
                    <p className="text-xs text-[var(--text)] whitespace-pre-wrap leading-relaxed">
                      {essay.model_answer}
                    </p>
                  </div>
                )}
                {essay.key_upgrades && (
                  <p className="text-[11px] text-[var(--text-faint)]">
                    <span className="font-semibold">Key upgrades:</span> {essay.key_upgrades}
                  </p>
                )}
              </div>
            ))}
          </div>
        );
      }

      return (
        <div className="mb-8 p-5 rounded-xl border border-[var(--border)] bg-[var(--panel-2)]/40 space-y-4">
          <div>
            <div className="text-[11px] font-mono uppercase text-[var(--accent-a)] mb-1">
              {(block.exercise_type || 'exercise').replace(/_/g, ' ')}
            </div>
            <h3 className="font-display text-lg font-bold text-[var(--text)]">{block.title}</h3>
            {block.instructions && (
              <p className="text-sm text-[var(--text-dim)] mt-1">{block.instructions}</p>
            )}
          </div>
          <div className="space-y-3">
            {(block.questions ?? []).map((q: any) => (
              <div
                key={q.id}
                className="p-3 rounded-lg bg-[var(--bg)] border border-[var(--border)]"
              >
                <div className="text-[11px] font-mono text-[var(--text-faint)] mb-1">
                  Q{q.number}
                </div>
                <p className="text-sm text-[var(--text)]">{q.prompt || q.sentence}</p>
              </div>
            ))}
          </div>
          {block.prompt && (
            <div className="p-3 rounded-lg bg-[var(--bg)] border border-[var(--border)]">
              <p className="text-sm text-[var(--text)] whitespace-pre-wrap">{block.prompt}</p>
            </div>
          )}
        </div>
      );
    }

    case 'speaking_simulation':
      return (
        <div className="mb-8 p-5 rounded-xl border border-[var(--border)] bg-[var(--panel-2)]/40 space-y-5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-mono uppercase text-[var(--accent-a)]">
              Speaking Simulation {block.simulation_number}
            </span>
            {block.title && (
              <span className="font-display font-bold text-[var(--text)] text-sm">
                {block.title}
              </span>
            )}
          </div>
          {block.part2 && (
            <div className="p-4 rounded-lg bg-[var(--bg)] border border-[var(--border)] space-y-2">
              <div className="text-[11px] font-mono uppercase text-amber-400">
                Part 2 · Cue Card
              </div>
              <div className="font-semibold text-[var(--text)]">{block.part2.title}</div>
              {(block.part2.prompts ?? []).length > 0 && (
                <ul className="text-xs text-[var(--text-dim)] list-disc list-inside space-y-0.5">
                  {block.part2.prompts.map((p: string, i: number) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {block.model_long_turn && (
            <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20 space-y-2">
              <div className="text-[11px] font-mono uppercase text-emerald-400">
                Model Long-Turn Answer
              </div>
              <p className="text-sm text-[var(--text)] leading-relaxed whitespace-pre-wrap">
                {block.model_long_turn}
              </p>
            </div>
          )}
          {(block.part3 ?? []).length > 0 && (
            <div className="space-y-3">
              <div className="text-[11px] font-mono uppercase text-[var(--accent-a)]">
                Part 3 · Follow-up Questions
              </div>
              {block.part3.map((q: any, i: number) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-[var(--bg)] border border-[var(--border)] space-y-1.5"
                >
                  <div className="text-xs font-semibold text-[var(--text)]">
                    Q{i + 1}. {q.question}
                  </div>
                  <p className="text-xs text-[var(--text-dim)] leading-relaxed">{q.answer}</p>
                </div>
              ))}
            </div>
          )}
          {block.lexical_analysis && (
            <div className="p-3 rounded-lg bg-[var(--panel-2)] border border-[var(--border)]">
              <div className="text-[11px] font-mono uppercase text-[var(--text-faint)] mb-1">
                Lexical Analysis
              </div>
              <p className="text-xs text-[var(--text-dim)] leading-relaxed">
                {block.lexical_analysis}
              </p>
            </div>
          )}
        </div>
      );

    default:
      return (
        <div className="mb-4 p-4 rounded-xl border border-dashed border-[var(--border)] bg-[var(--panel-2)]/30 space-y-2">
          <div className="text-[11px] font-mono uppercase text-amber-400">
            Unsupported block · {block.type}
          </div>
          {block.title && (
            <div className="font-display font-bold text-[var(--text)] text-sm">{block.title}</div>
          )}
          {block.content && (
            <p className="text-sm text-[var(--text-dim)] whitespace-pre-wrap">{block.content}</p>
          )}
          <details className="text-[10px] text-[var(--text-faint)]">
            <summary className="cursor-pointer">Show raw data</summary>
            <pre className="mt-2 overflow-auto max-h-48">{JSON.stringify(block, null, 2)}</pre>
          </details>
        </div>
      );
  }
}

/* =========================================================
   STATUS CHIP
   ========================================================= */

function StatusChip({ status }: { status: string }) {
  const map: Record<string, string> = {
    completed: 'bg-emerald-500/15 text-emerald-400',
    in_progress: 'bg-amber-500/15 text-amber-400',
    not_started: 'bg-[var(--panel-2)] text-[var(--text-faint)]',
  };
  const label: Record<string, string> = {
    completed: 'Completed',
    in_progress: 'In progress',
    not_started: 'Not started',
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-semibold uppercase ${
        map[status] ?? map.not_started
      }`}
    >
      {label[status] ?? status}
    </span>
  );
}

/* =========================================================
   LMS VIEW
   ========================================================= */

export const LmsView: React.FC<LmsViewProps> = ({ initialTab = 'grammar', id }) => {
  const [activeTab, setActiveTab] = useState<'grammar' | 'vocab'>(
    initialTab.includes('vocab') ? 'vocab' : 'grammar',
  );

  /* Grammar state */
  const [modules, setModules] = useState<GrammarModule[]>([]);
  const [loadingModules, setLoadingModules] = useState(false);
  const [modulesError, setModulesError] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<GrammarModule | null>(null);
  const [chapter, setChapter] = useState<ChapterDetail | null>(null);
  const [loadingChapter, setLoadingChapter] = useState(false);
  const [exercise, setExercise] = useState<ExerciseDetail | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    score: number;
    maxScore: number;
    items: AttemptFeedback[];
  } | null>(null);

  /* Zero to Band 9 state */
  const [zeroChapters, setZeroChapters] = useState<ZeroChapterData[]>([]);
  const [loadingZero, setLoadingZero] = useState(false);
  const [zeroError, setZeroError] = useState<string | null>(null);
  const [selectedZero, setSelectedZero] = useState<ZeroChapterData | null>(null);

  /* Word Bank state */
  const [vocabSubTab, setVocabSubTab] = useState<'chapters' | 'wordbank'>('chapters');
  const [wordBank, setWordBank] = useState<WordEntry[]>([]);
  const [wordBankLoading, setWordBankLoading] = useState(false);
  const [wordBankError, setWordBankError] = useState<string | null>(null);
  const [wbQuery, setWbQuery] = useState('');
  const [wbTopic, setWbTopic] = useState('');
  const [wbLetter, setWbLetter] = useState('');
  const [wbTopics, setWbTopics] = useState<string[]>([]);
  const [wbPage, setWbPage] = useState(1);
  const [wbTotalPages, setWbTotalPages] = useState(1);
  const [wbTotal, setWbTotal] = useState(0);

  /* Tab change */
  useEffect(() => {
    const next = initialTab.includes('vocab') ? 'vocab' : 'grammar';
    setActiveTab(next);
    setSelectedModule(null);
    setChapter(null);
    setExercise(null);
    setFeedback(null);
    setSelectedZero(null);
    setVocabSubTab('chapters');
  }, [initialTab]);

  /* Load grammar modules */
  useEffect(() => {
    if (activeTab !== 'grammar') return;
    let cancelled = false;
    (async () => {
      setLoadingModules(true);
      setModulesError(null);
      try {
        const res = await fetch('/api/grammar/modules');
        if (!res.ok) throw new Error('Failed to load grammar modules');
        const data = await res.json();
        if (!cancelled) setModules(data.modules ?? []);
      } catch (e) {
        if (!cancelled) setModulesError(e instanceof Error ? e.message : 'Load failed');
      } finally {
        if (!cancelled) setLoadingModules(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  /* Load Zero to Band 9 chapters */
  useEffect(() => {
    if (activeTab !== 'vocab') return;
    let cancelled = false;
    (async () => {
      setLoadingZero(true);
      setZeroError(null);
      try {
        const numbers = [1, 2, 3, 4, 5, 6, 7];
        const results = await Promise.all(
          numbers.map(async (num) => {
            const res = await fetch(`/api/vocab/${num}`);
            if (!res.ok) {
              console.warn(`Failed to load chapter ${num}:`, res.status);
              return null;
            }
            const data: ZeroChapterResponse = await res.json();
            if (!data.success || !data.chapter || !data.content) return null;
            return { meta: data.chapter, content: data.content };
          }),
        );
        if (!cancelled) {
          setZeroChapters(results.filter(Boolean) as ZeroChapterData[]);
        }
      } catch (e) {
        if (!cancelled) {
          setZeroError(e instanceof Error ? e.message : 'Failed to load chapters');
        }
      } finally {
        if (!cancelled) setLoadingZero(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  /* Load Word Bank */
  useEffect(() => {
    if (activeTab !== 'vocab' || vocabSubTab !== 'wordbank') return;
    let cancelled = false;
    (async () => {
      setWordBankLoading(true);
      setWordBankError(null);
      try {
        const params = new URLSearchParams();
        if (wbQuery) params.set('q', wbQuery);
        if (wbTopic) params.set('topic', wbTopic);
        if (wbLetter) params.set('letter', wbLetter);
        params.set('page', String(wbPage));
        params.set('limit', '40');

        const res = await fetch(`/api/word-bank?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to load word bank');
        const data = await res.json();
        if (!cancelled && data.success) {
          setWordBank(data.data.words ?? []);
          setWbTopics(data.data.filters?.topics ?? []);
          setWbTotalPages(data.data.pagination?.totalPages ?? 1);
          setWbTotal(data.data.pagination?.total ?? 0);
        }
      } catch (e) {
        if (!cancelled) {
          setWordBankError(e instanceof Error ? e.message : 'Load failed');
        }
      } finally {
        if (!cancelled) setWordBankLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [activeTab, vocabSubTab, wbQuery, wbTopic, wbLetter, wbPage]);

  const scrollMainToTop = useCallback(() => {
    const main = document.querySelector('main');
    if (main) main.scrollTo({ top: 0, behavior: 'auto' });
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const openChapter = useCallback(
    async (slug: string) => {
      setLoadingChapter(true);
      setExercise(null);
      setFeedback(null);
      scrollMainToTop();
      try {
        const res = await fetch(`/api/grammar/chapters/${slug}`);
        if (!res.ok) throw new Error('Chapter not found');
        const data = await res.json();
        setChapter(data.chapter);
        scrollMainToTop();
        fetch(`/api/grammar/chapters/${slug}/progress`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'in_progress' }),
        }).catch(() => {});
      } catch {
        setChapter(null);
      } finally {
        setLoadingChapter(false);
      }
    },
    [scrollMainToTop],
  );

  const startExercise = useCallback(
    async (exerciseSlug: string) => {
      if (!chapter) return;
      const meta = chapter.exercises.find((e) => e.slug === exerciseSlug);
      if (!meta) return;
      setFeedback(null);
      setAnswers({});
      scrollMainToTop();
      try {
        const res = await fetch(`/api/grammar/exercises/${meta.id}`);
        if (!res.ok) throw new Error('Exercise not found');
        const data = await res.json();
        setExercise(data.exercise);
        scrollMainToTop();
      } catch {
        setExercise(null);
      }
    },
    [chapter, scrollMainToTop],
  );

  const submitExercise = useCallback(async () => {
    if (!exercise) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/grammar/exercises/${exercise.id}/attempt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      if (res.status === 401) {
        alert('Please log in to submit exercises and track your score.');
        return;
      }
      if (!res.ok) throw new Error('Submit failed');
      const data = await res.json();
      setFeedback({
        score: data.attempt.score,
        maxScore: data.attempt.maxScore,
        items: data.attempt.feedback,
      });
    } catch {
      alert('Could not submit. Try again.');
    } finally {
      setSubmitting(false);
    }
  }, [exercise, answers]);

  const markComplete = useCallback(async () => {
    if (!chapter) return;
    await fetch(`/api/grammar/chapters/${chapter.slug}/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed' }),
    }).catch(() => {});
    setChapter((c) => (c ? { ...c, status: 'completed' } : c));
    setModules((prev) =>
      prev.map((m) => ({
        ...m,
        chapters: m.chapters.map((ch) =>
          ch.slug === chapter.slug ? { ...ch, status: 'completed' } : ch,
        ),
      })),
    );
  }, [chapter]);

  /* =========================================================
     EXERCISE SCREEN
     ========================================================= */
  if (exercise) {
    return (
      <div id={id} className="space-y-6 w-full">
        <button
          type="button"
          onClick={() => {
            setExercise(null);
            setFeedback(null);
            scrollMainToTop();
          }}
          className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-faint)] hover:text-[var(--accent-a)] transition-colors"
        >
          <ChevronLeft size={14} />
          Back to chapter
        </button>

        <GlassPanel className="p-6 border border-[var(--border)] space-y-4">
          <div>
            <div className="text-[11px] font-mono uppercase text-[var(--accent-a)] mb-1">
              {exercise.kind}
            </div>
            <h2 className="font-display text-xl font-bold text-[var(--text)]">{exercise.title}</h2>
            {exercise.instructions && (
              <p className="text-sm text-[var(--text-dim)] mt-2">{exercise.instructions}</p>
            )}
          </div>

          {!feedback ? (
            <>
              <div className="space-y-4">
                {exercise.items.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-[var(--panel-2)]/60 border border-[var(--border)] space-y-2"
                  >
                    <div className="text-[11px] font-mono text-[var(--text-faint)]">
                      Question {idx + 1}
                    </div>
                    <p className="text-sm text-[var(--text)]">{item.prompt}</p>
                    <textarea
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)]/50 min-h-[60px] resize-y"
                      placeholder="Rewrite the sentence correctly..."
                      value={answers[item.id] ?? ''}
                      onChange={(e) =>
                        setAnswers((prev) => ({ ...prev, [item.id]: e.target.value }))
                      }
                    />
                  </div>
                ))}
              </div>
              <Button
                variant="primary"
                size="sm"
                className="w-full sm:w-auto"
                disabled={submitting}
                onClick={submitExercise}
              >
                {submitting ? 'Scoring...' : 'Submit answers'}
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--accent-a)]/10 border border-[var(--accent-a)]/25">
                <CheckCircle2 size={22} className="text-[var(--accent-a)]" />
                <div>
                  <div className="font-display font-bold text-[var(--text)]">
                    Score: {feedback.score} / {feedback.maxScore}
                  </div>
                  <div className="text-xs text-[var(--text-dim)]">
                    {Math.round((feedback.score / Math.max(feedback.maxScore, 1)) * 100)}% correct
                  </div>
                </div>
              </div>
              {feedback.items.map((fb, idx) => (
                <div
                  key={fb.id}
                  className={`p-4 rounded-xl border space-y-1.5 ${
                    fb.correct
                      ? 'border-emerald-500/30 bg-emerald-500/8'
                      : 'border-red-500/30 bg-red-500/8'
                  }`}
                >
                  <div className="text-[11px] font-mono text-[var(--text-faint)]">
                    Q{idx + 1} · {fb.correct ? 'Correct' : 'Incorrect'}
                  </div>
                  <div className="text-xs text-[var(--text-dim)]">
                    Your answer:{' '}
                    <span className="text-[var(--text)]">{fb.yourAnswer || '(empty)'}</span>
                  </div>
                  {!fb.correct && fb.expected && (
                    <div className="text-xs text-emerald-400/90">Expected: {fb.expected}</div>
                  )}
                  {fb.reason && (
                    <div className="text-[11px] text-[var(--text-faint)] pt-1">{fb.reason}</div>
                  )}
                </div>
              ))}
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setFeedback(null);
                    setAnswers({});
                  }}
                >
                  Try again
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setExercise(null);
                    setFeedback(null);
                  }}
                >
                  Back to chapter
                </Button>
              </div>
            </div>
          )}
        </GlassPanel>
      </div>
    );
  }

  /* =========================================================
     GRAMMAR CHAPTER SCREEN
     ========================================================= */
  if (chapter || loadingChapter) {
    return (
      <div id={id} className="space-y-6 w-full">
        <button
          type="button"
          onClick={() => {
            setChapter(null);
            scrollMainToTop();
          }}
          className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-faint)] hover:text-[var(--accent-a)] transition-colors"
        >
          <ChevronLeft size={14} />
          Back to chapters
        </button>

        {loadingChapter && (
          <div className="text-sm text-[var(--text-dim)] font-mono py-12 text-center">
            Loading chapter...
          </div>
        )}

        {chapter && (
          <>
            <GlassPanel className="p-6 md:p-8 border border-[var(--border)]">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-[11px] font-mono uppercase text-[var(--accent-a)]">
                  {chapter.module.title}
                </span>
                {chapter.bandTarget && (
                  <span className="px-2 py-0.5 rounded-md bg-[var(--accent-a)]/15 text-[var(--accent-a)] font-mono text-[10px] font-semibold">
                    {chapter.bandTarget}
                  </span>
                )}
                <StatusChip status={chapter.status} />
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-[var(--text)]">
                {chapter.title}
              </h1>
              {chapter.summary && (
                <p className="text-sm text-[var(--text-dim)] mt-2">{chapter.summary}</p>
              )}
              {chapter.estimatedMin && (
                <div className="text-[11px] font-mono text-[var(--text-faint)] mt-2">
                  ~{chapter.estimatedMin} min read
                </div>
              )}
            </GlassPanel>

            <GlassPanel className="p-6 md:p-8 border border-[var(--border)]">
              {(chapter.content?.blocks ?? []).map((block) => (
                <GrammarBlockRenderer
                  key={block.id}
                  block={block}
                  onStartExercise={startExercise}
                />
              ))}
            </GlassPanel>

            {chapter.exercises.length > 0 && (
              <GlassPanel className="p-6 border border-[var(--border)] space-y-3">
                <h3 className="font-display font-bold text-[var(--text)]">Exercises</h3>
                {chapter.exercises.map((ex) => (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => startExercise(ex.slug)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-[var(--panel-2)]/60 border border-[var(--border)] hover:border-[var(--accent-a)]/40 transition-colors text-left"
                  >
                    <div>
                      <div className="text-sm font-semibold text-[var(--text)]">{ex.title}</div>
                      <div className="text-[11px] font-mono text-[var(--text-faint)] capitalize">
                        {ex.kind}
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-[var(--text-faint)]" />
                  </button>
                ))}
              </GlassPanel>
            )}

            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex gap-2">
                {chapter.prev && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => openChapter(chapter.prev!.slug)}
                  >
                    <ChevronLeft size={14} /> Prev
                  </Button>
                )}
                {chapter.next && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => openChapter(chapter.next!.slug)}
                  >
                    Next <ChevronRight size={14} />
                  </Button>
                )}
              </div>
              {chapter.status !== 'completed' && (
                <Button variant="primary" size="sm" onClick={markComplete}>
                  Mark complete
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  /* =========================================================
     MAIN LMS
     ========================================================= */
  return (
    <div id={id} className="space-y-6">
      {/* Header */}
      <GlassPanel className="p-6 md:p-8 relative overflow-hidden border border-[var(--border)]">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-[var(--accent-a)] tracking-wider mb-2">
            <GraduationCap size={18} />
            <span>LMS · Learning Management System</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[var(--text)]">
            {activeTab === 'grammar' ? 'Grammar Masterclass' : 'Zero to Band 9'}
          </h1>
          <p className="text-sm text-[var(--text-dim)] mt-1 max-w-2xl">
            {activeTab === 'grammar'
              ? 'Curated grammar rules designed specifically to elevate your Grammatical Range & Accuracy score.'
              : 'Complete chapters + searchable Word Bank.'}
          </p>
        </div>
      </GlassPanel>

      {/* ===================== GRAMMAR TAB ===================== */}
      {activeTab === 'grammar' && (
        <div className="space-y-6">
          {loadingModules && (
            <div className="text-sm text-[var(--text-dim)] font-mono py-8 text-center">
              Loading modules...
            </div>
          )}
          {modulesError && (
            <GlassPanel className="p-4 border border-red-500/30 text-sm text-red-400">
              {modulesError}
            </GlassPanel>
          )}
          {!loadingModules && !modulesError && modules.length === 0 && (
            <GlassPanel className="p-6 border border-[var(--border)] text-sm text-[var(--text-dim)]">
              No grammar modules published yet.
            </GlassPanel>
          )}

          {!loadingModules && selectedModule && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => {
                  setSelectedModule(null);
                  scrollMainToTop();
                }}
                className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-faint)] hover:text-[var(--accent-a)] transition-colors"
              >
                <ChevronLeft size={14} />
                All modules
              </button>
              <div className="flex items-baseline justify-between gap-3 flex-wrap">
                <div>
                  <h2 className="font-display text-xl font-bold text-[var(--text)]">
                    {selectedModule.title}
                  </h2>
                  {selectedModule.subtitle && (
                    <p className="text-sm text-[var(--text-dim)] mt-1">{selectedModule.subtitle}</p>
                  )}
                </div>
                {selectedModule.bandUnlock && (
                  <span className="px-2.5 py-1 rounded-md bg-[var(--accent-a)]/15 text-[var(--accent-a)] font-mono text-[11px] font-semibold">
                    {selectedModule.bandUnlock}
                  </span>
                )}
              </div>
              {selectedModule.description && (
                <p className="text-sm text-[var(--text-faint)] max-w-3xl">
                  {selectedModule.description}
                </p>
              )}
              {selectedModule.chapters.length === 0 ? (
                <GlassPanel className="p-6 border border-[var(--border)] text-sm text-[var(--text-dim)]">
                  No chapters published in this module yet.
                </GlassPanel>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedModule.chapters.map((ch) => (
                    <GlassPanel
                      key={ch.id}
                      className="p-5 flex flex-col justify-between border border-[var(--border)] hover:border-[var(--accent-a)]/40 transition-colors cursor-pointer"
                      onClick={() => openChapter(ch.slug)}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3 gap-2">
                          {ch.bandTarget ? (
                            <span className="px-2.5 py-1 rounded-md bg-[var(--accent-a)]/15 text-[var(--accent-a)] font-mono text-[11px] font-semibold">
                              {ch.bandTarget}
                            </span>
                          ) : (
                            <span />
                          )}
                          <StatusChip status={ch.status} />
                        </div>
                        <h3 className="font-display text-base font-bold text-[var(--text)] mb-2">
                          {ch.title}
                        </h3>
                        {ch.summary && (
                          <p className="text-xs text-[var(--text-dim)] mb-3 line-clamp-3">
                            {ch.summary}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full flex items-center justify-center gap-1.5"
                        onClick={(e) => {
                          e.stopPropagation();
                          openChapter(ch.slug);
                        }}
                      >
                        <span>Open chapter</span>
                        <ChevronRight size={16} />
                      </Button>
                    </GlassPanel>
                  ))}
                </div>
              )}
            </div>
          )}

          {!loadingModules && !selectedModule && modules.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {modules.map((mod) => {
                const total = mod.chapters.length;
                const done = mod.chapters.filter((c) => c.status === 'completed').length;
                return (
                  <GlassPanel
                    key={mod.id}
                    className="p-6 flex flex-col justify-between border border-[var(--border)] hover:border-[var(--accent-a)]/40 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedModule(mod);
                      scrollMainToTop();
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3 gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-[var(--panel-2)] text-[var(--text-faint)] font-mono text-[11px] font-semibold">
                          Module {mod.position}
                        </span>
                        {mod.bandUnlock && (
                          <span className="px-2.5 py-1 rounded-md bg-[var(--accent-a)]/15 text-[var(--accent-a)] font-mono text-[11px] font-semibold">
                            {mod.bandUnlock}
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-lg font-bold text-[var(--text)] mb-1">
                        {mod.title}
                      </h3>
                      {mod.subtitle && (
                        <p className="text-xs text-[var(--text-dim)] mb-3">{mod.subtitle}</p>
                      )}
                      <div className="text-[11px] font-mono text-[var(--text-faint)] mb-4">
                        {total} chapter{total === 1 ? '' : 's'}
                        {total > 0 && ` · ${done}/${total} completed`}
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full flex items-center justify-center gap-1.5"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedModule(mod);
                        scrollMainToTop();
                      }}
                    >
                      <span>View chapters</span>
                      <ChevronRight size={16} />
                    </Button>
                  </GlassPanel>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ===================== VOCAB TAB (Chapters + Word Bank) ===================== */}
      {activeTab === 'vocab' && (
        <div className="space-y-6">
          {/* Sub-tab switcher */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setVocabSubTab('chapters');
                setSelectedZero(null);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-mono font-semibold transition-colors ${
                vocabSubTab === 'chapters'
                  ? 'bg-[var(--accent-a)]/20 text-[var(--accent-a)] border border-[var(--accent-a)]/40'
                  : 'bg-[var(--panel-2)] text-[var(--text-faint)] border border-[var(--border)] hover:text-[var(--text)]'
              }`}
            >
              Chapters
            </button>
            <button
              type="button"
              onClick={() => setVocabSubTab('wordbank')}
              className={`px-4 py-2 rounded-lg text-sm font-mono font-semibold transition-colors ${
                vocabSubTab === 'wordbank'
                  ? 'bg-[var(--accent-a)]/20 text-[var(--accent-a)] border border-[var(--accent-a)]/40'
                  : 'bg-[var(--panel-2)] text-[var(--text-faint)] border border-[var(--border)] hover:text-[var(--text)]'
              }`}
            >
              Word Bank
            </button>
          </div>

          {/* ---------- CHAPTERS ---------- */}
          {vocabSubTab === 'chapters' && (
            <>
              {loadingZero && (
                <div className="text-sm text-[var(--text-dim)] font-mono py-12 text-center">
                  Loading Zero to Band 9 chapters...
                </div>
              )}
              {zeroError && (
                <GlassPanel className="p-4 border border-red-500/30 text-sm text-red-400">
                  {zeroError}
                </GlassPanel>
              )}

              {!loadingZero && selectedZero && (
                <div className="space-y-6">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedZero(null);
                      scrollMainToTop();
                    }}
                    className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-faint)] hover:text-[var(--accent-a)] transition-colors"
                  >
                    <ChevronLeft size={14} />
                    All chapters
                  </button>

                  <GlassPanel className="p-6 md:p-8 border border-[var(--border)]">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="text-[11px] font-mono uppercase text-[var(--accent-a)]">
                        Chapter {selectedZero.meta.number}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-[var(--accent-a)]/15 text-[var(--accent-a)] font-mono text-[10px] font-semibold">
                        Difficulty {selectedZero.meta.difficulty}
                      </span>
                    </div>
                    <h1 className="font-display text-2xl md:text-3xl font-bold text-[var(--text)]">
                      {selectedZero.meta.title}
                    </h1>
                    {selectedZero.content.chapter.description && (
                      <p className="text-sm text-[var(--text-dim)] mt-2">
                        {selectedZero.content.chapter.description}
                      </p>
                    )}
                    {(selectedZero.content.chapter.learning_objectives ?? []).length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {selectedZero.content.chapter.learning_objectives!.map((obj, i) => (
                          <li key={i} className="text-xs text-[var(--text-faint)] flex gap-2">
                            <span className="text-[var(--accent-a)]">•</span>
                            {obj}
                          </li>
                        ))}
                      </ul>
                    )}
                  </GlassPanel>

                  <GlassPanel className="p-6 md:p-8 border border-[var(--border)] space-y-2">
                    {(selectedZero.content.blocks ?? []).map((block) => (
                      <ZeroBlockRenderer key={block.id} block={block} />
                    ))}
                  </GlassPanel>

                  <div className="flex justify-start">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setSelectedZero(null);
                        scrollMainToTop();
                      }}
                    >
                      <ChevronLeft size={14} />
                      Back to chapters
                    </Button>
                  </div>
                </div>
              )}

              {!loadingZero && !zeroError && !selectedZero && (
                <>
                  {zeroChapters.length === 0 ? (
                    <GlassPanel className="p-6 border border-[var(--border)] text-sm text-[var(--text-dim)]">
                      No chapters found.
                    </GlassPanel>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {zeroChapters
                        .sort((a, b) => a.meta.number - b.meta.number)
                        .map(({ meta, content }) => (
                          <GlassPanel
                            key={meta.id}
                            className="p-6 flex flex-col justify-between border border-[var(--border)] hover:border-[var(--accent-a)]/40 transition-colors cursor-pointer"
                            onClick={() => {
                              setSelectedZero({ meta, content });
                              scrollMainToTop();
                            }}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-3 gap-2">
                                <span className="px-2.5 py-1 rounded-md bg-[var(--panel-2)] text-[var(--text-faint)] font-mono text-[11px] font-semibold">
                                  Chapter {meta.number}
                                </span>
                                <span className="px-2.5 py-1 rounded-md bg-[var(--accent-a)]/15 text-[var(--accent-a)] font-mono text-[11px] font-semibold">
                                  Diff {meta.difficulty}
                                </span>
                              </div>
                              <h3 className="font-display text-lg font-bold text-[var(--text)] mb-2">
                                {meta.title}
                              </h3>
                              {content.chapter.description && (
                                <p className="text-xs text-[var(--text-dim)] mb-3 line-clamp-3">
                                  {content.chapter.description}
                                </p>
                              )}
                              <div className="text-[11px] font-mono text-[var(--text-faint)]">
                                {content.blocks?.length ?? 0} blocks
                              </div>
                            </div>
                            <Button
                              variant="secondary"
                              size="sm"
                              className="w-full flex items-center justify-center gap-1.5 mt-4"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedZero({ meta, content });
                                scrollMainToTop();
                              }}
                            >
                              <span>Open chapter</span>
                              <ChevronRight size={16} />
                            </Button>
                          </GlassPanel>
                        ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* ---------- WORD BANK ---------- */}
          {vocabSubTab === 'wordbank' && (
            <div className="space-y-5">
              <GlassPanel className="p-4 border border-[var(--border)] space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Search word or meaning..."
                    value={wbQuery}
                    onChange={(e) => {
                      setWbQuery(e.target.value);
                      setWbPage(1);
                    }}
                    className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)]/50"
                  />
                  <select
                    value={wbTopic}
                    onChange={(e) => {
                      setWbTopic(e.target.value);
                      setWbPage(1);
                    }}
                    className="px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)]/50"
                  >
                    <option value="">All topics</option>
                    {wbTopics.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setWbLetter('');
                      setWbPage(1);
                    }}
                    className={`px-2 py-1 rounded-md text-[11px] font-mono ${
                      !wbLetter
                        ? 'bg-[var(--accent-a)]/20 text-[var(--accent-a)]'
                        : 'bg-[var(--panel-2)] text-[var(--text-faint)] hover:text-[var(--text)]'
                    }`}
                  >
                    All
                  </button>
                  {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((L) => (
                    <button
                      key={L}
                      type="button"
                      onClick={() => {
                        setWbLetter(L.toLowerCase());
                        setWbPage(1);
                      }}
                      className={`px-2 py-1 rounded-md text-[11px] font-mono ${
                        wbLetter === L.toLowerCase()
                          ? 'bg-[var(--accent-a)]/20 text-[var(--accent-a)]'
                          : 'bg-[var(--panel-2)] text-[var(--text-faint)] hover:text-[var(--text)]'
                      }`}
                    >
                      {L}
                    </button>
                  ))}
                </div>

                <div className="text-[11px] font-mono text-[var(--text-faint)]">
                  {wbTotal} word{wbTotal === 1 ? '' : 's'} found
                </div>
              </GlassPanel>

              {wordBankLoading && (
                <div className="text-sm text-[var(--text-dim)] font-mono py-10 text-center">
                  Loading words...
                </div>
              )}

              {wordBankError && (
                <GlassPanel className="p-4 border border-red-500/30 text-sm text-red-400">
                  {wordBankError}
                </GlassPanel>
              )}

              {!wordBankLoading && !wordBankError && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wordBank.map((w) => (
                      <GlassPanel
                        key={w.word}
                        className="p-4 border border-[var(--border)] space-y-2"
                      >
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="font-display font-bold text-[var(--text)] text-base">
                            {w.word}
                          </span>
                          {w.part_of_speech && (
                            <span className="text-[11px] font-mono text-[var(--text-faint)] italic">
                              {w.part_of_speech}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[var(--text-dim)]">{w.meaning}</p>
                        {w.example && (
                          <p className="text-xs italic text-[var(--text-faint)]">
                            “{w.example}”
                          </p>
                        )}
                        {(w.past || w.noun_form || w.adjective_form) && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {w.past && (
                              <span className="px-1.5 py-0.5 rounded bg-[var(--panel-2)] text-[10px] font-mono text-[var(--text-faint)]">
                                past: {w.past}
                              </span>
                            )}
                            {w.noun_form && (
                              <span className="px-1.5 py-0.5 rounded bg-[var(--panel-2)] text-[10px] font-mono text-[var(--text-faint)]">
                                n: {w.noun_form}
                              </span>
                            )}
                            {w.adjective_form && (
                              <span className="px-1.5 py-0.5 rounded bg-[var(--panel-2)] text-[10px] font-mono text-[var(--text-faint)]">
                                adj: {w.adjective_form}
                              </span>
                            )}
                          </div>
                        )}
                        {w.topic && (
                          <div className="text-[10px] font-mono text-[var(--accent-a)] pt-1">
                            {w.topic}
                          </div>
                        )}
                      </GlassPanel>
                    ))}
                  </div>

                  {wbTotalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={wbPage <= 1}
                        onClick={() => setWbPage((p) => Math.max(1, p - 1))}
                      >
                        <ChevronLeft size={14} /> Prev
                      </Button>
                      <span className="text-xs font-mono text-[var(--text-faint)]">
                        Page {wbPage} / {wbTotalPages}
                      </span>
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={wbPage >= wbTotalPages}
                        onClick={() => setWbPage((p) => Math.min(wbTotalPages, p + 1))}
                      >
                        Next <ChevronRight size={14} />
                      </Button>
                    </div>
                  )}

                  {wordBank.length === 0 && (
                    <GlassPanel className="p-6 border border-[var(--border)] text-sm text-[var(--text-dim)] text-center">
                      No words match your filters.
                    </GlassPanel>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};