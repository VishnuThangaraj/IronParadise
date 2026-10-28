import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { PeakHourPoint } from "../../types/dashboard.types";

interface PeakHoursHeatmapProps {
  data: PeakHourPoint[];
  className?: string;
}

export const PeakHoursHeatmap = ({
  data = [],
  className = "",
}: PeakHoursHeatmapProps) => {
  const [hoveredHour, setHoveredHour] = useState<PeakHourPoint | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-slate-400 dark:text-slate-500">
        No peak hour data available
      </div>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count), 5);

  return (
    <div className={`w-full select-none ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Peak Gym Activity Hours
          </span>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Typical hourly check-in distribution (6 AM – 10 PM)
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
          <span className="w-2.5 h-2.5 rounded-xs bg-indigo-200 dark:bg-indigo-950" />
          <span>Low</span>
          <span className="w-2.5 h-2.5 rounded-xs bg-indigo-500" />
          <span>Medium</span>
          <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" />
          <span>Peak Rush</span>
        </div>
      </div>

      {/* Histogram bars container */}
      <div className="relative pt-6 pb-2">
        <div className="flex items-end justify-between gap-1 sm:gap-2 h-36 px-2">
          {data.map((item, idx) => {
            const heightPct = Math.max(Math.round((item.count / maxCount) * 100), 8);
            const isPeak = item.count >= maxCount * 0.75;
            const isMedium = item.count >= maxCount * 0.4 && !isPeak;

            const barColor = isPeak
              ? "bg-amber-500 dark:bg-amber-400 shadow-xs shadow-amber-500/30"
              : isMedium
              ? "bg-indigo-500 dark:bg-indigo-400"
              : "bg-indigo-200 dark:bg-slate-800";

            const isHovered = hoveredHour?.hour === item.hour;

            return (
              <div
                key={item.hour || idx}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                onMouseEnter={() => setHoveredHour(item)}
                onMouseLeave={() => setHoveredHour(null)}
              >
                {/* Bar */}
                <div className="w-full relative flex items-end justify-center h-full">
                  <motion.div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full max-w-[20px] rounded-t-md transition-all duration-200 ${barColor} ${
                      isHovered ? "ring-2 ring-indigo-600 dark:ring-indigo-300 scale-105" : ""
                    }`}
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPct}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.02 }}
                  />
                </div>

                {/* X-axis time label */}
                <span
                  className={`text-[9px] mt-2 font-medium tracking-tight truncate transition-colors ${
                    isHovered
                      ? "text-indigo-600 dark:text-indigo-400 font-bold"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {item.label.replace(" ", "")}
                </span>
              </div>
            );
          })}
        </div>

        {/* Floating Tooltip */}
        <AnimatePresence>
          {hoveredHour && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.12 }}
              className="absolute top-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
            >
              <div className="rounded-xl border border-slate-200/80 bg-white/95 px-3 py-1.5 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 text-center">
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100">
                  {hoveredHour.label}:
                </span>{" "}
                <span className="text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                  {hoveredHour.count} check-ins
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PeakHoursHeatmap;
