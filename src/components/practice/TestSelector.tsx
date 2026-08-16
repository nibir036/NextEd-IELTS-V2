import React from 'react';

interface TestSelectorProps {
  skill: 'speaking' | 'reading' | 'listening' | 'writing';
  onSelect: (testId: string) => void;
  emptyDescription?: string;
}

export const TestSelector: React.FC<TestSelectorProps> = ({
  skill,
  onSelect,
  emptyDescription,
}) => {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[var(--text)]">
          {skill.charAt(0).toUpperCase() + skill.slice(1)} Tests
        </h3>

        <p className="mt-1 text-sm text-[var(--text-dim)]">
          {emptyDescription ||
            `No ${skill} tests are currently available.`}
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-[var(--border)] p-8 text-center">
        <p className="text-sm text-[var(--text-dim)]">
          No tests available yet.
        </p>
      </div>
    </div>
  );
};