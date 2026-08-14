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
      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-100 text-sm transition-all duration-200 shadow-xs focus-within:border-indigo-500 dark:focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 group w-64 md:w-80 ${containerClassName}`}
    >
      <LuSearch className="w-4 h-4 shrink-0 text-slate-400 dark:text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-transparent text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-hidden ${className}`}
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="shrink-0 p-0.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
        >
          <LuX className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
