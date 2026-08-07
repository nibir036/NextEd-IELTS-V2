import React, { useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Search, Sparkles, BookOpen, Check } from '../components/ui/icons';

interface SearchItem {
  id: string;
  category: 'Collocations' | 'Cohesion' | 'Grammar' | 'Exam Tips';
  title: string;
  definition: string;
  example: string;
}

const strategyDatabase: SearchItem[] = [
  {
    id: 's1',
    category: 'Collocations',
    title: 'Precipitate intense debate',
    definition: 'To cause a passionate discussion or argument to happen suddenly or unexpectedly.',
    example: 'The rapid integration of AI in universities has precipitated intense debate among academics.',
  },
  {
    id: 's2',
    category: 'Cohesion',
    title: 'Notwithstanding the advantages',
    definition: 'Sophisticated discourse marker used to introduce a contrasting counter-argument.',
    example: 'Notwithstanding the monetary advantages, remote employment can foster professional isolation.',
  },
  {
    id: 's3',
    category: 'Grammar',
    title: 'Inverted Conditional (Had it not been for)',
    definition: 'High-level Band 8.0 grammatical structure demonstrating complex conditional range.',
    example: 'Had it not been for government subsidies, small eco-enterprises would have collapsed.',
  },
  {
    id: 's4',
    category: 'Collocations',
    title: 'Tertiary education',
    definition: 'Formal academic term for university or higher education.',
    example: 'Access to tertiary education remains a key pillar of national economic development.',
  },
  {
    id: 's5',
    category: 'Exam Tips',
    title: 'True/False/Not Given Traps',
    definition: 'Avoid relying on personal world knowledge; restrict judgments solely to explicit passage statements.',
    example: 'If a statement sounds plausible but is completely unmentioned in the text, select NOT GIVEN.',
  },
];

interface SearchViewProps {
  id?: string;
}

export const SearchView: React.FC<SearchViewProps> = ({ id }) => {
  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', 'Collocations', 'Cohesion', 'Grammar', 'Exam Tips'];

  const filtered = strategyDatabase.filter((item) => {
    const matchesQuery =
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.definition.toLowerCase().includes(query.toLowerCase()) ||
      item.example.toLowerCase().includes(query.toLowerCase());
    const matchesCat = selectedCat === 'All' || item.category === selectedCat;
    return matchesQuery && matchesCat;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div id={id} className="space-y-6">
      {/* Header Banner & Search Input */}
      <GlassPanel className="p-6">
        <div className="space-y-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent-a)]/10 text-[var(--accent-a)] border border-[var(--accent-a)]/20 text-xs font-mono mb-2">
              <Sparkles size={14} />
              <span>Band 8.0 Academic Knowledge Bank</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-[var(--text)]">
              Search IELTS Vocabulary & Strategy
            </h2>
          </div>

          <div className="relative">
            <Search size={18} className="absolute left-4 top-3.5 text-[var(--text-faint)]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search collocations, cohesive devices, grammar structures..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)] transition-colors"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                  selectedCat === cat
                    ? 'bg-[var(--accent-gradient)] text-white font-semibold'
                    : 'bg-[var(--bg-elevated)] text-[var(--text-dim)] hover:text-[var(--text)] border border-[var(--border)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </GlassPanel>

      {/* Results List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <GlassPanel key={item.id} className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-md bg-[var(--accent-a)]/15 text-[var(--accent-a)] border border-[var(--accent-a)]/30 text-[11px] font-mono font-bold">
                {item.category}
              </span>
              <button
                onClick={() => handleCopy(item.id, item.example)}
                className="text-xs font-mono text-[var(--text-faint)] hover:text-[var(--accent-a)] flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedId === item.id ? (
                  <>
                    <Check size={13} className="text-[var(--success)]" />
                    <span className="text-[var(--success)]">Copied!</span>
                  </>
                ) : (
                  <span>Copy Example Sentence</span>
                )}
              </button>
            </div>

            <h3 className="font-display font-bold text-lg text-[var(--text)]">
              {item.title}
            </h3>

            <p className="text-xs text-[var(--text-dim)]">
              {item.definition}
            </p>

            <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] font-serif italic text-xs text-[var(--text)] leading-relaxed">
              "{item.example}"
            </div>
          </GlassPanel>
        ))}

        {filtered.length === 0 && (
          <GlassPanel className="p-8 text-center">
            <p className="text-xs text-[var(--text-dim)]">No strategy terms found matching "{query}". Try searching "debate" or "grammar".</p>
          </GlassPanel>
        )}
      </div>
    </div>
  );
};
