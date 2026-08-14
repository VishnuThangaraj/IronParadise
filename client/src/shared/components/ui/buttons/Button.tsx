import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "blue" | "green" | "empty";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: ButtonVariant;
  type?: "submit" | "button";
  className?: string;
}

const primaryStyles =
  "font-bold text-white bg-linear-to-r from-indigo-600 via-violet-600 to-purple-500 hover:from-indigo-500 hover:via-violet-500 hover:to-purple-400 shadow-md shadow-indigo-500/25 dark:shadow-lg dark:shadow-indigo-500/40";

const secondaryStyles =
  "font-bold text-slate-700 dark:text-slate-200 bg-white/50 dark:bg-white/5 hover:bg-white/70 dark:hover:bg-white/10 border border-slate-200 dark:border-white/15 backdrop-blur-md shadow-sm";

const blueStyles =
  "font-bold text-indigo-600 dark:text-indigo-300 bg-white/50 dark:bg-indigo-500/10 hover:bg-indigo-50/70 dark:hover:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 backdrop-blur-md shadow-sm";

const greenStyles =
  "font-bold text-emerald-600 dark:text-emerald-400 bg-white/50 dark:bg-emerald-500/10 hover:bg-emerald-50/70 dark:hover:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 backdrop-blur-md shadow-sm";

const emptyStyles = "";

const variantStylesMap: Record<ButtonVariant, string> = {
  primary: primaryStyles,
  secondary: secondaryStyles,
  blue: blueStyles,
  green: greenStyles,
  empty: emptyStyles,
};

const Button = ({
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps) => {
  const variantStyles = variantStylesMap[variant] ?? variantStylesMap.primary;

  return (
    <button
      type={type}
      className={`px-6 py-2 rounded-xl transition-all duration-300 ease-out cursor-pointer active:scale-[0.98] flex items-center justify-center ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
