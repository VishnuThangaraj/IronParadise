import type { ReactNode } from "react";
import { Modal } from "@mui/material";
import { LuTrash2 } from "react-icons/lu";

export interface DeleteModalProps {
  open: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  title?: string;
  content?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

const DeleteModal = ({
  open,
  onClose,
  onConfirm,
  title = "Delete Item",
  content = "Are you sure you want to delete this? This action cannot be undone.",
  confirmText = "Yes, Delete",
  cancelText = "Cancel",
  loading = false,
}: DeleteModalProps) => {
  return (
    <Modal
      open={Boolean(open)}
      onClose={typeof onClose === "function" ? onClose : undefined}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(15, 23, 42, 0.55)",
          },
        },
      }}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-md bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl shadow-2xl outline-none p-6 text-slate-800 dark:text-slate-100 transition-colors duration-200">
        {/* Header  */}
        <div className="flex justify-start items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-rose-900/60 shadow-xs">
            <LuTrash2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {title}
          </h3>
        </div>

        {/* Content */}
        <div className="space-y-1.5 mb-6">
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {content}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 py-1">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 font-semibold text-sm transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-linear-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-semibold text-sm shadow-md shadow-rose-600/25 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LuTrash2 className="w-4 h-4" />
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
