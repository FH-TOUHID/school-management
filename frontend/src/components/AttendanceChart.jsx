import { useMemo, useState } from 'react';
import { monthlyAttendance, weeklyAttendance } from '../data/mockData';

const bounds = { left: 53, right: 654, top: 24, bottom: 192 };
const yFor = (value) => bounds.bottom - ((value - 80) / 20) * (bounds.bottom - bounds.top);

export default function AttendanceChart() {
  const [range, setRange] = useState('week');
  const series = range === 'week' ? weeklyAttendance : monthlyAttendance;
  const coords = useMemo(() => series.map((entry, index) => ({
    x: bounds.left + (index / (series.length - 1)) * (bounds.right - bounds.left),
    y: yFor(entry.value),
    ...entry,
  })), [series]);
  const line = coords.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const area = `${line} L ${coords.at(-1).x} ${bounds.bottom} L ${coords[0].x} ${bounds.bottom} Z`;
  const average = (series.reduce((sum, item) => sum + item.value, 0) / series.length).toFixed(1);

  return (
    <section className="rounded-[22px] border border-[#E4E4E7] bg-white p-5 sm:p-6" aria-label="Attendance trend sample chart">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">Performance</p>
          <h2 className="mt-1.5 text-lg font-extrabold tracking-[-0.35px]">Attendance trend</h2>
          <p className="mt-1 text-xs text-zinc-500">An overview of student presence</p>
        </div>
        <div className="flex rounded-[11px] bg-[#F4F4F5] p-1" role="group" aria-label="Chart time range">
          {[['week', 'Weekly'], ['month', 'Monthly']].map(([id, label]) => (
            <button key={id} type="button" onClick={() => setRange(id)} aria-pressed={range === id}
              className={`rounded-lg px-3.5 py-2 text-[11px] font-bold transition-all ${range === id ? 'bg-[#18181B] text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-end gap-3">
        <span className="text-[31px] font-extrabold leading-none tracking-[-1.2px]">{average}%</span>
        <span className="mb-0.5 rounded-full bg-[#F7FEE7] px-2.5 py-1 text-[11px] font-bold text-[#4D7C0F]">Sample average</span>
      </div>
      <div className="mt-3 w-full overflow-hidden">
        <svg viewBox="0 0 700 240" role="img" aria-label={`Demo attendance ${range === 'week' ? 'this week' : 'this month'}: ${series.map((i) => `${i.label} ${i.value}%`).join(', ')}`} className="h-auto min-h-[180px] w-full">
          <defs>
            <linearGradient id="attendanceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A3E635" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#A3E635" stopOpacity="0.015" />
            </linearGradient>
          </defs>
          {[80, 85, 90, 95, 100].map((v) => (
            <g key={v}>
              <line x1={bounds.left} y1={yFor(v)} x2={bounds.right} y2={yFor(v)} stroke="#E4E4E7" strokeDasharray="4 7" strokeWidth="1" />
              <text x="35" y={yFor(v) + 4} textAnchor="end" fontSize="11" fill="#A1A1AA">{v}%</text>
            </g>
          ))}
          <path d={area} fill="url(#attendanceFill)" />
          <path d={line} fill="none" stroke="#84CC16" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          {coords.map((point) => (
            <g key={point.label}>
              <circle cx={point.x} cy={point.y} r="6" fill="#FFFFFF" stroke="#84CC16" strokeWidth="3" />
              <text x={point.x} y="223" textAnchor="middle" fontSize="11" fontWeight="600" fill="#71717A">{point.label}</text>
            </g>
          ))}
        </svg>
      </div>
      <p className="mt-1 text-[11px] text-zinc-400">Demo data · Scale starts at 80% for clearer trends</p>
    </section>
  );
}
