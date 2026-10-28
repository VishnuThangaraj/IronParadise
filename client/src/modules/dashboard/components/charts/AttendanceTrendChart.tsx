import { useState, useId } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { AttendanceTrendPoint } from "../../types/dashboard.types";

interface AttendanceTrendChartProps {
  data: AttendanceTrendPoint[];
  className?: string;
}

export const AttendanceTrendChart = ({
  data,
  className = "",
}: AttendanceTrendChartProps) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const chartId = useId();

  if (!data || data.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-slate-400 dark:text-slate-500">
        No attendance data available
      </div>
    );
  }

  // Width & height of internal coordinate space
  const width = 600;
  const height = 240;
  const paddingX = 40;
  const paddingTop = 25;
  const paddingBottom = 40;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingTop - paddingBottom;

  // Maximum value for scaling (at least 10 for a good baseline)
  const maxValue = Math.max(
    ...data.map((d) => Math.max(d.total, d.members + d.trainers)),
    10,
  );

  // Compute (x, y) coordinates for each point
  const points = data.map((d, i) => {
    const x = paddingX + (i / Math.max(data.length - 1, 1)) * chartWidth;
    const yTotal = paddingTop + chartHeight - (d.total / maxValue) * chartHeight;
    const yMembers = paddingTop + chartHeight - (d.members / maxValue) * chartHeight;
    const yTrainers = paddingTop + chartHeight - (d.trainers / maxValue) * chartHeight;
    return { x, yTotal, yMembers, yTrainers, ...d };
  });

  // Helper to generate SVG path string for smooth cubic bezier curves
  const generateSmoothPath = (
    pts: Array<{ x: number; y: number }>,
    closeArea = false,
  ) => {
    if (pts.length === 0) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;

    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(i - 1, 0)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(i + 2, pts.length - 1)];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    if (closeArea) {
      d += ` L ${pts[pts.length - 1].x} ${paddingTop + chartHeight} L ${pts[0].x} ${paddingTop + chartHeight} Z`;
    }

    return d;
  };

  const totalPoints = points.map((p) => ({ x: p.x, y: p.yTotal }));
  const membersPoints = points.map((p) => ({ x: p.x, y: p.yMembers }));
  const trainersPoints = points.map((p) => ({ x: p.x, y: p.yTrainers }));

  const totalLinePath = generateSmoothPath(totalPoints, false);
  const totalAreaPath = generateSmoothPath(totalPoints, true);
  const membersLinePath = generateSmoothPath(membersPoints, false);
  const trainersLinePath = generateSmoothPath(trainersPoints, false);

  // Grid horizontal lines (4 tiers)
  const gridTicks = [0, 0.33, 0.66, 1];

  const activePoint = hoveredIdx !== null ? points[hoveredIdx] : null;

  return (
    <div className={`relative w-full select-none ${className}`}>
      {/* Legend & Stats header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              14-Day Attendance Trend
            </span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Daily check-in volume across members and trainers
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400 ring-2 ring-indigo-500/20" />
            <span className="text-slate-600 dark:text-slate-300">Total Check-ins</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
            <span className="text-slate-600 dark:text-slate-300">Members</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-500/20" />
            <span className="text-slate-600 dark:text-slate-300">Trainers</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative mt-2 w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
        >
          <defs>
            {/* Area gradient for Total */}
            <linearGradient id={`totalGradient-${chartId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.00" />
            </linearGradient>

            {/* Subtle glow filter */}
            <filter id={`glow-${chartId}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#6366f1" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Grid lines & Y-axis labels */}
          {gridTicks.map((ratio, i) => {
            const y = paddingTop + chartHeight * (1 - ratio);
            const val = Math.round(ratio * maxValue);
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="currentColor"
                  strokeDasharray="4 4"
                  className="text-slate-200 dark:text-slate-800"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 10}
                  y={y + 3.5}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 dark:fill-slate-500 font-mono font-medium"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Total Area Fill */}
          <motion.path
            d={totalAreaPath}
            fill={`url(#totalGradient-${chartId})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          />

          {/* Trainers Line (Amber) */}
          <motion.path
            d={trainersLinePath}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.75"
            strokeDasharray="3 3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          />

          {/* Members Line (Emerald) */}
          <motion.path
            d={membersLinePath}
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />

          {/* Total Check-ins Line (Indigo) with Glow */}
          <motion.path
            d={totalLinePath}
            fill="none"
            stroke="#6366f1"
            strokeWidth="2.75"
            filter={`url(#glow-${chartId})`}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
          />

          {/* X-axis date labels */}
          {points.map((p, i) => {
            // Show every 2nd or 3rd label on small viewports
            const showLabel = i % 2 === 0 || i === points.length - 1;
            if (!showLabel) return null;
            return (
              <text
                key={i}
                x={p.x}
                y={height - 12}
                textAnchor="middle"
                className="text-[10px] fill-slate-500 dark:fill-slate-400 font-medium"
              >
                {p.label}
              </text>
            );
          })}

          {/* Hover guideline and interactive dots */}
          {activePoint && (
            <g>
              <line
                x1={activePoint.x}
                y1={paddingTop}
                x2={activePoint.x}
                y2={paddingTop + chartHeight}
                stroke="#6366f1"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                className="opacity-70 dark:opacity-80"
              />
              {/* Dot for Total */}
              <circle
                cx={activePoint.x}
                cy={activePoint.yTotal}
                r="5"
                fill="#6366f1"
                stroke="#ffffff"
                strokeWidth="2"
                className="dark:stroke-slate-900"
              />
              {/* Dot for Members */}
              <circle
                cx={activePoint.x}
                cy={activePoint.yMembers}
                r="4"
                fill="#10b981"
                stroke="#ffffff"
                strokeWidth="2"
                className="dark:stroke-slate-900"
              />
              {/* Dot for Trainers */}
              <circle
                cx={activePoint.x}
                cy={activePoint.yTrainers}
                r="3.5"
                fill="#f59e0b"
                stroke="#ffffff"
                strokeWidth="1.5"
                className="dark:stroke-slate-900"
              />
            </g>
          )}

          {/* Invisible interactive hover rects */}
          {points.map((p, i) => {
            const barW = chartWidth / points.length;
            return (
              <rect
                key={i}
                x={p.x - barW / 2}
                y={paddingTop}
                width={barW}
                height={chartHeight}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
        </svg>

        {/* Dynamic Tooltip */}
        <AnimatePresence>
          {activePoint && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              style={{
                left: `${(activePoint.x / width) * 100}%`,
                top: `${(activePoint.yTotal / height) * 100}%`,
              }}
              className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-full pb-3"
            >
              <div className="rounded-xl border border-slate-200/80 bg-white/95 px-3 py-2 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 min-w-[130px]">
                <p className="text-[11px] font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-1 mb-1.5">
                  {activePoint.label} ({activePoint.date})
                </p>
                <div className="space-y-1 text-[11px]">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <span className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                      Total:
                    </span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                      {activePoint.total}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Members:
                    </span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                      {activePoint.members}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                      Trainers:
                    </span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400 font-mono">
                      {activePoint.trainers}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AttendanceTrendChart;
