import React from 'react';
import { GlassPanel } from '../ui/GlassPanel';
import { THEMES } from '../../lib/themes';
import { useTheme } from '../theme/ThemeProvider';
import { Check, Sparkles } from '../ui/icons';

interface ThemeSwitcherProps {
  id?: string;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ id }) => {
  const { theme, setTheme } = useTheme();

  return (
    <div id={id} className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles size={18} className="text-[var(--accent-a)]" />
        <h3 className="font-display text-xl font-bold text-[var(--text)]">
          Interface Design System
        </h3>
      </div>
      <p className="text-xs text-[var(--text-dim)] max-w-xl">
        Select from 2 bespoke color tokens built with CSS custom properties. All glass surfaces, gradient fills, and typography recalculate instantly without reloading.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {THEMES.map((themeOption) => {
          const isActive = theme === themeOption.id;
          return (
            <GlassPanel
              key={themeOption.id}
              onClick={() => setTheme(themeOption.id)}
              interactive
              className={`p-5 transition-all relative cursor-pointer ${
                isActive
                  ? 'ring-2 ring-[var(--accent-a)] border-transparent shadow-lg shadow-[var(--glow-a)]'
                  : ''
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-display font-bold text-sm text-[var(--text)]">
                    {themeOption.name}
                  </h4>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-faint)]">
                    {themeOption.mode} mode
                  </span>
                </div>
                {isActive && (
                  <div className="w-6 h-6 rounded-full bg-[var(--accent-a)] text-white flex items-center justify-center">
                    <Check size={14} />
                  </div>
                )}
              </div>

              <p className="text-xs text-[var(--text-dim)] mb-4 line-clamp-2">
                {themeOption.description}
              </p>

              {/* 3-Color Swatch Preview */}
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)]">
                {themeOption.swatches.map((color, idx) => (
                  <div
                    key={idx}
                    className="flex-1 h-6 rounded-md border border-[rgba(255,255,255,0.1)] shadow-inner"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </GlassPanel>
          );
        })}
      </div>
    </div>
  );
};
