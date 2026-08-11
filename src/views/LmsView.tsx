import React, { useEffect, useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Button } from '../components/ui/Button';
import { GraduationCap, BookOpen, ChevronRight } from '../components/ui/icons';

interface LmsViewProps {
  initialTab?: string;
  id?: string;
}

// NOTE: LMS content below is still static — grammar/vocab schema (JSONB vs
// dedicated tables) is a decision pending real content. Frontend-only fix
// for now: removed the dead Tips tab (moved to per-module SkillTips) and
// the redundant in-page tab switcher that duplicated the sidebar's LMS
// submenu and could fall out of sync with it.
export const LmsView: React.FC<LmsViewProps> = ({ initialTab = 'grammar', id }) => {
  const [activeTab, setActiveTab] = useState<'grammar' | 'vocab'>(
    initialTab.includes('vocab') ? 'vocab' : 'grammar',
  );

  // Sidebar navigation changes `initialTab` on an existing LmsView instance
  // (React reuses the component), so this keeps activeTab in sync instead
  // of only reading the prop once at mount.
  useEffect(() => {
    setActiveTab(initialTab.includes('vocab') ? 'vocab' : 'grammar');
  }, [initialTab]);

  const grammarLessons = [
    {
      title: 'Complex Sentences & Subordinating Conjunctions',
      level: 'Band 7.5+',
      readTime: '8 min read',
      summary: 'Master non-restrictive relative clauses and adverbial clauses to raise Grammatical Range scores.',
      examples: [
        'Although the data indicates a initial decline, subsequent measures reversed the trend.',
        'Which is why examiners reward cohesive contrast markers over simple conjunctions.',
      ],
    },
    {
      title: 'Inversion & Emphatic Structures for Task 2',
      level: 'Band 8.0+',
      readTime: '10 min read',
      summary: 'Use structures like "Not only... but also" and "Hardly had..." cleanly without over-complicating.',
      examples: [
        'Not only do public transit investments reduce emissions, but they also boost economic mobility.',
      ],
    },
    {
      title: 'Passive Voice in Academic Writing Task 1',
      level: 'Band 7.0+',
      readTime: '6 min read',
      summary: 'Describing processes objectively using present passive and modal passives.',
      examples: [
        'Once the raw material is filtered, it is conveyed to the central furnace.',
      ],
    },
  ];

  const vocabCategories = [
    {
      category: 'Topic: Environment & Sustainability',
      bandScore: 'Band 8.0 Level',
      words: [
        { word: 'Mitigate', POS: 'verb', def: 'Make less severe or serious.', collocation: 'mitigate climate risks' },
        { word: 'Precipitous', POS: 'adj', def: 'Dangerously high or steep / sudden.', collocation: 'precipitous decline in biodiversity' },
        { word: 'Detrimental', POS: 'adj', def: 'Tending to cause harm.', collocation: 'detrimental impacts on ecosystem' },
      ],
    },
    {
      category: 'Topic: Education & Technology',
      bandScore: 'Band 8.0 Level',
      words: [
        { word: 'Ubiquitous', POS: 'adj', def: 'Present, appearing, or found everywhere.', collocation: 'ubiquitous smartphone adoption' },
        { word: 'Impediment', POS: 'noun', def: 'A hindrance or obstruction in doing something.', collocation: 'major impediment to learning' },
        { word: 'Foster', POS: 'verb', def: 'Encourage or promote the development of.', collocation: 'foster critical thinking skills' },
      ],
    },
  ];

  return (
    <div id={id} className="space-y-6">
      {/* Header Banner — no in-page tab switcher; the sidebar's LMS submenu
          (Grammar Masterclass / IELTS Vocabulary) is the single navigation
          source for this view. */}
      <GlassPanel className="p-6 md:p-8 relative overflow-hidden border border-[var(--border)]">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-[var(--accent-a)] tracking-wider mb-2">
            <GraduationCap size={18} />
            <span>LMS • Learning Management System</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[var(--text)]">
            {activeTab === 'grammar' ? 'Grammar Masterclass' : 'IELTS Vocabulary Bank'}
          </h1>
          <p className="text-sm text-[var(--text-dim)] mt-1 max-w-2xl">
            {activeTab === 'grammar'
              ? 'Curated grammar rules designed specifically to elevate your Grammatical Range & Accuracy score.'
              : 'Band 8.0+ vocabulary banks organized by topic, with collocations examiners look for.'}
          </p>
        </div>
      </GlassPanel>

      {/* Grammar */}
      {activeTab === 'grammar' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {grammarLessons.map((lesson, idx) => (
            <GlassPanel key={idx} className="p-6 flex flex-col justify-between border border-[var(--border)] hover:border-[var(--accent-a)]/40 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-md bg-[var(--accent-a)]/15 text-[var(--accent-a)] font-mono text-[11px] font-semibold">
                    {lesson.level}
                  </span>
                  <span className="text-xs text-[var(--text-faint)] font-mono">{lesson.readTime}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-[var(--text)] mb-2">
                  {lesson.title}
                </h3>
                <p className="text-xs text-[var(--text-dim)] mb-4">
                  {lesson.summary}
                </p>

                <div className="space-y-2 mb-6">
                  <div className="text-[11px] font-mono text-[var(--text-faint)] uppercase">Key Example:</div>
                  {lesson.examples.map((ex, exIdx) => (
                    <div key={exIdx} className="p-2.5 rounded-lg bg-[var(--panel-2)]/80 text-xs text-[var(--text)] border border-[var(--border)] italic">
                      "{ex}"
                    </div>
                  ))}
                </div>
              </div>

              <Button variant="secondary" size="sm" className="w-full flex items-center justify-center gap-1.5">
                <span>Start Grammar Exercise</span>
                <ChevronRight size={16} />
              </Button>
            </GlassPanel>
          ))}
        </div>
      )}

      {/* Vocabulary */}
      {activeTab === 'vocab' && (
        <div className="space-y-6">
          {vocabCategories.map((cat, catIdx) => (
            <GlassPanel key={catIdx} className="p-6 border border-[var(--border)]">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border)]">
                <h3 className="font-display text-lg font-bold text-[var(--text)] flex items-center gap-2">
                  <BookOpen size={18} className="text-[var(--accent-a)]" />
                  <span>{cat.category}</span>
                </h3>
                <span className="px-2.5 py-1 rounded-md bg-[var(--accent-a)]/15 text-[var(--accent-a)] font-mono text-[11px] font-semibold">
                  {cat.bandScore}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {cat.words.map((w, wIdx) => (
                  <div key={wIdx} className="p-4 rounded-xl bg-[var(--panel-2)]/60 border border-[var(--border)] space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="font-display font-bold text-base text-[var(--text)]">{w.word}</span>
                      <span className="text-[11px] font-mono text-[var(--text-faint)] italic">{w.POS}</span>
                    </div>
                    <p className="text-xs text-[var(--text-dim)]">{w.def}</p>
                    <div className="pt-2 border-t border-[var(--border)]/60 text-[11px] font-mono text-[var(--accent-a)]">
                      Collocation: "{w.collocation}"
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>
          ))}
        </div>
      )}
    </div>
  );
};
