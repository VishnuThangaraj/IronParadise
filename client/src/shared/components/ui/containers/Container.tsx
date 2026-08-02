import type { ReactNode } from "react";

interface ContainerProps {
  children?: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}

const primaryStyles =
  "bg-linear-to-br from-white/70 via-slate-50/50 to-indigo-50/40 border border-white/60 shadow-xl shadow-slate-900/10 backdrop-blur-xl dark:from-slate-900/80 dark:via-slate-900/60 dark:to-slate-950/80 dark:border-white/10 dark:shadow-2xl dark:shadow-black/50 transition-all duration-300";

const secondaryStyles = "";

const Container = ({
  children,
  variant = "primary",
  className = "",
}: ContainerProps) => {
  const variantStyles = variant === "primary" ? primaryStyles : secondaryStyles;

  return (
    <div
      className={`w-[calc(100%-2rem)] sm:w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 rounded-3xl flex ${variantStyles} ${className}`}
    >
      {children}
    </div>
  );
};

export default Container;
