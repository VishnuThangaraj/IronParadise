import { motion } from "motion/react";
import PropTypes from "prop-types";

import { appVersion } from "@/config/appConfig";

const SidebarFooter = ({ isCollapsed }) => {
  return (
    <div className="p-4 border-t border-slate-800/40 bg-black/10 flex items-center justify-center gap-2 select-none shrink-0">
      {!isCollapsed ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-[10px] font-bold text-slate-500 tracking-widest font-mono uppercase"
        >
          ADMIN PANEL {appVersion}
        </motion.div>
      ) : (
        <span className="text-[10px] font-extrabold text-slate-500 font-mono">
          {appVersion}
        </span>
      )}
    </div>
  );
};

SidebarFooter.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
};

export default SidebarFooter;
