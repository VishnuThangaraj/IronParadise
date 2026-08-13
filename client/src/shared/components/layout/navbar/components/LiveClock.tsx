import { LuClock, LuCalendar } from "react-icons/lu";

export interface LiveClockProps {
  timeString: string;
  dateString: string;
}

const LiveClock = ({ timeString, dateString }: LiveClockProps) => {
  if (!timeString && !dateString) return null;

  return (
    <div className="hidden sm:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-xs">
      <div className="flex items-center gap-1.5">
        <LuClock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
        <span className="tabular-nums">{timeString}</span>
      </div>

      <div className="w-px h-3.5 bg-slate-300 dark:bg-slate-700" />

      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
        <LuCalendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
        <span>{dateString}</span>
      </div>
    </div>
  );
};

export default LiveClock;
