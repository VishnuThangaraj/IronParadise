import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Modal } from "@mui/material";
import { LuLogOut } from "react-icons/lu";

import { logout } from "@/modules/auth/redux/auth.slice";
import { useToast } from "@/shared/components/ui/toast";

export interface LogoutModalProps {
  open: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
}

const LogoutModal = ({ open, onClose, onConfirm }: LogoutModalProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleLogout = () => {
    if (typeof onConfirm === "function") {
      onConfirm();
    } else {
      dispatch(logout());
      addToast({ type: "info", message: "Logged out successfully." });
      navigate("/authenticate");
    }
    onClose?.();
  };

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
            <LuLogOut className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Log Out of IronParadise
          </h3>
        </div>

        {/* Content */}
        <div className="space-y-1.5 mb-6">
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Are you sure you want to log out? You will need to log back in to
            access your workspace and dashboard.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 py-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 font-semibold text-sm transition-all duration-200 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex-1 px-4 py-2.5 rounded-xl bg-linear-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-semibold text-sm shadow-md shadow-rose-600/25 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
          >
            <LuLogOut className="w-4 h-4" />
            <span>Yes, Log Out</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default LogoutModal;
