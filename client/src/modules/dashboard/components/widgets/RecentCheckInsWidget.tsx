import { useNavigate } from "react-router-dom";
import { LuCircleCheck, LuClock, LuArrowRight, LuQrCode, LuUserCheck } from "react-icons/lu";
import Container from "@/shared/components/ui/containers/Container";
import type { DashboardCheckIn } from "../../types/dashboard.types";

interface RecentCheckInsWidgetProps {
  checkIns: DashboardCheckIn[];
  className?: string;
}

export const RecentCheckInsWidget = ({
  checkIns = [],
  className = "",
}: RecentCheckInsWidgetProps) => {
  const navigate = useNavigate();

  const formatTime = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getStatusBadge = (status: string, isCheckedOut: boolean) => {
    if (isCheckedOut || status === "checked_out") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60">
          Checked Out
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 border border-emerald-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        On Floor
      </span>
    );
  };

  return (
    <Container
      variant="secondary"
      className={`w-full! max-w-none! mx-0! p-4! sm:p-5! rounded-2xl! flex-col justify-between ${className}`}
    >
      {/* Widget Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20">
            <LuUserCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Live Check-In Activity
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Recent member & trainer entrance logs
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/attendance")}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer group"
        >
          <span>All Attendance</span>
          <LuArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Feed list */}
      <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800/60 flex-1">
        {checkIns.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
            No check-in logs recorded recently
          </div>
        ) : (
          checkIns.slice(0, 6).map((item) => {
            const isCheckedOut = Boolean(item.checkOut);
            return (
              <div
                key={item.attendanceId}
                className="py-2.5 flex items-center justify-between gap-3 group hover:bg-slate-50/60 dark:hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
              >
                {/* User avatar & info */}
                <div className="flex items-center gap-3 min-w-0">
                  {item.profileImage ? (
                    <img
                      src={item.profileImage}
                      alt={item.fullName}
                      className="w-8.5 h-8.5 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700 shadow-xs"
                    />
                  ) : (
                    <div className="w-8.5 h-8.5 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-xs">
                      {item.fullName.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {item.fullName}
                      </p>
                      <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        {item.role}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <LuClock className="w-3 h-3 text-slate-400" />
                        {formatTime(item.checkIn)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 uppercase text-[9.5px] font-semibold text-slate-400 dark:text-slate-500">
                        <LuQrCode className="w-3 h-3" />
                        {item.entryMethod}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status pill */}
                <div className="shrink-0 text-right">
                  {getStatusBadge(item.status, isCheckedOut)}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer footer quick action */}
      <div className="pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
        <span className="flex items-center gap-1.5">
          <LuCircleCheck className="w-3.5 h-3.5 text-emerald-500" />
          Kiosk scanner online
        </span>
        <button
          onClick={() => navigate("/attendance-kiosk")}
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
        >
          Launch Kiosk Mode
        </button>
      </div>
    </Container>
  );
};

export default RecentCheckInsWidget;
