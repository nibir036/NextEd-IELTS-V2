'use client';

import React, { useEffect, useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { Search, Sparkles, GraduationCap, BookOpen, ChevronRight } from '../components/ui/icons';

type ResultKind = 'Grammar Module' | 'Grammar Chapter' | 'Vocabulary Chapter';

interface SearchResult {
  id: string;
  kind: ResultKind;
  title: string;
  detail: string;
  route: string; // full route to navigate to, e.g. 'lms-grammar/module-2-complex-structures'
}

interface SearchViewProps {
  id?: string;
  onNavigateAction: (route: string) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({ id, onNavigateAction }) => {
  const [query, setQuery] = useState('');
  const [selectedKind, setSelectedKind] = useState<'All' | ResultKind>('All');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Build the searchable index once from real content -- grammar
  // modules/chapters and vocab chapters -- instead of a hardcoded demo
  // list. This is what makes "Search tips & vocabulary" actually find
  // things that exist in the app.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [grammarRes, vocabRes] = await Promise.all([
          fetch('/api/grammar/modules'),
          fetch('/api/vocab'),
        ]);

        const index: SearchResult[] = [];

        if (grammarRes.ok) {
          const grammarData = await grammarRes.json();
          for (const m of grammarData.modules ?? []) {
            index.push({
              id: `gm-${m.slug}`,
              kind: 'Grammar Module',
              title: m.title,
              detail: m.subtitle || m.description || '',
              route: `lms-grammar/${m.slug}`,
            });
            for (const c of m.chapters ?? []) {
              index.push({
                id: `gc-${c.slug}`,
                kind: 'Grammar Chapter',
                title: c.title,
                detail: c.summary || `Part of ${m.title}`,
                route: `lms-grammar/${m.slug}`,
              });
            }
          }
        }

        if (vocabRes.ok) {
          const vocabData = await vocabRes.json();
          for (const c of vocabData.chapters ?? []) {
            index.push({
              id: `vc-${c.chapter}`,
              kind: 'Vocabulary Chapter',
              title: c.title,
              detail: `Vocabulary chapter ${c.chapter}`,
              route: `lms-vocab/${c.chapter}`,
            });
          }
        }

        if (!cancelled) setResults(index);
      } catch {
        if (!cancelled) setError('Could not load search content. Try again in a moment.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const kinds: ('All' | ResultKind)[] = ['All', 'Grammar Module', 'Grammar Chapter', 'Vocabulary Chapter'];

  const q = query.trim().toLowerCase();
  const filtered = results.filter((r) => {
    const matchesQuery = !q || r.title.toLowerCase().includes(q) || r.detail.toLowerCase().includes(q);
    const matchesKind = selectedKind === 'All' || r.kind === selectedKind;
    return matchesQuery && matchesKind;
  });

  const kindIcon = (kind: ResultKind) =>
    kind === 'Vocabulary Chapter' ? BookOpen : GraduationCap;

  return (
    <div id={id} className="space-y-6">
      {/* Header Banner & Search Input */}
      <GlassPanel className="p-6">
        <div className="space-y-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent-a)]/10 text-[var(--accent-a)] border border-[var(--accent-a)]/20 text-xs font-mono mb-2">
              <Sparkles size={14} />
              <span>Grammar & Vocabulary Index</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-[var(--text)]">
              Search Grammar & Vocabulary
            </h2>
          </div>

          <div className="relative">
            <Search size={18} className="absolute left-4 top-3.5 text-[var(--text-faint)]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search modules, chapters, topics..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-a)] transition-colors"
              autoFocus
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-1">
            {kinds.map((k) => (
              <button
                key={k}
                onClick={() => setSelectedKind(k)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                  selectedKind === k
                    ? 'bg-[image:var(--accent-gradient)] text-white font-semibold'
                    : 'bg-[var(--bg-elevated)] text-[var(--text-dim)] hover:text-[var(--text)] border border-[var(--border)]'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
      </GlassPanel>

      {/* Results List */}
      <div className="space-y-3">
        {loading && (
          <GlassPanel className="p-8 text-center text-sm text-[var(--text-dim)] font-mono">
            Loading searchable content...
          </GlassPanel>
        )}

        {error && (
          <GlassPanel className="p-8 text-center text-sm text-[var(--danger)]">{error}</GlassPanel>
        )}

        {!loading && !error &&
          filtered.map((r) => {
            const Icon = kindIcon(r.kind);
            return (
              <GlassPanel
                key={r.id}
                onClick={() => onNavigateAction(r.route)}
                interactive
                className="p-4 flex items-center gap-4 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-a)]/15 text-[var(--accent-a)] flex items-center justify-center shrink-0">
                  <Icon size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-[var(--accent-a)]/15 text-[var(--accent-a)] border border-[var(--accent-a)]/30 text-[10px] font-mono font-bold uppercase">
                      {r.kind}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-sm text-[var(--text)] group-hover:text-[var(--accent-a)] transition-colors truncate mt-0.5">
                    {r.title}
                  </h3>
                  {r.detail && (
                    <p className="text-xs text-[var(--text-dim)] truncate">{r.detail}</p>
                  )}
                </div>
                <ChevronRight size={16} className="text-[var(--text-faint)] group-hover:text-[var(--accent-a)] transition-colors shrink-0" />
              </GlassPanel>
            );
          })}

        {!loading && !error && filtered.length === 0 && (
          <GlassPanel className="p-8 text-center">
            <p className="text-xs text-[var(--text-dim)]">
              {query ? `No results found for "${query}".` : 'No content available yet.'}
            </p>
          </GlassPanel>
        )}
      </div>
    </div>
  );
};
