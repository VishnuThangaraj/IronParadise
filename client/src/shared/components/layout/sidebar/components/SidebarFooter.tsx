import { motion } from "motion/react";
import { appVersion } from "@/config/appConfig";
export interface SidebarFooterProps {
  isCollapsed: boolean;
}

const SidebarFooter = ({ isCollapsed }: SidebarFooterProps) => {
  return (
    <div className="p-4 border-t border-slate-800/40 bg-black/10 flex items-center justify-center gap-2 select-none shrink-0">
      {!isCollapsed ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-[10px] font-bold text-slate-500 tracking-widest font-mono uppercase"
        >
          IRON PARADISE {appVersion}
        </motion.div>
      ) : (
        <span className="text-[10px] font-extrabold text-slate-500 font-mono">
          {appVersion}
        </span>
      )}
    </div>
  );
};

export default SidebarFooter;
