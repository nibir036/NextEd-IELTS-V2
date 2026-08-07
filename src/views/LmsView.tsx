import React, { useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Button } from '../components/ui/Button';
import { GraduationCap, BookOpen, Sparkles, Check, ChevronRight } from '../components/ui/icons';

interface LmsViewProps {
  initialTab?: string;
  id?: string;
}

export const LmsView: React.FC<LmsViewProps> = ({ initialTab = 'grammar', id }) => {
  const [activeTab, setActiveTab] = useState<'grammar' | 'vocab' | 'tips'>(
    initialTab.includes('vocab')
      ? 'vocab'
      : initialTab.includes('tips')
      ? 'tips'
      : 'grammar'
  );

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

  const tipsList = [
    {
      title: 'Task 2 Coherence Secret: The 1-Idea Paragraph Rule',
      author: 'Former Senior IELTS Examiner',
      rule: 'Each body paragraph MUST contain only ONE central topic sentence supported by 2 specific evidence points.',
      checklist: ['Clear Topic Sentence', 'Explanation (Why / How)', 'Concrete Example', 'Concluding Link Sentence'],
    },
    {
      title: 'Speaking Part 2: The PPF Structure (Past, Present, Future)',
      author: 'IELTS Band 9 Specialist',
      rule: 'If you run out of ideas during the 2-minute card response, shift time frames smoothly to extend talk time.',
      checklist: ['Describe the core event', 'Compare it to past experiences', 'Project future developments'],
    },
  ];

  return (
    <div id={id} className="space-y-6">
      {/* Header Banner */}
      <GlassPanel className="p-6 md:p-8 relative overflow-hidden border border-[var(--border)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-[var(--accent-a)] tracking-wider mb-2">
              <GraduationCap size={18} />
              <span>LMS • Learning Management System</span>
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-[var(--text)]">
              IELTS Masterclass Modules
            </h1>
            <p className="text-sm text-[var(--text-dim)] mt-1 max-w-2xl">
              Curated grammar rules, Band 8.0+ vocabulary banks, and examiner-verified tips designed specifically to elevate your band scores.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[var(--panel-2)] p-1.5 rounded-xl border border-[var(--border)] self-start md:self-auto">
            <button
              onClick={() => setActiveTab('grammar')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'grammar'
                  ? 'bg-[image:var(--accent-gradient)] text-white shadow-md font-semibold'
                  : 'text-[var(--text-dim)] hover:text-[var(--text)]'
              }`}
            >
              Grammar
            </button>
            <button
              onClick={() => setActiveTab('vocab')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'vocab'
                  ? 'bg-[image:var(--accent-gradient)] text-white shadow-md font-semibold'
                  : 'text-[var(--text-dim)] hover:text-[var(--text)]'
              }`}
            >
              Vocabulary
            </button>
            <button
              onClick={() => setActiveTab('tips')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'tips'
                  ? 'bg-[image:var(--accent-gradient)] text-white shadow-md font-semibold'
                  : 'text-[var(--text-dim)] hover:text-[var(--text)]'
              }`}
            >
              Tips & Tricks
            </button>
          </div>
        </div>
      </GlassPanel>

      {/* Tab 1: Grammar */}
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

      {/* Tab 2: Vocabulary */}
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

      {/* Tab 3: Tips & Tricks */}
      {activeTab === 'tips' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tipsList.map((tip, tIdx) => (
            <GlassPanel key={tIdx} className="p-6 border border-[var(--border)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[var(--accent-a)] font-semibold flex items-center gap-1.5">
                  <Sparkles size={14} />
                  <span>{tip.author}</span>
                </span>
              </div>

              <h3 className="font-display text-lg font-bold text-[var(--text)]">
                {tip.title}
              </h3>

              <div className="p-3.5 rounded-xl bg-[var(--panel-2)] border border-[var(--border)] text-xs text-[var(--text)] leading-relaxed">
                <span className="font-bold text-[var(--accent-a)]">Core Principle: </span>
                {tip.rule}
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-mono uppercase text-[var(--text-faint)]">Checklist Before Submission:</div>
                <div className="grid grid-cols-2 gap-2">
                  {tip.checklist.map((item, iIdx) => (
                    <div key={iIdx} className="flex items-center gap-2 text-xs text-[var(--text-dim)] p-2 rounded-lg bg-[var(--bg)] border border-[var(--border)]">
                      <Check size={14} className="text-[var(--success)] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassPanel>
          ))}
        </div>
      )}
    </div>
  );
};
