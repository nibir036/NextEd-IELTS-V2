import React from 'react';

interface BrowseTabSwitcherProps {
  active: 'tests' | 'tips';
  onSelect: (tab: 'tests' | 'tips') => void;
}

// Explicit Tests / Tips & Tricks toggle shown at the top of every practice
// module's browse screen (Writing/Reading/Speaking/Listening). The sidebar's
// nested dropdown (Practice Tests > e.g. Writing Practice > Tests / Tips &
// Tricks) already lets a candidate switch, but plenty of people never
// notice a nav item even has a dropdown -- this makes the same switch
// impossible to miss. Both controls drive the exact same route
// (`<skill>/tests` or `<skill>/tips`, via the view's onNavigateAction),
// so whichever one a candidate uses, the URL, the sidebar's highlighted
// sub-item, and this switcher's own highlighted pill all stay in sync.
export const BrowseTabSwitcher: React.FC<BrowseTabSwitcherProps> = ({ active, onSelect }) => (
  <div className="inline-flex items-center gap-1 bg-[var(--panel-2)] border border-[var(--border)] p-1.5 rounded-xl">
    <button
      type="button"
      onClick={() => onSelect('tests')}
      aria-pressed={active === 'tests'}
      className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
        active === 'tests'
          ? 'bg-[image:var(--accent-gradient)] text-white shadow'
          : 'text-[var(--text-dim)] hover:text-[var(--text)]'
      }`}
    >
      Tests
    </button>
    <button
      type="button"
      onClick={() => onSelect('tips')}
      aria-pressed={active === 'tips'}
      className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
        active === 'tips'
          ? 'bg-[image:var(--accent-gradient)] text-white shadow'
          : 'text-[var(--text-dim)] hover:text-[var(--text)]'
      }`}
    >
      Tips &amp; Tricks
    </button>
  </div>
);
