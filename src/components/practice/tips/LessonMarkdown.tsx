import React from 'react';
import { parseInline } from './parseInline';

type BodyNode =
  | { t: 'ul' | 'ol'; items: string[] }
  | { t: 'bn'; text: string }
  | { t: 'p'; lines: string[] };

function parseBody(lines: string[]): BodyNode[] {
  const out: BodyNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    if (/^-\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^-\s/.test(lines[i])) {
        items.push(lines[i].replace(/^-\s/, ''));
        i++;
      }
      out.push({ t: 'ul', items });
    } else if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ''));
        i++;
      }
      out.push({ t: 'ol', items });
    } else if (/^>\s/.test(line)) {
      out.push({ t: 'bn', text: line.replace(/^>\s/, '') });
      i++;
    } else {
      const para: string[] = [];
      while (i < lines.length && lines[i].trim() && !/^(-|\d+\.|>)\s/.test(lines[i])) {
        para.push(lines[i]);
        i++;
      }
      out.push({ t: 'p', lines: para });
    }
  }
  return out;
}

const Nodes: React.FC<{ nodes: BodyNode[] }> = ({ nodes }) => (
  <>
    {nodes.map((n, k) => {
      switch (n.t) {
        case 'ul':
        case 'ol': {
          const Tag = n.t;
          return (
            <Tag key={k} className={`my-2 pl-5 space-y-1 text-sm text-[var(--text)] ${n.t === 'ul' ? 'list-disc' : 'list-decimal'}`}>
              {n.items.map((item, j) => (
                <li key={j} className="leading-relaxed">{parseInline(item)}</li>
              ))}
            </Tag>
          );
        }
        case 'bn':
          return (
            <p key={k} lang="bn" className="text-xs text-[var(--text-dim)] italic mt-2 pt-2 border-t border-[var(--border)]/40">
              {n.text}
            </p>
          );
        case 'p':
          return (
            <p key={k} className="text-sm text-[var(--text)] leading-relaxed my-2">
              {n.lines.map((l, j) => (
                <React.Fragment key={j}>
                  {j > 0 && <br />}
                  {parseInline(l)}
                </React.Fragment>
              ))}
            </p>
          );
        default:
          return null;
      }
    })}
  </>
);

export const LessonMarkdown: React.FC<{ md: string }> = ({ md }) => {
  const sections: { heading: string | null; lines: string[] }[] = [];
  let cur: { heading: string | null; lines: string[] } = { heading: null, lines: [] };

  md.split('\n').forEach((line) => {
    if (line.startsWith('### ')) {
      sections.push(cur);
      cur = { heading: line.slice(4), lines: [] };
    } else {
      cur.lines.push(line);
    }
  });
  sections.push(cur);

  return (
    <>
      {sections.map((s, i) => {
        const body = <Nodes nodes={parseBody(s.lines)} />;
        if (!s.heading) return <div key={i}>{body}</div>;
        if (s.heading.toLowerCase() === 'tutor insider tip') {
          return (
            <div key={i} className="my-3 rounded-xl border border-[var(--accent-b)]/30 bg-[var(--accent-b)]/8 p-4">
              <div className="text-[11px] font-bold tracking-widest text-[var(--accent-c)] mb-1.5 uppercase">
                Tutor insider tip
              </div>
              {body}
            </div>
          );
        }
        return (
          <div key={i} className="mt-4">
            <h4 className="text-sm font-semibold text-[var(--text)] mb-1">{s.heading}</h4>
            {body}
          </div>
        );
      })}
    </>
  );
};
