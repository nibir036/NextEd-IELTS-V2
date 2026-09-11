import React from 'react';

/**
 * Parses a line of plain text into React nodes, handling:
 *   - **bold** -> <strong>
 *   - *italic* -> <em>
 *   - <u>underlined</u> -> <u>, for exercises that ask the reader to
 *     judge or correct a specific already-marked span of text
 *   - "curly quoted" spans -> highlighted, so worked-example dialogue
 *     and audio transcript snippets visually stand out from the
 *     surrounding explanation text instead of blending in.
 *
 * Safe no-op on plain text with none of these markers.
 */
export function parseInline(text: string): React.ReactNode[] {
  // First split on markdown bold/italic and <u> tags (adapted from the
  // same pattern the source content's own preview tool used), then
  // re-scan each plain-text fragment for curly-quoted spans.
  const markdownParts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|<u>[^<]+<\/u>)/g);

  const nodes: React.ReactNode[] = [];
  markdownParts.forEach((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      nodes.push(<strong key={`b${i}`}>{part.slice(2, -2)}</strong>);
      return;
    }
    if (part.startsWith('<u>') && part.endsWith('</u>')) {
      nodes.push(<u key={`u${i}`}>{part.slice(3, -4)}</u>);
      return;
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      nodes.push(<em key={`i${i}`}>{part.slice(1, -1)}</em>);
      return;
    }
    // Plain fragment: highlight any curly-quoted spans within it.
    const quoteSplit = part.split(/(\u201c[^\u201d]+\u201d)/g);
    quoteSplit.forEach((q, j) => {
      if (q.startsWith('\u201c') && q.endsWith('\u201d') && q.length > 2) {
        nodes.push(
          <span
            key={`q${i}-${j}`}
            className="text-[var(--accent-a)] italic font-medium"
          >
            {q}
          </span>,
        );
      } else if (q) {
        nodes.push(q);
      }
    });
  });

  return nodes;
}
