import Container from "@/shared/components/ui/containers/Container";
import { LuTrendingUp, LuDumbbell, LuFlame, LuLayers } from "react-icons/lu";

export interface WorkoutSummaryCardProps {
  activeDay: string;
  focus?: string;
  exercisesCount: number;
  totalSets: number;
}

const WorkoutSummaryCard = ({
  focus,
  totalSets,
  activeDay,
  exercisesCount,
}: WorkoutSummaryCardProps) => {
  return (
    <Container
      variant="none"
      className="flex-col p-6! bg-slate-900 dark:bg-slate-900/95 border border-slate-800 dark:border-white/10 shadow-xl shadow-slate-900/20 dark:shadow-2xl dark:shadow-black/60 backdrop-blur-xl gap-3"
    >
      <div className="flex justify-between items-center w-full">
        <div className="flex gap-2 items-center">
          <LuTrendingUp className="w-5 h-5 font-bold text-primary" />
          <span className="capitalize text-white font-semibold">
            {activeDay}'s Summary
          </span>
        </div>
        <div className="uppercase text-[10px] font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 p-1 rounded-md px-2">
          Routine Overview
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {/* Daily Focus */}
        <div className="bg-slate-800/60 dark:bg-slate-800/40 border border-slate-700/50 dark:border-white/5 w-full rounded-2xl p-4">
          <div className="text-xs flex gap-1.5 items-center">
            <LuDumbbell className="w-3.5 h-3.5 text-indigo-400" />
            <span className="capitalize text-slate-300 font-medium">
              Daily Focus
            </span>
          </div>
          <div className="mt-1.5">
            <span className="text-sm font-extrabold text-white tracking-tight line-clamp-2">
              {focus || "Rest & Recovery"}
            </span>
          </div>
        </div>

        {/* Total Exercises & Total Sets */}
        <div className="flex justify-between gap-3">
          <div className="bg-slate-800/60 dark:bg-slate-800/40 border border-slate-700/50 dark:border-white/5 w-full rounded-2xl p-4">
            <div className="text-xs flex gap-1.5 items-center">
              <LuFlame className="w-3.5 h-3.5 text-orange-400" />
              <span className="capitalize text-slate-300 font-medium">
                Exercises
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="text-2xl font-extrabold text-white tracking-tight">
                {exercisesCount}
              </span>
              <span className="text-xs font-bold text-slate-400">total</span>
            </div>
          </div>

          <div className="bg-slate-800/60 dark:bg-slate-800/40 border border-slate-700/50 dark:border-white/5 w-full rounded-2xl p-4">
            <div className="text-xs flex gap-1.5 items-center">
              <LuLayers className="w-3.5 h-3.5 text-emerald-400" />
              <span className="capitalize text-slate-300 font-medium">
                Total Sets
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="text-2xl font-extrabold text-white tracking-tight">
                {totalSets}
              </span>
              <span className="text-xs font-bold text-slate-400">sets</span>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default WorkoutSummaryCard;
