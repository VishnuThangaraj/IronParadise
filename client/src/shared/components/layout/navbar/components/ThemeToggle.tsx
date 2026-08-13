import { FiSun, FiMoon } from "react-icons/fi";

import { useTheme } from "@/shared/hooks/useTheme";

import Button from "@/shared/components/ui/buttons/Button";
import Tooltip from "@/shared/components/ui/tooltip/Tooltip";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <Tooltip
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      position="bottom"
      showArrow={false}
    >
      <Button
        variant="empty"
        className="w-auto! p-2.5! rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-amber-500 dark:text-indigo-400 transition-all duration-200 shadow-xs active:scale-95 cursor-pointer"
        onClick={toggleTheme}
        aria-label="Toggle Theme"
      >
        {isDark ? (
          <FiSun
            size={18}
            className="transition-transform duration-300 hover:rotate-45"
          />
        ) : (
          <FiMoon
            size={18}
            className="transition-transform duration-300 hover:-rotate-12"
          />
        )}
      </Button>
    </Tooltip>
  );
};

export default ThemeToggle;
