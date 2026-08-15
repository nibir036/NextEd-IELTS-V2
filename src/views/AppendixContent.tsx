import React from "react";

// ============================================================================
// AppendixContent.tsx
// ----------------------------------------------------------------------------
// Appendix A–J এর body-তে যেসব নতুন structure আছে (verbs, plan, mistakes,
// pairs, terms, questions ইত্যাদি) সেগুলো render করে।
//
// LmsView.tsx-এ ব্যবহার:
//   1. উপরে import করুন:
//        import { AppendixSectionContent } from "./AppendixContent";
//
//   2. section render করার জায়গায়, section.content-এর নিচে এক লাইন যোগ করুন:
//        <AppendixSectionContent content={section.content} />
//
//   (বিস্তারিত কোথায় বসাবেন নিচের নির্দেশনায় দেওয়া আছে।)
// ============================================================================

// একটা ছোট প্যানেল হেল্পার (LmsView-এর স্টাইল হুবহু মেনে)
const Box: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div
    className={`p-4 rounded-lg bg-[var(--panel-2)] border border-[var(--border)] ${className}`}
  >
    {children}
  </div>
);

export const AppendixSectionContent: React.FC<{ content: any }> = ({
  content,
}) => {
  if (!content) return null;

  return (
    <>
      {/* ── A: Irregular verb table (content.verbs) ── */}
      {Array.isArray(content.verbs) && (
        <div className="rounded-lg border border-[var(--border)] overflow-hidden">
          <div className="grid grid-cols-3 gap-px bg-[var(--border)] text-[11px] font-mono font-semibold uppercase text-[var(--accent-a)]">
            <div className="bg-[var(--panel-2)] px-3 py-2">Base</div>
            <div className="bg-[var(--panel-2)] px-3 py-2">Past simple</div>
            <div className="bg-[var(--panel-2)] px-3 py-2">Past participle</div>
          </div>
          <div className="grid grid-cols-3 gap-px bg-[var(--border)]">
            {content.verbs.map((v: any, i: number) => (
              <React.Fragment key={i}>
                <div className="bg-[var(--bg)] px-3 py-1.5 text-xs text-[var(--text)]">
                  {v.base}
                </div>
                <div className="bg-[var(--bg)] px-3 py-1.5 text-xs text-[var(--text-dim)]">
                  {v.past}
                </div>
                <div className="bg-[var(--bg)] px-3 py-1.5 text-xs text-[var(--text-dim)]">
                  {v.pp}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* ── B: daily rhythm steps (content.steps) ── */}
      {Array.isArray(content.steps) && (
        <div className="space-y-2">
          {content.steps.map((s: any, i: number) => (
            <Box key={i}>
              <div className="font-semibold text-sm text-[var(--accent-a)]">
                {s.min}
              </div>
              <p className="text-xs text-[var(--text)] mt-1 leading-relaxed">
                {s.en}
              </p>
            </Box>
          ))}
        </div>
      )}

      {/* ── B: 8-week plan table (content.plan) ── */}
      {Array.isArray(content.plan) && (
        <div className="rounded-lg border border-[var(--border)] overflow-hidden space-y-px">
          {content.plan.map((row: any, i: number) => (
            <div key={i} className="bg-[var(--bg)] p-4 space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[var(--accent-a)]/15 text-[var(--accent-a)] font-mono text-[11px] font-semibold">
                  Week {row.week}
                </span>
                <span className="font-semibold text-sm text-[var(--text)]">
                  {row.focus}
                </span>
              </div>
              {row.todo && (
                <p className="text-xs text-[var(--text)] leading-relaxed">
                  <span className="text-[var(--text-faint)]">Do: </span>
                  {row.todo}
                </p>
              )}
              {row.goal && (
                <p className="text-xs text-[var(--text-dim)] leading-relaxed">
                  <span className="text-[var(--text-faint)]">Goal: </span>
                  {row.goal}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── C: proofreading passes (content.passes) ── */}
      {Array.isArray(content.passes) && (
        <div className="space-y-2">
          {content.passes.map((p: any, i: number) => (
            <Box key={i}>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[var(--accent-a)]/15 text-[var(--accent-a)] font-mono text-[11px] font-semibold">
                  Pass {p.pass}
                </span>
                <span className="font-mono text-xs font-bold text-[var(--text)]">
                  {p.code}
                </span>
              </div>
              <p className="text-xs text-[var(--text)] mt-2 leading-relaxed">
                {p.question}
              </p>
            </Box>
          ))}
        </div>
      )}

      {/* ── C: error log columns + examples (content.columns / content.examples as objects) ── */}
      {Array.isArray(content.columns) && (
        <Box>
          <div className="text-[11px] font-mono uppercase text-[var(--text-faint)] mb-2">
            Columns
          </div>
          <div className="flex flex-wrap gap-2">
            {content.columns.map((c: string, i: number) => (
              <span
                key={i}
                className="px-2 py-1 rounded bg-[var(--bg)] border border-[var(--border)] text-[11px] text-[var(--text-dim)]"
              >
                {c}
              </span>
            ))}
          </div>
        </Box>
      )}

      {/* ── C/E: examples array of objects with date/error/code OR error-log rows ── */}
      {Array.isArray(content.examples) &&
        typeof content.examples[0] === "object" &&
        content.examples[0]?.error !== undefined && (
          <div className="space-y-2">
            {content.examples.map((ex: any, i: number) => (
              <Box key={i}>
                {ex.date && (
                  <div className="text-[11px] font-mono text-[var(--text-faint)]">
                    {ex.date}
                  </div>
                )}
                <p className="text-xs text-rose-400 mt-1">✗ {ex.error}</p>
                <p className="text-xs text-emerald-400 mt-0.5">
                  ✓ {ex.correction}
                </p>
                {ex.code && (
                  <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-[var(--accent-a)]/15 text-[var(--accent-a)] font-mono text-[10px] font-semibold">
                    {ex.code}
                  </span>
                )}
                {ex.rule && (
                  <p className="text-[11px] text-[var(--text-dim)] mt-1 italic">
                    {ex.rule}
                  </p>
                )}
              </Box>
            ))}
          </div>
        )}

      {/* ── C/J: checklist (content.checklist) ── */}
      {Array.isArray(content.checklist) && (
        <div className="space-y-1.5">
          {content.checklist.map((c: string, i: number) => (
            <div
              key={i}
              className="flex items-start gap-2 text-xs text-[var(--text)] p-2.5 rounded-lg bg-[var(--bg)] border border-[var(--border)]"
            >
              <span className="text-[var(--accent-a)] font-mono font-bold shrink-0">
                {i + 1}.
              </span>
              <span className="leading-relaxed">{c}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── D: model answer task + model + annotations ── */}
      {content.task && (
        <Box>
          <div className="text-[11px] font-mono uppercase text-[var(--text-faint)] mb-1">
            Task
          </div>
          <p className="text-xs text-[var(--text)] leading-relaxed">
            {content.task}
          </p>
        </Box>
      )}
      {content.model && (
        <Box className="border-l-2 border-l-[var(--accent-a)]">
          <div className="text-[11px] font-mono uppercase text-[var(--accent-a)] mb-1">
            Model Answer
          </div>
          <p className="text-sm text-[var(--text)] leading-relaxed whitespace-pre-line">
            {content.model}
          </p>
        </Box>
      )}
      {Array.isArray(content.annotations) && (
        <div className="rounded-lg border border-[var(--border)] overflow-hidden">
          <div className="grid grid-cols-2 gap-px bg-[var(--border)] text-[11px] font-mono font-semibold uppercase text-[var(--accent-a)]">
            <div className="bg-[var(--panel-2)] px-3 py-2">Structure</div>
            <div className="bg-[var(--panel-2)] px-3 py-2">Where it appears</div>
          </div>
          <div className="grid grid-cols-2 gap-px bg-[var(--border)]">
            {content.annotations.map((a: any, i: number) => (
              <React.Fragment key={i}>
                <div className="bg-[var(--bg)] px-3 py-2 text-xs text-[var(--text)]">
                  {a.structure}
                </div>
                <div className="bg-[var(--bg)] px-3 py-2 text-xs text-[var(--text-dim)]">
                  {a.where}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
      {content.lesson && (
        <Box>
          <p className="text-xs text-[var(--text)] leading-relaxed">
            {content.lesson}
          </p>
        </Box>
      )}

      {/* ── E: mistakes (content.mistakes) ── */}
      {Array.isArray(content.mistakes) && (
        <div className="space-y-2">
          {content.mistakes.map((m: any, i: number) => (
            <Box key={i}>
              <div className="flex items-start gap-2">
                {m.n != null && (
                  <span className="font-mono text-xs font-bold text-[var(--accent-a)] shrink-0">
                    {m.n}.
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-rose-400">✗ {m.wrong}</p>
                  <p className="text-xs text-emerald-400 mt-0.5">✓ {m.right}</p>
                  {m.why && (
                    <p className="text-[11px] text-[var(--text-faint)] mt-1">
                      {m.why}
                    </p>
                  )}
                </div>
              </div>
            </Box>
          ))}
        </div>
      )}

      {/* ── F: punctuation uses (content.uses) ── */}
      {Array.isArray(content.uses) && (
        <div className="space-y-1.5">
          {content.uses.map((u: string, i: number) => (
            <div
              key={i}
              className="flex items-start gap-2 text-xs text-[var(--text)] p-2.5 rounded-lg bg-[var(--bg)] border border-[var(--border)]"
            >
              <span className="text-[var(--accent-a)] font-mono font-bold shrink-0">
                •
              </span>
              <span className="leading-relaxed">{u}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── G: confused pairs (content.pairs) ── */}
      {Array.isArray(content.pairs) && (
        <div className="space-y-2">
          {content.pairs.map((p: any, i: number) => (
            <Box key={i}>
              <div className="font-semibold text-sm text-[var(--accent-a)]">
                {p.pair}
              </div>
              <p className="text-xs text-[var(--text)] mt-1 leading-relaxed">
                {p.difference}
              </p>
              {p.examples && (
                <p className="text-[11px] text-[var(--text-dim)] mt-1.5 italic leading-relaxed">
                  {p.examples}
                </p>
              )}
            </Box>
          ))}
        </div>
      )}

      {/* ── H: MCQ questions (content.questions) ── */}
      {Array.isArray(content.questions) && (
        <div className="space-y-2">
          {content.questions.map((q: any, i: number) => (
            <Box key={i}>
              <div className="text-sm text-[var(--text)] leading-relaxed">
                <span className="font-mono text-[var(--accent-a)] mr-2">
                  {q.q}.
                </span>
                {q.text}
              </div>
              {q.options && (
                <p className="text-xs text-[var(--text-dim)] mt-2 font-mono leading-relaxed">
                  {q.options}
                </p>
              )}
            </Box>
          ))}
        </div>
      )}

      {/* ── H: band predictor scale (content.scale) ── */}
      {Array.isArray(content.scale) && (
        <div className="rounded-lg border border-[var(--border)] overflow-hidden">
          <div className="grid grid-cols-2 gap-px bg-[var(--border)] text-[11px] font-mono font-semibold uppercase text-[var(--accent-a)]">
            <div className="bg-[var(--panel-2)] px-3 py-2">Total correct</div>
            <div className="bg-[var(--panel-2)] px-3 py-2">Predicted band</div>
          </div>
          <div className="grid grid-cols-2 gap-px bg-[var(--border)]">
            {content.scale.map((s: any, i: number) => (
              <React.Fragment key={i}>
                <div className="bg-[var(--bg)] px-3 py-2 text-xs text-[var(--text)]">
                  {s.total}
                </div>
                <div className="bg-[var(--bg)] px-3 py-2 text-xs text-[var(--text-dim)]">
                  {s.band}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* ── I: glossary terms (content.terms) ── */}
      {Array.isArray(content.terms) && (
        <div className="space-y-1.5">
          {content.terms.map((t: any, i: number) => (
            <div
              key={i}
              className="p-3 rounded-lg bg-[var(--bg)] border border-[var(--border)]"
            >
              <div className="font-semibold text-sm text-[var(--accent-a)]">
                {t.term}
              </div>
              <p className="text-xs text-[var(--text)] mt-0.5 leading-relaxed">
                {t.en}
              </p>
              {t.bn && (
                <p className="text-[11px] text-[var(--text-dim)] mt-1 italic">
                  {t.bn}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── J: cheat-sheet blocks (content.blocks) ── */}
      {Array.isArray(content.blocks) && (
        <div className="space-y-3">
          {content.blocks.map((b: any, i: number) => (
            <Box key={i}>
              <div className="font-semibold text-sm text-[var(--accent-a)] mb-2">
                {b.heading}
              </div>
              <div className="space-y-1.5">
                {Array.isArray(b.lines) &&
                  b.lines.map((line: string, j: number) => (
                    <div
                      key={j}
                      className="flex items-start gap-2 text-xs text-[var(--text)] leading-relaxed"
                    >
                      <span className="text-[var(--accent-a)] shrink-0">–</span>
                      <span>{line}</span>
                    </div>
                  ))}
              </div>
            </Box>
          ))}
        </div>
      )}

      {/* ── J: audit list (content.audit) ── */}
      {Array.isArray(content.audit) && (
        <div className="space-y-1.5">
          {content.audit.map((a: string, i: number) => (
            <div
              key={i}
              className="flex items-start gap-2 text-xs text-[var(--text)] p-2.5 rounded-lg bg-[var(--bg)] border border-[var(--border)]"
            >
              <span className="text-[var(--accent-a)] font-mono font-bold shrink-0">
                {i + 1}.
              </span>
              <span className="leading-relaxed">{a}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── closing note (যেকোনো appendix-এ থাকতে পারে) ── */}
      {content.closing && (
        <p className="text-[11px] text-[var(--text-faint)] italic leading-relaxed">
          {content.closing}
        </p>
      )}
    </>
  );
};
