import { useState } from "react";
import { motion } from "motion/react";
import type { PlanDistributionItem } from "../../types/dashboard.types";

interface PlanDistributionChartProps {
  data: PlanDistributionItem[];
  className?: string;
}

const PLAN_COLORS = [
  "#6366f1", // Indigo
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#06b6d4", // Cyan
  "#ec4899", // Pink
  "#8b5cf6", // Purple
];

export const PlanDistributionChart = ({
  data = [],
  className = "",
}: PlanDistributionChartProps) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const totalMembers = data.reduce((acc, curr) => acc + curr.count, 0);

  // SVG coordinate configuration
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const segments = data.reduce<
    Array<
      PlanDistributionItem & {
        color: string;
        strokeDasharray: string;
        strokeDashoffset: number;
        percentVal: number;
        accumulated: number;
      }
    >
  >((acc, item, index) => {
    const percent = totalMembers > 0 ? item.count / totalMembers : 0;
    const prevAccumulated = acc.length > 0 ? acc[acc.length - 1].accumulated : 0;
    const strokeDasharray = `${percent * circumference} ${circumference}`;
    const strokeDashoffset = -prevAccumulated * circumference;
    const color = PLAN_COLORS[index % PLAN_COLORS.length];
    acc.push({
      ...item,
      color,
      strokeDasharray,
      strokeDashoffset,
      percentVal: Math.round(percent * 100),
      accumulated: prevAccumulated + percent,
    });
    return acc;
  }, []);

  const activeSegment = hoveredIdx !== null ? segments[hoveredIdx] : null;

  return (
    <div className={`w-full select-none ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Membership Plan Share
          </span>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Distribution of active plan subscriptions
          </p>
        </div>
        <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
          {totalMembers} Enrolled
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
        {/* Donut graphic with center text */}
        <div className="relative shrink-0 flex items-center justify-center">
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="-rotate-90 overflow-visible"
          >
            {/* Background track circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="currentColor"
              className="text-slate-100 dark:text-slate-800/80"
              strokeWidth={strokeWidth}
            />

            {/* Segments */}
            {segments.map((seg, i) => (
              <motion.circle
                key={seg.planId || i}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={seg.color}
                strokeWidth={hoveredIdx === i ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={seg.strokeDasharray}
                strokeDashoffset={seg.strokeDashoffset}
                strokeLinecap="round"
                className="cursor-pointer transition-all duration-200"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: seg.strokeDashoffset }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            ))}
          </svg>

          {/* Center Callout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
            {activeSegment ? (
              <motion.div
                key={activeSegment.planId}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.15 }}
              >
                <span className="text-xl font-black text-slate-900 dark:text-slate-100 font-mono">
                  {activeSegment.percentVal}%
                </span>
                <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 truncate max-w-[90px]">
                  {activeSegment.planName}
                </p>
              </motion.div>
            ) : (
              <div>
                <span className="text-2xl font-black text-slate-800 dark:text-slate-100 font-mono">
                  {totalMembers}
                </span>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Members
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Legend listing */}
        <div className="flex-1 w-full space-y-2">
          {segments.slice(0, 5).map((seg, i) => {
            const isHovered = hoveredIdx === i;
            return (
              <div
                key={seg.planId || i}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`flex items-center justify-between p-2 rounded-xl transition-colors cursor-pointer border ${
                  isHovered
                    ? "bg-slate-100/90 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 shadow-xs"
                    : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 ring-2 ring-white dark:ring-slate-900"
                    style={{ backgroundColor: seg.color }}
                  />
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {seg.planName}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">
                      {seg.durationMonths} {seg.durationMonths === 1 ? "month" : "months"} • ₹{seg.price}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono">
                    {seg.count}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-1 font-mono">
                    ({seg.percentVal}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlanDistributionChart;
