import React, { useState } from 'react';
import { TipsFigure, TipsFigureBlock } from './TipsFigure';

export type TipsBlock =
  | { id: string; type: 'heading'; level: 1 | 2 | 3 | 4; text: string }
  | { id: string; type: 'paragraph'; text: string; bn?: string; variant?: 'footer' }
  | { id: string; type: 'list'; ordered?: boolean; items: string[] }
  | { id: string; type: 'table'; headers: string[]; rows: string[][]; caption?: string }
  | { id: string; type: 'principle'; text: string }
  | { id: string; type: 'callout'; variant: 'tutor_tip'; title: string; text: string; bn?: string }
  | { id: string; type: 'practice_drill'; label: string; prompt: string; answer: string }
  | TipsFigureBlock;

const Heading: React.FC<{ block: Extract<TipsBlock, { type: 'heading' }> }> = ({ block }) => {
  if (block.level === 1) {
    return (
      <h2 className="font-display text-lg font-bold text-[var(--accent-a)] mt-8 mb-1 tracking-wide uppercase text-sm">
        {block.text}
      </h2>
    );
  }
  if (block.level === 2) {
    return <h3 className="font-display text-xl font-bold text-[var(--text)] mt-6 mb-2">{block.text}</h3>;
  }
  if (block.level === 3) {
    return <h4 className="text-base font-semibold text-[var(--text)] mt-5 mb-1.5">{block.text}</h4>;
  }
  return <h5 className="text-sm font-semibold text-[var(--text-dim)] mt-4 mb-1">{block.text}</h5>;
};

const Paragraph: React.FC<{ block: Extract<TipsBlock, { type: 'paragraph' }> }> = ({ block }) => {
  if (block.variant === 'footer') {
    return (
      <p className="text-[10px] text-[var(--text-dim)] italic mt-8 pt-4 border-t border-[var(--border)]">
        {block.text}
      </p>
    );
  }
  return (
    <div className="my-2">
      <p className="text-sm leading-relaxed text-[var(--text)]">{block.text}</p>
      {block.bn && <p className="text-xs leading-relaxed text-[var(--text-dim)] mt-1">{block.bn}</p>}
    </div>
  );
};

const ListBlock: React.FC<{ block: Extract<TipsBlock, { type: 'list' }> }> = ({ block }) => {
  const Tag = block.ordered ? 'ol' : 'ul';
  return (
    <Tag className={`my-2 pl-5 space-y-1.5 text-sm text-[var(--text)] ${block.ordered ? 'list-decimal' : 'list-disc'}`}>
      {block.items.map((item, i) => (
        <li key={i} className="leading-relaxed">{item}</li>
      ))}
    </Tag>
  );
};

const TableBlock: React.FC<{ block: Extract<TipsBlock, { type: 'table' }> }> = ({ block }) => (
  <div className="my-3 overflow-x-auto rounded-lg border border-[var(--border)]">
    <table className="w-full text-xs border-collapse">
      <thead>
        <tr>
          {block.headers.map((h) => (
            <th key={h} className="text-left px-3 py-2 bg-[var(--panel-2)] text-[var(--text-dim)] font-medium border-b border-[var(--border)]">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {block.rows.map((r, i) => (
          <tr key={i} className="odd:bg-transparent even:bg-[var(--panel-2)]/40">
            {r.map((c, ci) => (
              <td key={ci} className="px-3 py-1.5 text-[var(--text)] border-b border-[var(--border)]/40">{c}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    {block.caption && <p className="text-[10px] text-[var(--text-dim)] italic px-3 py-1.5">{block.caption}</p>}
  </div>
);

const PrincipleBlock: React.FC<{ block: Extract<TipsBlock, { type: 'principle' }> }> = ({ block }) => (
  <div className="my-3 rounded-xl border border-[var(--accent-a)]/30 bg-[var(--accent-a)]/8 p-4">
    <div className="text-[10px] font-bold tracking-widest text-[var(--accent-a)] mb-1.5 uppercase">Principle</div>
    <p className="text-sm leading-relaxed text-[var(--text)]">{block.text}</p>
  </div>
);

const TutorTipBlock: React.FC<{ block: Extract<TipsBlock, { type: 'callout' }> }> = ({ block }) => (
  <div className="my-3 rounded-xl border border-[var(--accent-b)]/30 bg-[var(--accent-b)]/8 p-4">
    <div className="text-[10px] font-bold tracking-widest text-[var(--accent-b)] mb-1.5 uppercase">{block.title}</div>
    <p className="text-sm leading-relaxed text-[var(--text)]">{block.text}</p>
    {block.bn && <p className="text-xs leading-relaxed text-[var(--text-dim)] mt-2 pt-2 border-t border-[var(--accent-b)]/15">{block.bn}</p>}
  </div>
);

const DrillBlock: React.FC<{ block: Extract<TipsBlock, { type: 'practice_drill' }> }> = ({ block }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="my-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/40 p-4">
      <div className="text-xs font-semibold text-[var(--text)] mb-1.5">{block.label}</div>
      <p className="text-sm leading-relaxed text-[var(--text)] whitespace-pre-line">{block.prompt}</p>
      <button
        onClick={() => setOpen((o) => !o)}
        className="mt-3 text-xs font-medium text-[var(--accent-a)] hover:underline"
      >
        {open ? 'Hide answer & reasoning' : 'Show answer & reasoning'}
      </button>
      {open && (
        <p className="text-sm leading-relaxed text-[var(--text-dim)] whitespace-pre-line mt-2 pt-2 border-t border-[var(--border)]">
          {block.answer}
        </p>
      )}
    </div>
  );
};

export const TipsBlockRenderer: React.FC<{ block: TipsBlock }> = ({ block }) => {
  switch (block.type) {
    case 'heading':
      return <Heading block={block} />;
    case 'paragraph':
      return <Paragraph block={block} />;
    case 'list':
      return <ListBlock block={block} />;
    case 'table':
      return <TableBlock block={block} />;
    case 'principle':
      return <PrincipleBlock block={block} />;
    case 'callout':
      return <TutorTipBlock block={block} />;
    case 'practice_drill':
      return <DrillBlock block={block} />;
    case 'figure':
      return <TipsFigure block={block} />;
    default:
      return null;
  }
};
