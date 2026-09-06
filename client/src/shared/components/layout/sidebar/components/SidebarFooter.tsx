import { motion } from "motion/react";
import { appVersion } from "@/config/appConfig";

export interface SidebarFooterProps {
  isCollapsed: boolean;
}

const SidebarFooter = ({ isCollapsed }: SidebarFooterProps) => {
  return (
    <div className="h-14 px-4 border-t border-slate-800/60 bg-slate-950/40 flex items-center justify-center select-none shrink-0">
      {!isCollapsed ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-2 text-[10px] font-bold text-slate-500 tracking-widest uppercase font-mono"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/60" />
          <span>IRON PARADISE</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 text-[9px] border border-slate-700/50">
            v{appVersion}
          </span>
        </motion.div>
      ) : (
        <span
          className="text-[10px] font-bold text-slate-500 font-mono tracking-tight"
          title={`Iron Paradise v${appVersion}`}
        >
          v{appVersion}
        </span>
      )}
    </div>
  );
};

export default SidebarFooter;
