import toast, { Toaster, ToastIcon, resolveValue } from "react-hot-toast";

import { LuCheck, LuX } from "react-icons/lu";
import { IoWarningOutline, IoInformationCircleOutline } from "react-icons/io5";

const toastVariants = {
  error: {
    color: "bg-rose-500",
    Icon: LuX,
  },
  warning: {
    color: "bg-amber-500",
    Icon: IoWarningOutline,
  },
  success: {
    color: "bg-gradient-primary-color",
    Icon: LuCheck,
  },
  info: {
    color: "bg-sky-500",
    Icon: IoInformationCircleOutline,
  },
};

const AppToaster = () => {
  return (
    <Toaster position="top-right">
      {(t) => {
        const variant = toastVariants[t.type];
        const Icon = variant?.Icon;

        return (
          <div
            className={`
              relative overflow-hidden flex items-center gap-3.5 w-80 max-w-sm p-4 nord bg-white border border-slate-100 border-l-0 shadow-[0_15px_30px_rgba(15,23,42,0.08)] rounded-2xl pointer-events-auto select-none transition-all duration-300 ease-out
              ${t.visible ? "translate-y-0 opacity-100 scale-100" : "-translate-y-4 opacity-0 scale-95 pointer-events-none"}
            `}
          >
            {/*  Color Stripe */}
            <div
              className={`absolute rounded-l-2xl left-0 top-0 bottom-0 w-1.5 ${variant?.color || "bg-slate-400"}`}
            />
            {/* Icons */}
            <div className="ml-1 shrink-0">
              <div
                className={`flex items-center justify-center rounded-lg w-7 h-7 text-white shadow-sm ${
                  variant?.color ?? "bg-slate-400"
                }`}
              >
                {Icon ? (
                  <Icon className="stroke-3 w-4 h-4" />
                ) : (
                  <ToastIcon toast={t} />
                )}
              </div>
            </div>

            {/* Message Content */}
            <div className="min-w-0 grow">
              <p className="font-semibold text-[13px] text-slate-800 leading-snug">
                {resolveValue(t.message, t)}
              </p>
            </div>

            {/* Dismiss Action */}
            <button
              onClick={() => toast.dismiss(t.id)}
              className="hover:bg-slate-50 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer shrink-0"
            >
              <LuX className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      }}
    </Toaster>
  );
};

export default AppToaster;
