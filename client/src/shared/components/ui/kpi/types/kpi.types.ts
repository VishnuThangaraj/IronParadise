import type { ElementType, ReactNode } from "react";

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

export interface KPIGridProps {
  children?: ReactNode;
  items?: KPICardProps[];
  columns?: 1 | 2 | 3 | 4 | 5;
  className?: string;
}
