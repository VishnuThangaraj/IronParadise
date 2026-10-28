import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { FinancialOverview } from "../../types/dashboard.types";

interface RevenueMetricsChartProps {
  financialOverview: FinancialOverview;
  className?: string;
}

export const RevenueMetricsChart = ({
  financialOverview,
  className = "",
}: RevenueMetricsChartProps) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const {
    totalCollected,
    totalDue,
    collectionRate,
    monthlyTrends = [],
  } = financialOverview;

  const width = 500;
  const height = 240;
  const paddingX = 40;
  const paddingTop = 25;
  const paddingBottom = 40;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingTop - paddingBottom;

  // Max value across collected and due
  const maxMonthlyVal = Math.max(
    ...monthlyTrends.map((m) => Math.max(m.collected, m.due)),
    1000,
  );

  const groupWidth = chartWidth / Math.max(monthlyTrends.length, 1);
  const barWidth = Math.min(groupWidth * 0.32, 22);

  const formatCurrency = (val: number) => {
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(1)}L`;
    }
    if (val >= 1000) {
      return `₹${(val / 1000).toFixed(1)}k`;
    }
    return `₹${val.toLocaleString()}`;
  };

  const gridTicks = [0, 0.33, 0.66, 1];

  const activeTrend = hoveredIdx !== null ? monthlyTrends[hoveredIdx] : null;

  return (
    <div className={`relative w-full select-none ${className}`}>
      {/* Header with collection rate metric */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            6-Month Revenue & Dues
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
              {formatCurrency(totalCollected)}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">collected</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs font-semibold text-rose-500 dark:text-rose-400 font-mono">
              {formatCurrency(totalDue)}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">pending</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-medium">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-300">Collected</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
            <span className="text-slate-600 dark:text-slate-300">Due</span>
          </div>
          <div className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 border border-emerald-500/20">
            {collectionRate}% efficiency
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative mt-2 w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
        >
          {/* Grid lines */}
          {gridTicks.map((ratio, i) => {
            const y = paddingTop + chartHeight * (1 - ratio);
            const val = Math.round(ratio * maxMonthlyVal);
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
                  x={paddingX - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  className="text-[9px] fill-slate-400 dark:fill-slate-500 font-mono font-medium"
                >
                  {formatCurrency(val)}
                </text>
              </g>
            );
          })}

          {/* Grouped Bars */}
          {monthlyTrends.map((trend, i) => {
            const groupCenter = paddingX + i * groupWidth + groupWidth / 2;
            const collectedHeight = (trend.collected / maxMonthlyVal) * chartHeight;
            const dueHeight = (trend.due / maxMonthlyVal) * chartHeight;

            const collectedX = groupCenter - barWidth - 1.5;
            const dueX = groupCenter + 1.5;

            const collectedY = paddingTop + chartHeight - collectedHeight;
            const dueY = paddingTop + chartHeight - dueHeight;

            const isHovered = hoveredIdx === i;

            return (
              <g key={i} className="cursor-pointer">
                {/* Background column highlight on hover */}
                {isHovered && (
                  <rect
                    x={groupCenter - groupWidth / 2}
                    y={paddingTop}
                    width={groupWidth}
                    height={chartHeight}
                    className="fill-slate-100/60 dark:fill-slate-800/40 rounded-lg"
                    rx="6"
                  />
                )}

                {/* Collected Bar (Emerald) */}
                <motion.rect
                  x={collectedX}
                  y={collectedY}
                  width={barWidth}
                  height={Math.max(collectedHeight, 2)}
                  rx="3.5"
                  fill="#10b981"
                  className="transition-opacity hover:opacity-90"
                  initial={{ height: 0, y: paddingTop + chartHeight }}
                  animate={{ height: Math.max(collectedHeight, 2), y: collectedY }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                />

                {/* Due Bar (Rose) */}
                <motion.rect
                  x={dueX}
                  y={dueY}
                  width={barWidth}
                  height={Math.max(dueHeight, 2)}
                  rx="3.5"
                  fill="#f43f5e"
                  className="transition-opacity hover:opacity-90"
                  initial={{ height: 0, y: paddingTop + chartHeight }}
                  animate={{ height: Math.max(dueHeight, 2), y: dueY }}
                  transition={{ duration: 0.6, delay: i * 0.05 + 0.02 }}
                />

                {/* X-axis Month Label */}
                <text
                  x={groupCenter}
                  y={height - 14}
                  textAnchor="middle"
                  className={`text-[10px] font-medium transition-colors ${
                    isHovered
                      ? "fill-indigo-600 dark:fill-indigo-400 font-bold"
                      : "fill-slate-500 dark:fill-slate-400"
                  }`}
                >
                  {trend.month}
                </text>

                {/* Full invisible trigger rect */}
                <rect
                  x={groupCenter - groupWidth / 2}
                  y={paddingTop}
                  width={groupWidth}
                  height={chartHeight + 25}
                  fill="transparent"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip */}
        <AnimatePresence>
          {activeTrend && hoveredIdx !== null && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              style={{
                left: `${((paddingX + hoveredIdx * groupWidth + groupWidth / 2) / width) * 100}%`,
                top: "10%",
              }}
              className="pointer-events-none absolute z-30 -translate-x-1/2"
            >
              <div className="rounded-xl border border-slate-200/80 bg-white/95 px-3 py-2 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 min-w-[140px]">
                <p className="text-[11px] font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-1 mb-1.5">
                  {activeTrend.month} Financials
                </p>
                <div className="space-y-1 text-[11px]">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Collected:
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      ₹{activeTrend.collected.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <span className="h-2 w-2 rounded-full bg-rose-500" />
                      Due:
                    </span>
                    <span className="font-semibold text-rose-600 dark:text-rose-400 font-mono">
                      ₹{activeTrend.due.toLocaleString()}
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

export default RevenueMetricsChart;
