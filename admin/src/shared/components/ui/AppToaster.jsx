import toast, { Toaster, ToastIcon, resolveValue } from "react-hot-toast";
import { LuCheck, LuX } from "react-icons/lu";

const AppToaster = () => {
  return (
    <Toaster position="top-right">
      {(t) => (
        <div
          className={`
            relative flex items-center gap-3.5 w-80 max-w-sm p-4 bg-white border border-slate-100 shadow-[0_15px_30px_rgba(15,23,42,0.08)] rounded-2xl pointer-events-auto select-none transition-all duration-300 ease-out
            ${t.visible ? "translate-y-0 opacity-100 scale-100" : "-translate-y-4 opacity-0 scale-95 pointer-events-none"}
          `}
        >
          {/* Left Color Stripe */}
          <div
            className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl ${
              t.type === "success"
                ? "bg-linear-to-b from-indigo-500 to-purple-500"
                : t.type === "error"
                  ? "bg-rose-500"
                  : "bg-slate-400"
            }`}
          />

          {/* Custom Icons to match App UI */}
          <div className="shrink-0 ml-1">
            {t.type === "success" ? (
              <div className="w-7 h-7 rounded-lg bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-sm">
                <LuCheck className="w-4 h-4 stroke-3" />
              </div>
            ) : t.type === "error" ? (
              <div className="w-7 h-7 rounded-lg bg-rose-500 flex items-center justify-center text-white shadow-sm">
                <LuX className="w-4 h-4 stroke-3" />
              </div>
            ) : (
              <ToastIcon toast={t} />
            )}
          </div>

          {/* Message Content */}
          <div className="grow min-w-0">
            <p className="text-[13px] font-semibold text-slate-800 leading-snug">
              {resolveValue(t.message, t)}
            </p>
          </div>

          {/* Dismiss Action */}
          <button
            onClick={() => toast.dismiss(t.id)}
            className="shrink-0 p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <LuX className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </Toaster>
  );
};

export default AppToaster;
