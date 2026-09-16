import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant =
  | "primary"
  | "primary-light"
  | "primary-outlined"
  | "primary-outline"
  | "secondary"
  | "tertiary"
  | "transparent"
  | "transparent-pure"
  | "blue"
  | "green"
  | "yellow"
  | "orange"
  | "red"
  | "red-dark"
  | "dark-red"
  | "empty";

export type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: "submit" | "button";
  className?: string;
  loading?: boolean;
}

const primaryStyles =
  "font-bold text-white bg-linear-to-r from-indigo-600 via-violet-600 to-purple-500 hover:from-indigo-500 hover:via-violet-500 hover:to-purple-400 shadow-md shadow-indigo-500/25 dark:shadow-lg dark:shadow-indigo-500/40";

const primaryLightStyles =
  "font-bold text-indigo-700 dark:text-indigo-300 bg-linear-to-r from-indigo-50/90 via-violet-50/90 to-purple-50/90 hover:from-indigo-100/90 hover:via-violet-100/90 hover:to-purple-100/90 dark:from-indigo-950/50 dark:via-violet-950/50 dark:to-purple-950/50 dark:hover:from-indigo-900/60 dark:hover:via-violet-900/60 dark:hover:to-purple-900/60 border border-indigo-200/80 dark:border-indigo-500/30 backdrop-blur-md shadow-xs shadow-indigo-500/10";

const primaryOutlinedStyles =
  "font-bold text-indigo-600 dark:text-indigo-400 bg-white/40 dark:bg-indigo-500/10 hover:bg-indigo-50/90 dark:hover:bg-indigo-500/20 border border-indigo-600/80 dark:border-indigo-400/80 backdrop-blur-md shadow-xs shadow-indigo-500/10";

const secondaryStyles =
  "font-bold text-slate-700 dark:text-slate-200 bg-white/50 dark:bg-white/5 hover:bg-white/70 dark:hover:bg-white/10 border border-slate-200 dark:border-white/15 backdrop-blur-md shadow-sm";

const tertiaryStyles =
  "font-bold text-slate-600 dark:text-slate-300 bg-slate-500/10 dark:bg-slate-400/10 hover:bg-slate-500/20 dark:hover:bg-slate-400/20 border border-slate-400/20 dark:border-slate-500/30 backdrop-blur-md shadow-sm";

const transparentStyles =
  "font-bold text-slate-600 dark:text-slate-300 bg-white/30 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/15 backdrop-blur-md shadow-sm";

const transparentPureStyles =
  "font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-transparent dark:bg-transparent hover:bg-transparent dark:hover:bg-transparent border-0 border-transparent shadow-none dark:shadow-none";

const blueStyles =
  "font-bold text-indigo-600 dark:text-indigo-300 bg-white/50 dark:bg-indigo-500/10 hover:bg-indigo-50/70 dark:hover:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 backdrop-blur-md shadow-sm";

const greenStyles =
  "font-bold text-emerald-600 dark:text-emerald-400 bg-white/50 dark:bg-emerald-500/10 hover:bg-emerald-50/70 dark:hover:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 backdrop-blur-md shadow-sm";

const yellowStyles =
  "font-bold text-yellow-600 dark:text-yellow-400 bg-white/50 dark:bg-yellow-500/10 hover:bg-yellow-50/70 dark:hover:bg-yellow-500/20 border border-yellow-200 dark:border-yellow-500/30 backdrop-blur-md shadow-sm";

const orangeStyles =
  "font-bold text-orange-600 dark:text-orange-400 bg-white/50 dark:bg-orange-500/10 hover:bg-orange-50/70 dark:hover:bg-orange-500/20 border border-orange-200 dark:border-orange-500/30 backdrop-blur-md shadow-sm";

const redStyles =
  "font-bold text-red-600 dark:text-red-400 bg-white/50 dark:bg-red-500/10 hover:bg-red-50/70 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/30 backdrop-blur-md shadow-sm";

const redDarkStyles =
  "font-bold text-white bg-linear-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-md shadow-rose-600/25 dark:shadow-lg dark:shadow-rose-600/40";

const emptyStyles = "";

const variantStylesMap: Record<ButtonVariant, string> = {
  primary: primaryStyles,
  "primary-light": primaryLightStyles,
  "primary-outlined": primaryOutlinedStyles,
  "primary-outline": primaryOutlinedStyles,
  secondary: secondaryStyles,
  tertiary: tertiaryStyles,
  transparent: transparentStyles,
  "transparent-pure": transparentPureStyles,
  blue: blueStyles,
  green: greenStyles,
  yellow: yellowStyles,
  orange: orangeStyles,
  red: redStyles,
  "red-dark": redDarkStyles,
  "dark-red": redDarkStyles,
  empty: emptyStyles,
};

const sizeStylesMap: Record<ButtonSize, string> = {
  xs: "px-2.5 py-1.5 text-xs leading-none rounded-lg gap-1.5",
  sm: "px-3.5 py-2 text-sm leading-none rounded-lg gap-2",
  md: "px-6 py-2.5 text-sm leading-none rounded-xl gap-2",
  lg: "px-8 py-3.5 text-base leading-none rounded-2xl gap-2.5",
};

const spinnerSizeMap: Record<ButtonSize, string> = {
  xs: "w-3 h-3 border-[1.5px]",
  sm: "w-3.5 h-3.5 border-2",
  md: "w-4 h-4 border-2",
  lg: "w-5 h-5 border-2",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  loading = false,
  disabled = false,
  ...props
}: ButtonProps) => {
  const variantStyles = variantStylesMap[variant] ?? variantStylesMap.primary;
  const sizeStyles = sizeStylesMap[size] ?? sizeStylesMap.md;
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`inline-flex items-center justify-center whitespace-nowrap transition-all duration-300 ease-out ${
        isDisabled
          ? "opacity-60 cursor-not-allowed pointer-events-none"
          : "cursor-pointer active:scale-[0.98]"
      } ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <div
            className={`${spinnerSizeMap[size]} rounded-full border-current border-t-transparent animate-spin shrink-0`}
          />
          {typeof children === "string" && <span>{children}</span>}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
