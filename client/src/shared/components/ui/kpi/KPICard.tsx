import { isValidElement, type ElementType, type ReactNode } from "react";
import { LuTrendingDown, LuTrendingUp } from "react-icons/lu";
import Container from "@/shared/components/ui/containers/Container";

export type KPIColorPreset =
  | "blue"
  | "indigo"
  | "green"
  | "emerald"
  | "orange"
  | "amber"
  | "red"
  | "rose"
  | "purple"
  | "violet"
  | "cyan"
  | "teal"
  | "pink"
  | "gray"
  | "slate";

export interface KPICardColorTheme {
  iconBg: string;
  iconText: string;
  borderHover: string;
  gradientGlow: string;
  badgeBg: string;
  badgeText: string;
}

export const KPI_COLOR_PRESETS: Record<KPIColorPreset, KPICardColorTheme> = {
  blue: {
    iconBg: "bg-blue-500/10 dark:bg-blue-500/20",
    iconText: "text-blue-600 dark:text-blue-400",
    borderHover: "hover:border-blue-500/40 dark:hover:border-blue-500/50",
    gradientGlow: "from-blue-500/15 via-blue-500/5 to-transparent",
    badgeBg:
      "bg-blue-50 dark:bg-blue-950/60 border-blue-200/70 dark:border-blue-800/50",
    badgeText: "text-blue-700 dark:text-blue-300",
  },
  indigo: {
    iconBg: "bg-indigo-500/10 dark:bg-indigo-500/20",
    iconText: "text-indigo-600 dark:text-indigo-400",
    borderHover: "hover:border-indigo-500/40 dark:hover:border-indigo-500/50",
    gradientGlow: "from-indigo-500/15 via-indigo-500/5 to-transparent",
    badgeBg:
      "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200/70 dark:border-indigo-800/50",
    badgeText: "text-indigo-700 dark:text-indigo-300",
  },
  green: {
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    iconText: "text-emerald-600 dark:text-emerald-400",
    borderHover:
      "hover:border-emerald-500/40 dark:hover:border-emerald-500/50",
    gradientGlow: "from-emerald-500/15 via-emerald-500/5 to-transparent",
    badgeBg:
      "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/70 dark:border-emerald-800/50",
    badgeText: "text-emerald-700 dark:text-emerald-300",
  },
  emerald: {
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    iconText: "text-emerald-600 dark:text-emerald-400",
    borderHover:
      "hover:border-emerald-500/40 dark:hover:border-emerald-500/50",
    gradientGlow: "from-emerald-500/15 via-emerald-500/5 to-transparent",
    badgeBg:
      "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/70 dark:border-emerald-800/50",
    badgeText: "text-emerald-700 dark:text-emerald-300",
  },
  orange: {
    iconBg: "bg-orange-500/10 dark:bg-orange-500/20",
    iconText: "text-orange-600 dark:text-orange-400",
    borderHover:
      "hover:border-orange-500/40 dark:hover:border-orange-500/50",
    gradientGlow: "from-orange-500/15 via-orange-500/5 to-transparent",
    badgeBg:
      "bg-orange-50 dark:bg-orange-950/60 border-orange-200/70 dark:border-orange-800/50",
    badgeText: "text-orange-700 dark:text-orange-300",
  },
  amber: {
    iconBg: "bg-amber-500/10 dark:bg-amber-500/20",
    iconText: "text-amber-600 dark:text-amber-400",
    borderHover: "hover:border-amber-500/40 dark:hover:border-amber-500/50",
    gradientGlow: "from-amber-500/15 via-amber-500/5 to-transparent",
    badgeBg:
      "bg-amber-50 dark:bg-amber-950/60 border-amber-200/70 dark:border-amber-800/50",
    badgeText: "text-amber-700 dark:text-amber-300",
  },
  red: {
    iconBg: "bg-red-500/10 dark:bg-red-500/20",
    iconText: "text-red-600 dark:text-red-400",
    borderHover: "hover:border-red-500/40 dark:hover:border-red-500/50",
    gradientGlow: "from-red-500/15 via-red-500/5 to-transparent",
    badgeBg:
      "bg-red-50 dark:bg-red-950/60 border-red-200/70 dark:border-red-800/50",
    badgeText: "text-red-700 dark:text-red-300",
  },
  rose: {
    iconBg: "bg-rose-500/10 dark:bg-rose-500/20",
    iconText: "text-rose-600 dark:text-rose-400",
    borderHover: "hover:border-rose-500/40 dark:hover:border-rose-500/50",
    gradientGlow: "from-rose-500/15 via-rose-500/5 to-transparent",
    badgeBg:
      "bg-rose-50 dark:bg-rose-950/60 border-rose-200/70 dark:border-rose-800/50",
    badgeText: "text-rose-700 dark:text-rose-300",
  },
  purple: {
    iconBg: "bg-purple-500/10 dark:bg-purple-500/20",
    iconText: "text-purple-600 dark:text-purple-400",
    borderHover:
      "hover:border-purple-500/40 dark:hover:border-purple-500/50",
    gradientGlow: "from-purple-500/15 via-purple-500/5 to-transparent",
    badgeBg:
      "bg-purple-50 dark:bg-purple-950/60 border-purple-200/70 dark:border-purple-800/50",
    badgeText: "text-purple-700 dark:text-purple-300",
  },
  violet: {
    iconBg: "bg-violet-500/10 dark:bg-violet-500/20",
    iconText: "text-violet-600 dark:text-violet-400",
    borderHover:
      "hover:border-violet-500/40 dark:hover:border-violet-500/50",
    gradientGlow: "from-violet-500/15 via-violet-500/5 to-transparent",
    badgeBg:
      "bg-violet-50 dark:bg-violet-950/60 border-violet-200/70 dark:border-violet-800/50",
    badgeText: "text-violet-700 dark:text-violet-300",
  },
  cyan: {
    iconBg: "bg-cyan-500/10 dark:bg-cyan-500/20",
    iconText: "text-cyan-600 dark:text-cyan-400",
    borderHover: "hover:border-cyan-500/40 dark:hover:border-cyan-500/50",
    gradientGlow: "from-cyan-500/15 via-cyan-500/5 to-transparent",
    badgeBg:
      "bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200/70 dark:border-cyan-800/50",
    badgeText: "text-cyan-700 dark:text-cyan-300",
  },
  teal: {
    iconBg: "bg-teal-500/10 dark:bg-teal-500/20",
    iconText: "text-teal-600 dark:text-teal-400",
    borderHover: "hover:border-teal-500/40 dark:hover:border-teal-500/50",
    gradientGlow: "from-teal-500/15 via-teal-500/5 to-transparent",
    badgeBg:
      "bg-teal-50 dark:bg-teal-950/60 border-teal-200/70 dark:border-teal-800/50",
    badgeText: "text-teal-700 dark:text-teal-300",
  },
  pink: {
    iconBg: "bg-pink-500/10 dark:bg-pink-500/20",
    iconText: "text-pink-600 dark:text-pink-400",
    borderHover: "hover:border-pink-500/40 dark:hover:border-pink-500/50",
    gradientGlow: "from-pink-500/15 via-pink-500/5 to-transparent",
    badgeBg:
      "bg-pink-50 dark:bg-pink-950/60 border-pink-200/70 dark:border-pink-800/50",
    badgeText: "text-pink-700 dark:text-pink-300",
  },
  gray: {
    iconBg: "bg-slate-500/10 dark:bg-slate-500/20",
    iconText: "text-slate-600 dark:text-slate-400",
    borderHover:
      "hover:border-slate-500/40 dark:hover:border-slate-500/50",
    gradientGlow: "from-slate-500/15 via-slate-500/5 to-transparent",
    badgeBg:
      "bg-slate-100 dark:bg-slate-800/60 border-slate-200/70 dark:border-slate-700/50",
    badgeText: "text-slate-700 dark:text-slate-300",
  },
  slate: {
    iconBg: "bg-slate-500/10 dark:bg-slate-500/20",
    iconText: "text-slate-600 dark:text-slate-400",
    borderHover:
      "hover:border-slate-500/40 dark:hover:border-slate-500/50",
    gradientGlow: "from-slate-500/15 via-slate-500/5 to-transparent",
    badgeBg:
      "bg-slate-100 dark:bg-slate-800/60 border-slate-200/70 dark:border-slate-700/50",
    badgeText: "text-slate-700 dark:text-slate-300",
  },
};

export interface KPICardProps {
  id?: string;
  title: string;
  value: ReactNode;
  subtitle?: ReactNode;
  change?: ReactNode;
  trend?: "up" | "down" | "neutral";
  icon?: ElementType | ReactNode;
  color?: KPIColorPreset;
  customColor?: Partial<KPICardColorTheme>;
  className?: string;
  onClick?: () => void;
}

export const KPICard = ({
  title,
  value,
  subtitle,
  change,
  trend = "neutral",
  icon,
  color = "indigo",
  customColor,
  className = "",
  onClick,
}: KPICardProps) => {
  const baseTheme = KPI_COLOR_PRESETS[color] || KPI_COLOR_PRESETS.indigo;
  const theme: KPICardColorTheme = {
    ...baseTheme,
    ...customColor,
  };

  const renderIcon = () => {
    if (!icon) return null;
    if (isValidElement(icon)) {
      return icon;
    }
    const IconComponent = icon as ElementType;
    return <IconComponent size={20} />;
  };

  return (
    <Container
      variant="secondary"
      className={`w-full! max-w-none! mx-0! p-4! sm:p-5! rounded-2xl! flex-col justify-between gap-3 group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5 dark:hover:shadow-black/40 ${theme.borderHover} relative overflow-hidden ${onClick ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
    >
      {/* Ambient background glow on hover */}
      <div
        className={`absolute -top-10 -right-10 w-28 h-28 bg-linear-to-br ${theme.gradientGlow} rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500`}
      />

      {/* Top row: Title & Icon */}
      <div className="flex items-center justify-between gap-2 relative z-10">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {icon && (
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${theme.iconBg} ${theme.iconText} border border-slate-200/60 dark:border-white/10 shadow-xs transition-transform duration-300 group-hover:scale-110 shrink-0`}
          >
            {renderIcon()}
          </div>
        )}
      </div>

      {/* Value */}
      <div className="relative z-10 my-0.5">
        <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 truncate">
          {value}
        </div>
      </div>

      {/* Bottom row: Subtitle & Trend badge */}
      {(subtitle || change) && (
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60 dark:border-white/10 relative z-10">
          {subtitle ? (
            <span className="text-xs text-slate-500 dark:text-slate-400 truncate font-medium">
              {subtitle}
            </span>
          ) : (
            <span />
          )}
          {change && (
            <div
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${theme.badgeBg} ${theme.badgeText} shrink-0`}
            >
              {trend === "up" && (
                <LuTrendingUp size={11} className="shrink-0" />
              )}
              {trend === "down" && (
                <LuTrendingDown size={11} className="shrink-0" />
              )}
              <span>{change}</span>
            </div>
          )}
        </div>
      )}
    </Container>
  );
};

export default KPICard;
