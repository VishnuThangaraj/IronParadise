import React from "react";
import { AnimatePresence } from "motion/react";
import { Toast } from "./Toast";
import { type ToastMessage } from "./ToastContext";

interface ToastContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  removeToast,
}) => {
  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 z-50 flex items-end px-4 py-6 sm:items-end sm:p-6"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast key={toast.id} {...toast} onRemove={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
