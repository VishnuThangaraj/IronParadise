import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "@/shared/hooks/useTheme";

interface ThemeToggleProps {
  className?: string;
  toggleText?: boolean;
}

export const ThemeToggle = ({
  className = "",
  toggleText = true,
}: ThemeToggleProps) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 px-3.5 rounded-full bg-white/40 text-slate-800 backdrop-blur-md border border-white/30 hover:bg-white/30 dark:bg-white/10 dark:text-white dark:border-white/20 dark:hover:bg-white/20 transition-all ease-linear duration-300 cursor-pointer shadow-md shadow-gray-400 dark:shadow-gray-700 ${className}`}
      aria-label="Toggle Theme"
    >
      <div className="text-xs flex justify-between gap-2 items-center align-middle">
        <div className="text-indigo-600 dark:text-amber-400">
          {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
        </div>
        {toggleText && <div>{isDark ? "Light Mode" : "Dark Mode"}</div>}
      </div>
    </button>
  );
};
