import { useNavigation } from "@/shared/hooks/useNavigation";
import { motion, AnimatePresence } from "motion/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import logoLightURL from "@/shared/assets/images/logo-white.webp";

export interface SidebarHeaderProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
}

const SidebarHeader = ({ isCollapsed, setIsCollapsed }: SidebarHeaderProps) => {
  const { navigate } = useNavigation();

  return (
    <div className="flex items-center justify-between h-20 px-4 border-b border-slate-800/80 relative select-none">
      <div
        className={`flex items-center gap-3 cursor-pointer group transition-all duration-300 ${
          isCollapsed ? "w-full justify-center" : "min-w-0"
        }`}
        onClick={() => navigate("/dashboard")}
        title="Iron Paradise Dashboard"
      >
        {/* Logo Container with Ambient Glow */}
        <div className="relative shrink-0 flex items-center justify-center">
          <div className="absolute -inset-1.5 bg-indigo-500/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative w-10 h-10 rounded-xl bg-slate-900/90 border border-slate-700/50 flex items-center justify-center shadow-inner group-hover:scale-105 group-hover:border-indigo-500/40 transition-all duration-300">
            <img
              src={logoLightURL}
              alt="Iron Paradise"
              className="w-7 h-7 object-contain drop-shadow-sm"
            />
          </div>
        </div>

        {/* Brand Text */}
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col min-w-0"
            >
              <span className="text-[15px] font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-white via-slate-100 to-indigo-200 truncate">
                Iron Paradise
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 font-mono leading-none">
                  FITNESS HUB
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-900 border border-slate-700/90 flex items-center justify-center text-slate-400 hover:text-white shadow-lg shadow-black/60 cursor-pointer hover:bg-indigo-600 hover:border-indigo-400 hover:scale-110 active:scale-90 transition-all duration-200 z-50 group/toggle"
        aria-label="Toggle Sidebar (Ctrl+B)"
        title={isCollapsed ? "Expand sidebar (Ctrl+B)" : "Collapse sidebar (Ctrl+B)"}
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
