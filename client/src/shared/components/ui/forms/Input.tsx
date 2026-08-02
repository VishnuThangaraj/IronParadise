import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelClassName?: string;
}

const Input = ({
  label,
  labelClassName = "",
  className = "",
  ...props
}: InputProps) => {
  const inputId = props.id || props.name;

  return (
    <div className="relative">
      {label && (
        <label
          htmlFor={inputId}
          className={`mb-1 ps-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${labelClassName}`}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`block w-full rounded-md border border-white/60 px-3 py-2 bg-white/40 backdrop-blur-md text-slate-900 placeholder-slate-500 shadow-sm hover:bg-white/50 focus:bg-white/70 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 sm:text-sm transition-all duration-300 dark:border-white/10 dark:bg-slate-900/50 dark:text-white dark:placeholder-slate-400 dark:hover:bg-slate-900/70 dark:focus:bg-slate-900/80 dark:focus:border-indigo-400 dark:focus:ring-indigo-400/50 ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
