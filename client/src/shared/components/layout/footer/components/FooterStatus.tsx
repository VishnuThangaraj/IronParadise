import { motion } from "motion/react";
export interface FooterStatusProps {
  isOnline: boolean;
}

const FooterStatus = ({ isOnline }: FooterStatusProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        <motion.span
          key={isOnline ? "ping-online" : "ping-offline"}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.75 }}
          className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isOnline ? "bg-emerald-400" : "bg-rose-400"}`}
        ></motion.span>
        <motion.span
          key={isOnline ? "dot-online" : "dot-offline"}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`relative inline-flex rounded-full h-2 w-2 ${isOnline ? "bg-emerald-500" : "bg-rose-500"}`}
        ></motion.span>
      </span>
      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
        Iron Paradise Admin Portal {isOnline ? "(Online)" : "(Offline)"}
      </span>
    </div>
  );
};

export default FooterStatus;
