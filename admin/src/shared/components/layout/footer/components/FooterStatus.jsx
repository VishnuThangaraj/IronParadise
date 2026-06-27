import PropTypes from "prop-types";
import { motion } from "motion/react";

const FooterStatus = ({ isOnline }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex w-2 h-2">
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
      <motion.span
        key={isOnline ? "text-online" : "text-offline"}
        initial={{ opacity: 0, y: -2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="text-gray-600"
      >
        IronParadise {isOnline ? "(Online)" : "(Offline)"}
      </motion.span>
    </div>
  );
};

FooterStatus.propTypes = {
  isOnline: PropTypes.bool.isRequired,
};

export default FooterStatus;
