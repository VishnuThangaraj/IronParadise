import type { Dispatch, SetStateAction } from "react";
import { LuLayoutGrid, LuList } from "react-icons/lu";

export interface ViewModeToggleProps {
  viewMode?: string;
  setViewMode: Dispatch<SetStateAction<string>>;
}

const ViewModeToggle = ({
  viewMode = "grid",
  setViewMode,
}: ViewModeToggleProps) => {
  return (
    <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-inner">
      <button
        onClick={() => setViewMode("list")}
        title="List View"
        type="button"
        className={`flex items-center justify-center p-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
          viewMode === "list"
            ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs scale-100"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-700/50"
        }`}
      >
        <LuList className="w-4 h-4" />
      </button>
      <button
        onClick={() => setViewMode("grid")}
        title="Grid View"
        type="button"
        className={`flex items-center justify-center p-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
          viewMode === "grid"
            ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs scale-100"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-700/50"
        }`}
      >
        <LuLayoutGrid className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ViewModeToggle;
