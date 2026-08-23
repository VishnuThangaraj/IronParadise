import { isValidElement, type ElementType } from "react";
import { LuTrendingDown, LuTrendingUp } from "react-icons/lu";
import Container from "@/shared/components/ui/containers/Container";
import { KPI_COLOR_PRESETS } from "./constants/kpiColors";
import type {
  KPICardColorTheme,
  KPICardProps,
} from "./types/kpi.types";

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
