"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

interface LessonBody {
  module?: string;
  intro?: string;
  introBn?: string;
  sections?: any[];
  exercises?: any[];
  answerKey?: any;
}

interface Lesson {
  id: string;
  title: string;
  titleBn: string;
  position: number;
  body: LessonBody;
}

// Renders one section's `content` object, covering every field the seed uses.
function SectionContent({ content }: { content: any }) {
  if (!content) return null;

  return (
    <>
      {content.coreFact && (
        <p className="text-slate-200 leading-relaxed mb-4">{content.coreFact}</p>
      )}

      {/* steps: framework skeletons (Answer/Reason/Detail, cue-card system...) */}
      {content.steps?.length > 0 && (
        <div className="mb-4 space-y-2">
          {content.steps.map((s: any, i: number) => (
            <div
              key={i}
              className="flex gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50"
            >
              <span className="text-amber-400 font-semibold text-sm shrink-0">
                {s.term}
              </span>
              {s.en && <span className="text-slate-300 text-sm">{s.en}</span>}
            </div>
          ))}
        </div>
      )}

      {/* points: term + en + optional bn */}
      {content.points?.map((p: any, i: number) => (
        <div key={i} className="mb-4 pl-4 border-l-2 border-amber-500/30">
          <p className="font-medium text-amber-200/90">{p.term}</p>
          {p.en && <p className="text-slate-300 text-sm mt-1">{p.en}</p>}
          {p.bn && <p className="text-slate-500 text-sm mt-1">{p.bn}</p>}
        </div>
      ))}

      {/* bullets: wrapped in a real <ul> */}
      {content.bullets?.length > 0 && (
        <ul className="list-disc ml-5 mb-4 space-y-2">
          {content.bullets.map((b: string, i: number) => (
            <li key={i} className="text-slate-300 text-sm leading-relaxed">
              {b}
            </li>
          ))}
        </ul>
      )}

      {/* examples: right (good) / wrong (bad) / why explanation */}
      {content.examples?.length > 0 && (
        <div className="mb-4 space-y-3">
          {content.examples.map((ex: any, i: number) => (
            <div key={i} className="space-y-2">
              {ex.wrong && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3">
                  <p className="text-slate-200 text-sm leading-relaxed">
                    {ex.wrong}
                  </p>
                </div>
              )}
              {ex.right && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                  <p className="text-slate-200 text-sm leading-relaxed">
                    {ex.right}
                  </p>
                </div>
              )}
              {ex.why && (
                <p className="text-slate-500 text-xs italic px-1 leading-relaxed">
                  {ex.why}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* second core fact paragraph */}
      {content.coreFact2 && (
        <p className="text-slate-200 leading-relaxed mb-4">{content.coreFact2}</p>
      )}

      {/* key (highlighted takeaway) + its Bangla */}
      {content.key && (
        <div className="mt-4 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
          <p className="text-slate-300 text-sm leading-relaxed">{content.key}</p>
          {content.keyBn && (
            <p className="text-slate-500 text-sm mt-2 leading-relaxed">
              {content.keyBn}
            </p>
          )}
        </div>
      )}

      {/* principle + its Bangla */}
      {content.principle && (
        <div className="mt-4 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
          <p className="text-sm font-medium text-amber-300 mb-1">Principle</p>
          <p className="text-slate-300 text-sm leading-relaxed">
            {content.principle}
          </p>
          {content.principleBn && (
            <p className="text-slate-500 text-sm mt-2 leading-relaxed">
              {content.principleBn}
            </p>
          )}
        </div>
      )}

      {/* tutor tip + its Bangla */}
      {content.tutorTip && (
        <div className="mt-4 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
          <p className="text-sm font-medium text-emerald-300 mb-1">
            Tutor Insider Tip
          </p>
          <p className="text-slate-300 text-sm leading-relaxed">
            {content.tutorTip}
          </p>
          {content.tutorTipBn && (
            <p className="text-slate-500 text-sm mt-2 leading-relaxed">
              {content.tutorTipBn}
            </p>
          )}
        </div>
      )}

      {/* section-level Bangla summary */}
      {content.bn && (
        <p className="text-slate-500 text-sm mt-4 leading-relaxed border-t border-slate-800 pt-3">
          {content.bn}
        </p>
      )}
    </>
  );
}

export default function SpeakingLessonDetail() {
  const params = useParams();
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/lessons/${params.id}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setLesson(data.lesson || data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (params.id) load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <p className="text-lg mb-4">Lesson পাওয়া যায়নি</p>
          <Link href="/speaking" className="text-amber-400 hover:underline">
            ← ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  const body = lesson.body || {};
  const exercises = body.exercises || [];
  const answerKey = body.answerKey || {};
  const answerKeyGroups = Object.keys(answerKey);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-amber-400 mb-8 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Speaking Tips
        </button>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm">
              {lesson.position}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{lesson.title}</h1>
              <p className="text-slate-400 mt-1">{lesson.titleBn}</p>
            </div>
          </div>
        </div>

        {/* Intro */}
        {body.intro && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 mb-8">
            <p className="text-slate-200 leading-relaxed whitespace-pre-line">
              {body.intro}
            </p>
            {body.introBn && (
              <p className="text-slate-400 mt-4 text-sm leading-relaxed border-t border-slate-800 pt-4">
                {body.introBn}
              </p>
            )}
          </div>
        )}

        {/* Sections */}
        {body.sections?.map((section: any, idx: number) => (
          <div
            key={idx}
            className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 mb-6"
          >
            <h2 className="text-xl font-semibold text-amber-300 mb-1">
              {section.title}
            </h2>
            {section.titleBn && (
              <p className="text-slate-500 text-sm mb-4">{section.titleBn}</p>
            )}

            <SectionContent content={section.content} />
          </div>
        ))}

        {/* Exercises */}
        {exercises.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-amber-300 mb-4">Practice</h2>
            {exercises.map((ex: any, idx: number) => (
              <div
                key={idx}
                className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 mb-4"
              >
                <h3 className="font-medium text-lg mb-2">
                  {ex.code} · {ex.title}
                </h3>
                <p className="text-slate-400 text-sm mb-1">{ex.instruction}</p>
                {ex.instructionBn && (
                  <p className="text-slate-500 text-sm mb-3">{ex.instructionBn}</p>
                )}

                {ex.paragraph && (
                  <p className="text-slate-300 text-sm whitespace-pre-line mb-3">
                    {ex.paragraph}
                  </p>
                )}

                {/* drill items: question + answer + explanation */}
                {ex.items?.length > 0 && (
                  <div className="space-y-3 mt-3">
                    {ex.items.map((it: any, i: number) => (
                      <div
                        key={i}
                        className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-4"
                      >
                        {it.sentence && (
                          <p className="text-slate-200 text-sm mb-2">
                            {it.q ? `${it.q}. ` : ""}
                            {it.sentence}
                          </p>
                        )}
                        {Array.isArray(it.answer) && it.answer.length > 0 && (
                          <p className="text-emerald-300 text-sm">
                            <span className="text-slate-500">Answer: </span>
                            {it.answer[0]}
                          </p>
                        )}
                        {it.explanation && (
                          <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                            {it.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Answer Key */}
        {answerKeyGroups.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-amber-300 mb-4">
              Answer Key & Reasoning
            </h2>
            {answerKeyGroups.map((groupName, gi) => (
              <div
                key={gi}
                className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 mb-4"
              >
                <h3 className="font-medium text-base text-amber-200/90 mb-3">
                  {groupName}
                </h3>
                <div className="space-y-3">
                  {(answerKey[groupName] || []).map((row: any, ri: number) => (
                    <div
                      key={ri}
                      className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-4"
                    >
                      {row.q !== undefined && (
                        <p className="text-slate-400 text-sm mb-1">
                          <span className="text-slate-500">Q: </span>
                          {String(row.q)}
                        </p>
                      )}
                      {row.answer && (
                        <p className="text-emerald-300 text-sm">
                          <span className="text-slate-500">Answer: </span>
                          {row.answer}
                        </p>
                      )}
                      {row.why && (
                        <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                          {row.why}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}