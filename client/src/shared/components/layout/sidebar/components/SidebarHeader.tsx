import { useNavigation } from "@/shared/hooks/useNavigation";
import { motion } from "motion/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import logoLightURL from "@/shared/assets/images/logo-white.webp";

export interface SidebarHeaderProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
}

const SidebarHeader = ({ isCollapsed, setIsCollapsed }: SidebarHeaderProps) => {
  const { navigate } = useNavigation();

  return (
    <div className="flex items-center justify-between h-20 px-5 border-b border-slate-800/60 relative">
      <div
        className="flex items-center gap-3 cursor-pointer overflow-hidden"
        onClick={() => navigate("/")}
      >
        <img
          src={logoLightURL}
          alt="Iron Paradise Logo"
          className="w-10 h-10 object-contain shrink-0 hover:scale-105 transition-transform duration-200"
        />
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="text-base font-extrabold text-transparent bg-clip-text bg-linear-to-r from-white via-slate-100 to-indigo-200 tracking-wider font-montserrat whitespace-nowrap"
          >
            Iron Paradise
          </motion.span>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-7 w-6 h-6 rounded-full bg-slate-950 border border-slate-800/80 flex items-center justify-center text-slate-400 hover:text-indigo-400 shadow-md shadow-black/50 cursor-pointer hover:bg-slate-900 hover:border-indigo-500/40 hover:scale-110 active:scale-95 transition-all duration-200 z-40 group/toggle"
        aria-label="Toggle Sidebar"
      >
        {isCollapsed ? (
          <LuChevronRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/toggle:translate-x-0.5" />
        ) : (
          <LuChevronLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover/toggle:-translate-x-0.5" />
        )}
      </button>
    </div>
  );
};

export default SidebarHeader;
