import type { ReactNode } from "react";

export type ChipVariant =
  | "active"
  | "inactive"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "primary"
  | "secondary"
  | "green"
  | "red"
  | "yellow"
  | "orange"
  | "blue"
  | "gray";

export type ChipSize = "xs" | "sm" | "md";

export interface ChipProps {
  label?: ReactNode;
  children?: ReactNode;
  variant?: ChipVariant;
  size?: ChipSize;
  dot?: boolean;
  icon?: ReactNode;
  className?: string;
}

const variantStylesMap: Record<ChipVariant, string> = {
  active:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30",
  success:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30",
  green:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30",
  inactive:
    "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/60",
  gray:
    "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/60",
  danger:
    "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/30",
  red:
    "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/30",
  warning:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/30",
  yellow:
    "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/30",
  orange:
    "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/30",
  info:
    "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30",
  blue:
    "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30",
  primary:
    "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/30",
  secondary:
    "bg-slate-500/10 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/15",
};

const dotColorsMap: Record<ChipVariant, string> = {
  active: "bg-emerald-500",
  success: "bg-emerald-500",
  green: "bg-emerald-500",
  inactive: "bg-slate-400",
  gray: "bg-slate-400",
  danger: "bg-red-500",
  red: "bg-red-500",
  warning: "bg-amber-500",
  yellow: "bg-yellow-500",
  orange: "bg-orange-500",
  info: "bg-indigo-500",
  blue: "bg-indigo-500",
  primary: "bg-indigo-500",
  secondary: "bg-slate-400",
};

const sizeStylesMap: Record<ChipSize, string> = {
  xs: "px-2.5 py-0.5 text-[11px] gap-1 rounded-full",
  sm: "px-3 py-1 text-xs gap-1.5 rounded-full",
  md: "px-3.5 py-1.5 text-xs gap-1.5 rounded-full",
};

const dotSizesMap: Record<ChipSize, string> = {
  xs: "w-1.5 h-1.5",
  sm: "w-1.5 h-1.5",
  md: "w-2 h-2",
};

const Chip = ({
  label,
  children,
  variant = "active",
  size = "sm",
  dot = false,
  icon,
  className = "",
}: ChipProps) => {
  const content = label ?? children;
  const variantStyles = variantStylesMap[variant] ?? variantStylesMap.active;
  const sizeStyles = sizeStylesMap[size] ?? sizeStylesMap.sm;
  const dotColor = dotColorsMap[variant] ?? dotColorsMap.active;
  const dotSize = dotSizesMap[size] ?? dotSizesMap.sm;

  return (
    <span
      className={`inline-flex items-center justify-center text-center font-semibold border backdrop-blur-md shadow-xs leading-none select-none transition-colors duration-200 ${sizeStyles} ${variantStyles} ${className}`}
    >
      {dot && (
        <span className={`${dotSize} rounded-full ${dotColor} shrink-0`} />
      )}
      {icon && <span className="shrink-0 flex items-center">{icon}</span>}
      {content && <span className="flex items-center">{content}</span>}
    </span>
  );
};

export default Chip;