import React from 'react';

export interface FigureData {
  headers: string[];
  rows: string[][];
}

export interface TipsFigureBlock {
  id: string;
  type: 'figure';
  chart_type: 'line' | 'grouped_bar' | 'pie_pair' | 'table_only' | 'mixed' | 'process' | 'map_before_after';
  title: string;
  caption: string;
  data: FigureData;
  notes?: string;
}

const SERIES_COLORS = ['var(--accent-a)', 'var(--accent-b)', 'var(--success, #22c55e)', 'var(--warning, #eab308)'];

const num = (s: string) => parseFloat(s.replace(/[^0-9.\-]/g, '')) || 0;

// ---------------------------------------------------------------------
// Line chart — first column is the x-axis (year), remaining are series
// ---------------------------------------------------------------------
const LineChartSVG: React.FC<{ data: FigureData }> = ({ data }) => {
  const { headers, rows } = data;
  const seriesNames = headers.slice(1);
  const W = 640, H = 260, PAD = 40;
  const xs = rows.map((r) => r[0]);
  const allVals = rows.flatMap((r) => r.slice(1).map(num));
  const maxV = Math.max(...allVals, 1);
  const xStep = (W - PAD * 2) / Math.max(xs.length - 1, 1);

  const pointsFor = (colIdx: number) =>
    rows.map((r, i) => {
      const x = PAD + i * xStep;
      const y = H - PAD - (num(r[colIdx]) / maxV) * (H - PAD * 2);
      return `${x},${y}`;
    });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Line chart">
      <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="var(--border)" strokeWidth="1" />
      <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="var(--border)" strokeWidth="1" />
      {xs.map((x, i) => (
        <text key={x} x={PAD + i * xStep} y={H - PAD + 16} fontSize="10" textAnchor="middle" fill="var(--text-dim)">
          {x}
        </text>
      ))}
      {seriesNames.map((name, si) => (
        <g key={name}>
          <polyline
            fill="none"
            stroke={SERIES_COLORS[si % SERIES_COLORS.length]}
            strokeWidth="2.5"
            points={pointsFor(si + 1).join(' ')}
          />
          {pointsFor(si + 1).map((pt, pi) => {
            const [x, y] = pt.split(',');
            return <circle key={pi} cx={x} cy={y} r="3" fill={SERIES_COLORS[si % SERIES_COLORS.length]} />;
          })}
        </g>
      ))}
      {seriesNames.map((name, si) => (
        <g key={name} transform={`translate(${PAD + si * 120}, 14)`}>
          <rect width="10" height="10" rx="2" fill={SERIES_COLORS[si % SERIES_COLORS.length]} />
          <text x="14" y="9" fontSize="10" fill="var(--text)">{name}</text>
        </g>
      ))}
    </svg>
  );
};

// ---------------------------------------------------------------------
// Grouped bar chart — first column is category, remaining are groups
// ---------------------------------------------------------------------
const GroupedBarSVG: React.FC<{ data: FigureData }> = ({ data }) => {
  const { headers, rows } = data;
  const groupNames = headers.slice(1);
  const W = 640, H = 260, PAD = 40;
  const allVals = rows.flatMap((r) => r.slice(1).map(num));
  const maxV = Math.max(...allVals, 1);
  const bandW = (W - PAD * 2) / rows.length;
  const barW = (bandW - 10) / groupNames.length;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Grouped bar chart">
      <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="var(--border)" strokeWidth="1" />
      {rows.map((row, ri) => (
        <g key={row[0]}>
          {groupNames.map((g, gi) => {
            const v = num(row[gi + 1]);
            const barH = (v / maxV) * (H - PAD * 2);
            const x = PAD + ri * bandW + gi * barW + 5;
            const y = H - PAD - barH;
            return (
              <rect key={g} x={x} y={y} width={barW - 3} height={barH} fill={SERIES_COLORS[gi % SERIES_COLORS.length]} rx="2" />
            );
          })}
          <text x={PAD + ri * bandW + bandW / 2} y={H - PAD + 16} fontSize="10" textAnchor="middle" fill="var(--text-dim)">
            {row[0]}
          </text>
        </g>
      ))}
      {groupNames.map((name, gi) => (
        <g key={name} transform={`translate(${PAD + gi * 110}, 14)`}>
          <rect width="10" height="10" rx="2" fill={SERIES_COLORS[gi % SERIES_COLORS.length]} />
          <text x="14" y="9" fontSize="10" fill="var(--text)">{name}</text>
        </g>
      ))}
    </svg>
  );
};

// ---------------------------------------------------------------------
// Two pie charts side by side — rows are categories, cols are the two pies
// ---------------------------------------------------------------------
const Pie: React.FC<{ label: string; rows: string[][]; colIdx: number; cx: number }> = ({ label, rows, colIdx, cx }) => {
  const total = rows.reduce((s, r) => s + num(r[colIdx]), 0) || 1;
  let acc = 0;
  const R = 60, CY = 90;
  const slices = rows.map((r, i) => {
    const v = num(r[colIdx]);
    const start = (acc / total) * Math.PI * 2;
    acc += v;
    const end = (acc / total) * Math.PI * 2;
    const large = end - start > Math.PI ? 1 : 0;
    const x1 = cx + R * Math.sin(start), y1 = CY - R * Math.cos(start);
    const x2 = cx + R * Math.sin(end), y2 = CY - R * Math.cos(end);
    return (
      <path
        key={r[0]}
        d={`M ${cx} ${CY} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} Z`}
        fill={SERIES_COLORS[i % SERIES_COLORS.length]}
        stroke="var(--bg-elevated)"
        strokeWidth="1.5"
      />
    );
  });
  return (
    <g>
      {slices}
      <text x={cx} y={CY + R + 22} fontSize="11" textAnchor="middle" fill="var(--text)" fontWeight={600}>{label}</text>
    </g>
  );
};

const PiePairSVG: React.FC<{ data: FigureData }> = ({ data }) => {
  const { headers, rows } = data;
  const W = 420, H = 210;
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-md mx-auto h-auto" role="img" aria-label="Two pie charts">
        <Pie label={headers[1]} rows={rows} colIdx={1} cx={110} />
        <Pie label={headers[2]} rows={rows} colIdx={2} cx={310} />
      </svg>
      <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center mt-1">
        {rows.map((r, i) => (
          <div key={r[0]} className="flex items-center gap-1.5 text-[11px] text-[var(--text-dim)]">
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: SERIES_COLORS[i % SERIES_COLORS.length] }} />
            {r[0]}
          </div>
        ))}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------
// Mixed bar + line chart, dual axis (second series scaled independently)
// ---------------------------------------------------------------------
const MixedSVG: React.FC<{ data: FigureData }> = ({ data }) => {
  const { headers, rows } = data;
  const W = 640, H = 260, PAD = 40;
  const barVals = rows.map((r) => num(r[1]));
  const lineVals = rows.map((r) => num(r[2]));
  const maxBar = Math.max(...barVals, 1);
  const maxLine = Math.max(...lineVals, 1);
  const bandW = (W - PAD * 2) / rows.length;

  const linePoints = rows.map((r, i) => {
    const x = PAD + i * bandW + bandW / 2;
    const y = H - PAD - (num(r[2]) / maxLine) * (H - PAD * 2);
    return `${x},${y}`;
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Combined bar and line chart">
      <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="var(--border)" strokeWidth="1" />
      {rows.map((row, i) => {
        const v = num(row[1]);
        const barH = (v / maxBar) * (H - PAD * 2);
        const x = PAD + i * bandW + bandW * 0.25;
        const y = H - PAD - barH;
        return <rect key={row[0]} x={x} y={y} width={bandW * 0.5} height={barH} fill="var(--accent-a)" rx="2" opacity={0.85} />;
      })}
      <polyline fill="none" stroke="var(--accent-b)" strokeWidth="2.5" points={linePoints.join(' ')} />
      {linePoints.map((pt, i) => {
        const [x, y] = pt.split(',');
        return <circle key={i} cx={x} cy={y} r="3.5" fill="var(--accent-b)" />;
      })}
      {rows.map((row, i) => (
        <text key={row[0]} x={PAD + i * bandW + bandW / 2} y={H - PAD + 16} fontSize="10" textAnchor="middle" fill="var(--text-dim)">
          {row[0]}
        </text>
      ))}
      <g transform={`translate(${PAD}, 14)`}>
        <rect width="10" height="10" rx="2" fill="var(--accent-a)" />
        <text x="14" y="9" fontSize="10" fill="var(--text)">{headers[1]}</text>
      </g>
      <g transform={`translate(${PAD + 160}, 14)`}>
        <rect width="10" height="10" rx="2" fill="var(--accent-b)" />
        <text x="14" y="9" fontSize="10" fill="var(--text)">{headers[2]}</text>
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------------
// Process diagram — boxes with arrows
// ---------------------------------------------------------------------
const ProcessSVG: React.FC<{ data: FigureData }> = ({ data }) => {
  const stages = data.rows.map((r) => r[1]);
  return (
    <div className="flex flex-wrap items-center gap-2 justify-center py-2">
      {stages.map((s, i) => (
        <React.Fragment key={i}>
          <div className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--panel-2)] text-[11px] text-[var(--text)] text-center max-w-[110px]">
            {s}
          </div>
          {i < stages.length - 1 && <span className="text-[var(--text-dim)] text-sm">→</span>}
        </React.Fragment>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------
// Before/after map — two-column comparison
// ---------------------------------------------------------------------
const MapBeforeAfterSVG: React.FC<{ data: FigureData }> = ({ data }) => {
  const { headers, rows } = data;
  return (
    <div className="grid grid-cols-2 gap-3">
      {[0, 1].map((colIdx) => (
        <div key={colIdx} className="rounded-lg border border-[var(--border)] bg-[var(--panel-2)] p-3">
          <div className="text-[11px] font-semibold text-[var(--text)] mb-2 text-center">{headers[colIdx]}</div>
          <ul className="space-y-1">
            {rows.map((r) => (
              <li key={r[0]} className="text-[11px] text-[var(--text-dim)]">{r[colIdx]}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

const SimpleTable: React.FC<{ data: FigureData }> = ({ data }) => (
  <table className="w-full text-xs border-collapse">
    <thead>
      <tr>
        {data.headers.map((h) => (
          <th key={h} className="text-left px-2 py-1.5 border-b border-[var(--border)] text-[var(--text-dim)] font-medium">{h}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.rows.map((r, i) => (
        <tr key={i}>
          {r.map((c, ci) => (
            <td key={ci} className="px-2 py-1.5 border-b border-[var(--border)]/50 text-[var(--text)]">{c}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export const TipsFigure: React.FC<{ block: TipsFigureBlock }> = ({ block }) => {
  return (
    <figure className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]/50 p-4 my-2">
      <figcaption className="text-xs font-semibold text-[var(--text)] mb-3">{block.title}</figcaption>
      <div className="mb-3">
        {block.chart_type === 'line' && <LineChartSVG data={block.data} />}
        {block.chart_type === 'grouped_bar' && <GroupedBarSVG data={block.data} />}
        {block.chart_type === 'pie_pair' && <PiePairSVG data={block.data} />}
        {block.chart_type === 'mixed' && <MixedSVG data={block.data} />}
        {block.chart_type === 'process' && <ProcessSVG data={block.data} />}
        {block.chart_type === 'map_before_after' && <MapBeforeAfterSVG data={block.data} />}
        {block.chart_type === 'table_only' && <SimpleTable data={block.data} />}
      </div>
      {block.chart_type !== 'table_only' && (
        <details className="text-[11px] text-[var(--text-dim)]">
          <summary className="cursor-pointer select-none">Show data table</summary>
          <div className="mt-2 overflow-x-auto"><SimpleTable data={block.data} /></div>
        </details>
      )}
      <p className="text-[11px] text-[var(--text-dim)] italic mt-2">{block.caption}</p>
    </figure>
  );
};
