import React, { useEffect } from "react";
import { motion } from "motion/react";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiX,
  FiXCircle,
} from "react-icons/fi";
import { type ToastMessage } from "./ToastContext";

interface ToastProps extends ToastMessage {
  onRemove: (id: string) => void;
}

const toastConfig = {
  success: {
    icon: (
      <FiCheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
    ),
    style: "border-green-500",
  },
  error: {
    icon: <FiXCircle className="w-5 h-5 text-red-500 dark:text-red-400" />,
    style: "border-red-500",
  },
  warning: {
    icon: (
      <FiAlertCircle className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
    ),
    style: "border-yellow-500",
  },
  info: {
    icon: <FiInfo className="w-5 h-5 text-blue-500 dark:text-blue-400" />,
    style: "border-blue-500",
  },
};

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  message,
  duration = 3000,
  onRemove,
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onRemove(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onRemove]);

  const { icon, style } = toastConfig[type] || toastConfig.info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`pointer-events-auto flex w-full max-w-sm overflow-hidden rounded-xl border border-white/20 dark:border-white/5 border-l-4 shadow-2xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10 mb-3 ${style}`}
    >
      <div className="flex w-full items-center p-4">
        <div className="shrink-0">{icon}</div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {message}
          </p>
        </div>
        <div className="ml-4 flex shrink-0">
          <button
            type="button"
            className="inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-300 dark:focus:ring-offset-gray-800 transition-colors"
            onClick={() => onRemove(id)}
          >
            <span className="sr-only">Close</span>
            <FiX className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
