import { useNavigate } from "react-router-dom";
import {
  LuUserPlus,
  LuCalendarCheck2,
  LuDumbbell,
  LuCirclePlus,
  LuUtensils,
  LuCreditCard,
  LuShieldCheck,
  LuSparkles,
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
      color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white",
      border: "hover:border-indigo-500/40",
    },
    {
      label: "Attendance Kiosk",
      desc: "Open live check-in scanner",
      icon: LuCalendarCheck2,
      path: "/attendance-kiosk",
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white",
      border: "hover:border-emerald-500/40",
    },
    {
      label: "New Workout Plan",
      desc: "Build muscle & strength splits",
      icon: LuDumbbell,
      path: "/workout-plan/add",
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-600 group-hover:text-white",
      border: "hover:border-amber-500/40",
    },
    {
      label: "New Diet Plan",
      desc: "Structure macro & meal regimens",
      icon: LuUtensils,
      path: "/diet-plan/add",
      color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 group-hover:bg-cyan-600 group-hover:text-white",
      border: "hover:border-cyan-500/40",
    },
    {
      label: "Add Trainer",
      desc: "Onboard certified coach",
      icon: LuShieldCheck,
      path: "/trainer/add",
      color: "bg-violet-500/10 text-violet-600 dark:text-violet-400 group-hover:bg-violet-600 group-hover:text-white",
      border: "hover:border-violet-500/40",
    },
    {
      label: "Record Payments",
      desc: "Collect dues & view payroll",
      icon: LuCreditCard,
      path: "/member/payments",
      color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 group-hover:bg-rose-600 group-hover:text-white",
      border: "hover:border-rose-500/40",
    },
    {
      label: "Create Event",
      desc: "Workshops & challenges",
      icon: LuCirclePlus,
      path: "/events",
      color: "bg-pink-500/10 text-pink-600 dark:text-pink-400 group-hover:bg-pink-600 group-hover:text-white",
      border: "hover:border-pink-500/40",
    },
  ];

  return (
    <Container
      variant="secondary"
      className={`w-full! max-w-none! mx-0! p-4! sm:p-5! rounded-2xl! flex-col justify-between ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 border border-indigo-500/20">
            <LuSparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Quick Operations
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Instant shortcuts to essential workflows
            </p>
          </div>
        </div>
      </div>

      {/* Grid of actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 mt-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.label}
              onClick={() => navigate(act.path)}
              className={`flex items-center gap-3 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-800/80 text-left transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer group ${act.border}`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${act.color}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {act.label}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                  {act.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </Container>
  );
};

export default QuickActionsWidget;
