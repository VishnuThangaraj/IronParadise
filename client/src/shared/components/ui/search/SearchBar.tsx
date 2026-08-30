import { LuSearch, LuX } from "react-icons/lu";
import type { InputHTMLAttributes } from "react";

export interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  containerClassName?: string;
}

const SearchBar = ({
  value,
  onChange,
  onClear,
  placeholder = "Search...",
  className = "",
  containerClassName = "",
  ...props
}: SearchBarProps) => {
  return (
    <div
      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border border-slate-200/90 dark:border-slate-700/80 bg-slate-100/90 dark:bg-slate-800/90 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-indigo-500 dark:focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/20 dark:focus-within:ring-indigo-400/25 text-slate-900 dark:text-slate-100 text-sm transition-all duration-200 shadow-inner group w-64 md:w-80 ${containerClassName}`}
    >
      <LuSearch className="w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-transparent text-xs font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400 outline-hidden ${className}`}
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="shrink-0 p-0.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
        >
          <LuX className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;


