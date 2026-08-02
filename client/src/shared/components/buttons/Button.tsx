import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: "primary" | "secondary";
  type?: "submit" | "button";
  className?: string;
}

const primaryStyles =
  "font-bold text-white bg-linear-to-r from-indigo-600 via-violet-600 to-purple-500 hover:from-indigo-500 hover:via-violet-500 hover:to-purple-400 shadow-md shadow-indigo-500/25 dark:shadow-lg dark:shadow-indigo-500/40 ";

const secondaryStyles =
  "font-semibold text-slate-700 dark:text-slate-200 bg-white/40 dark:bg-white/10 hover:bg-white/60 dark:hover:bg-white/20 border border-slate-300/50 dark:border-white/15 backdrop-blur-md shadow-sm";

const Button = ({
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps) => {
  const variantStyles = variant === "primary" ? primaryStyles : secondaryStyles;

  return (
    <button
      type={type}
      className={`w-full px-6 py-2 rounded-xl transition-all duration-300 ease-out cursor-pointer active:scale-[0.98] flex items-center justify-center ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
