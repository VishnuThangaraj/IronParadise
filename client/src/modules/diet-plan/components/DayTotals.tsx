import {
  LuFlame,
  LuApple,
  LuScale,
  LuInfo,
  LuTrendingUp,
} from "react-icons/lu";

import Container from "@/shared/components/ui/containers/Container";
import { WeekDay } from "@/shared/components/ui/date/constants/week-days";
import type { MacroTotals } from "../types/diet-plan.types";

export interface DayTotalsProps {
  activeDay: WeekDay;
  totals: MacroTotals;
}

const DayTotals = ({ activeDay, totals }: DayTotalsProps) => {
  return (
    <Container
      variant="none"
      className="flex-col p-6! bg-slate-900 dark:bg-slate-900/95 border border-slate-800 dark:border-white/10 shadow-xl shadow-slate-900/20 dark:shadow-2xl dark:shadow-black/60 backdrop-blur-xl gap-3"
    >
      <div className="flex justify-between items-center w-full">
        <div className="flex gap-2 items-center">
          <LuTrendingUp className="w-5 h-5 font-bold text-primary" />
          <span className="capitalize text-white font-semibold">
            {activeDay}'s Totals
          </span>
        </div>
        <div className="uppercase text-[10px] font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 p-1 rounded-md px-2">
          Live macro count
        </div>
      </div>

      {/* macros */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between gap-3">
          <div className="bg-slate-800/60 dark:bg-slate-800/40 border border-slate-700/50 dark:border-white/5 w-full rounded-2xl p-4">
            <div className="text-xs flex gap-1.5 items-center">
              <LuFlame className="w-3.5 h-3.5 text-orange-400" />
              <span className="capitalize text-slate-300 font-medium">Calories</span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="text-2xl font-extrabold text-white tracking-tight">
                {totals.calories}
              </span>
              <span className="text-xs font-bold text-slate-400">kcal</span>
            </div>
          </div>
          <div className="bg-slate-800/60 dark:bg-slate-800/40 border border-slate-700/50 dark:border-white/5 w-full rounded-2xl p-4">
            <div className="text-xs flex gap-1.5 items-center">
              <LuApple className="w-3.5 h-3.5 text-emerald-400" />
              <span className="capitalize text-slate-300 font-medium">Protein</span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="text-2xl font-extrabold text-white tracking-tight">
                {totals.protein}
              </span>
              <span className="text-xs font-bold text-slate-400">g</span>
            </div>
          </div>
        </div>
        <div className="flex justify-between gap-3">
          <div className="bg-slate-800/60 dark:bg-slate-800/40 border border-slate-700/50 dark:border-white/5 w-full rounded-2xl p-4">
            <div className="text-xs flex gap-1.5 items-center">
              <LuScale className="w-3.5 h-3.5 text-amber-400" />
              <span className="capitalize text-slate-300 font-medium">Carbs</span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="text-2xl font-extrabold text-white tracking-tight">
                {totals.carbs}
              </span>
              <span className="text-xs font-bold text-slate-400">g</span>
            </div>
          </div>
          <div className="bg-slate-800/60 dark:bg-slate-800/40 border border-slate-700/50 dark:border-white/5 w-full rounded-2xl p-4">
            <div className="text-xs flex gap-1.5 items-center">
              <LuInfo className="w-3.5 h-3.5 text-rose-400" />
              <span className="capitalize text-slate-300 font-medium">Fats</span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="text-2xl font-extrabold text-white tracking-tight">
                {totals.fat}
              </span>
              <span className="text-xs font-bold text-slate-400">g</span>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default DayTotals;
