import { useNavigate } from "react-router-dom";
import { LuUsers, LuDumbbell, LuUtensils, LuAward } from "react-icons/lu";
import Container from "@/shared/components/ui/containers/Container";
import type { Demographics, PlansOverview } from "../../types/dashboard.types";

interface DemographicsAndPlansWidgetProps {
  demographics: Demographics;
  plansOverview: PlansOverview;
  className?: string;
}

export const DemographicsAndPlansWidget = ({
  demographics,
  plansOverview,
  className = "",
}: DemographicsAndPlansWidgetProps) => {
  const navigate = useNavigate();

  const total = demographics.total || 1;
  const malePct = Math.round((demographics.male / total) * 100);
  const femalePct = Math.round((demographics.female / total) * 100);
  const otherPct = Math.max(100 - malePct - femalePct, 0);

  return (
    <Container
      variant="secondary"
      className={`w-full! max-w-none! mx-0! p-4! sm:p-5! rounded-2xl! flex-col justify-between ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 border border-indigo-500/20">
            <LuUsers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Demographics & Program Catalog
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Community breakdown & active training blueprints
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-4 flex-1">
        {/* Gender Breakdown */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Member Gender Ratio
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
              {demographics.total} Total Members
            </span>
          </div>

          {/* Segmented Progress Bar */}
          <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex shadow-inner">
            <div
              style={{ width: `${malePct}%` }}
              className="bg-indigo-600 dark:bg-indigo-500 transition-all duration-500"
              title={`Male: ${demographics.male} (${malePct}%)`}
            />
            <div
              style={{ width: `${femalePct}%` }}
              className="bg-pink-500 dark:bg-pink-400 transition-all duration-500"
              title={`Female: ${demographics.female} (${femalePct}%)`}
            />
            {otherPct > 0 && (
              <div
                style={{ width: `${otherPct}%` }}
                className="bg-cyan-500 dark:bg-cyan-400 transition-all duration-500"
                title={`Other: ${demographics.other} (${otherPct}%)`}
              />
            )}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-[11px] mt-2 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              <span className="text-slate-600 dark:text-slate-400">
                Male: <strong className="text-slate-800 dark:text-slate-200">{demographics.male}</strong> ({malePct}%)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-pink-500" />
              <span className="text-slate-600 dark:text-slate-400">
                Female: <strong className="text-slate-800 dark:text-slate-200">{demographics.female}</strong> ({femalePct}%)
              </span>
            </div>
            {demographics.other > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                <span className="text-slate-600 dark:text-slate-400">
                  Other: <strong className="text-slate-800 dark:text-slate-200">{demographics.other}</strong>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Blueprint Catalog Counts */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
          <div
            onClick={() => navigate("/workout-plan/list")}
            className="p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-800/60 transition-all cursor-pointer group text-center"
          >
            <div className="w-7 h-7 mx-auto rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-1">
              <LuDumbbell className="w-3.5 h-3.5" />
            </div>
            <p className="text-base font-black text-slate-800 dark:text-slate-100 font-mono">
              {plansOverview.totalWorkoutPlans}
            </p>
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Workout Plans
            </p>
          </div>

          <div
            onClick={() => navigate("/diet-plan/list")}
            className="p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-800/60 transition-all cursor-pointer group text-center"
          >
            <div className="w-7 h-7 mx-auto rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-1">
              <LuUtensils className="w-3.5 h-3.5" />
            </div>
            <p className="text-base font-black text-slate-800 dark:text-slate-100 font-mono">
              {plansOverview.totalDietPlans}
            </p>
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
              Diet Plans
            </p>
          </div>

          <div
            onClick={() => navigate("/membership-plan/list")}
            className="p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-800/60 transition-all cursor-pointer group text-center"
          >
            <div className="w-7 h-7 mx-auto rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-1">
              <LuAward className="w-3.5 h-3.5" />
            </div>
            <p className="text-base font-black text-slate-800 dark:text-slate-100 font-mono">
              {plansOverview.totalMembershipPlans}
            </p>
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Membership Tiers
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default DemographicsAndPlansWidget;
