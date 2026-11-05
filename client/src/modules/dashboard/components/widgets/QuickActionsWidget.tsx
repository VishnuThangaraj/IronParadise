import { useNavigate } from "react-router-dom";
import {
  LuUserPlus,
  LuCalendarCheck2,
  LuDumbbell,
  LuCirclePlus,
  LuUtensils,
  LuCreditCard,
  LuShieldCheck,
  LuAward,
  LuSlidersHorizontal,
  LuArrowUpRight,
} from "react-icons/lu";
import Container from "@/shared/components/ui/containers/Container";

interface QuickActionsWidgetProps {
  className?: string;
}

export const QuickActionsWidget = ({ className = "" }: QuickActionsWidgetProps) => {
  const navigate = useNavigate();

  const actions = [
    {
      label: "Add Member",
      desc: "Enroll new fitness client",
      icon: LuUserPlus,
      path: "/member/add",
    },
    {
      label: "Attendance Kiosk",
      desc: "Live check-in console",
      icon: LuCalendarCheck2,
      path: "/attendance-kiosk",
    },
    {
      label: "Add Trainer",
      desc: "Onboard coaching staff",
      icon: LuShieldCheck,
      path: "/trainer/add",
    },
    {
      label: "Record Payment",
      desc: "Collect dues & track fees",
      icon: LuCreditCard,
      path: "/member/payments",
    },
    {
      label: "New Workout Plan",
      desc: "Build training routine",
      icon: LuDumbbell,
      path: "/workout-plan/add",
    },
    {
      label: "New Diet Plan",
      desc: "Structure nutrition regimen",
      icon: LuUtensils,
      path: "/diet-plan/add",
    },
    {
      label: "Create Event",
      desc: "Workshops & challenges",
      icon: LuCirclePlus,
      path: "/events",
    },
    {
      label: "Membership Plans",
      desc: "Configure tiers & pricing",
      icon: LuAward,
      path: "/membership-plan/list",
    },
  ];

  return (
    <Container
      variant="secondary"
      className={`w-full! max-w-none! mx-0! p-4! sm:p-5! rounded-2xl! flex-col justify-between ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
            <LuSlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              Quick Operations
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Direct shortcuts to frequent management actions
            </p>
          </div>
        </div>
      </div>

      {/* Grid of actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 mt-3.5">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.label}
              onClick={() => navigate(act.path)}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 text-left transition-all duration-200 shadow-xs hover:shadow-sm cursor-pointer group active:scale-[0.99]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-center shrink-0 text-slate-600 dark:text-slate-300 transition-all duration-200 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 dark:group-hover:bg-indigo-500 dark:group-hover:border-indigo-500 shadow-xs">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {act.label}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {act.desc}
                  </p>
                </div>
              </div>

              <LuArrowUpRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2" />
            </button>
          );
        })}
      </div>
    </Container>
  );
};

export default QuickActionsWidget;
