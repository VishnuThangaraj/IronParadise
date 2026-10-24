import { useMemo, useState } from "react";
import { Modal } from "@mui/material";
import {
  LuCalendar,
  LuX,
  LuClock,
  LuArrowRight,
  LuTimer,
} from "react-icons/lu";

import type { AttendanceRecord } from "../types/attendance.types";

export interface DailyAttendanceLogsModalProps {
  open: boolean;
  onClose: () => void;
  date: Date | string | null;
  records: AttendanceRecord[];
}

type TabType = "all" | "member" | "trainer";

interface UserGroupedAttendance {
  userId: string;
  fullName: string;
  role: "member" | "trainer";
  profileImage?: string;
  sessions: Array<{
    attendanceId: string;
    checkIn: string;
    checkOut?: string | null;
    durationMinutes: number;
    status: string;
  }>;
  totalDurationMinutes: number;
}

const formatTimeOnly = (dateStr?: string | null): string => {
  if (!dateStr) return "--:--";
  try {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "--:--";
  }
};

const formatModalHeaderDate = (dateInput: Date | string): string => {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getInitial = (name?: string): string => {
  if (!name || !name.trim()) return "U";
  return name.trim().charAt(0).toUpperCase();
};

const DailyAttendanceLogsModal = ({
  open,
  onClose,
  date,
  records = [],
}: DailyAttendanceLogsModalProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("all");

  // Group records by user
  const groupedUsers = useMemo(() => {
    const map = new Map<string, UserGroupedAttendance>();

    for (const record of records) {
      const uId = record.userId;
      if (!map.has(uId)) {
        map.set(uId, {
          userId: uId,
          fullName: record.user?.fullName || uId,
          role: record.role,
          profileImage: record.user?.profileImage,
          sessions: [],
          totalDurationMinutes: 0,
        });
      }

      const group = map.get(uId)!;
      group.sessions.push({
        attendanceId: record.attendanceId,
        checkIn: record.checkIn,
        checkOut: record.checkOut,
        durationMinutes: record.durationMinutes || 0,
        status: record.status,
      });
      group.totalDurationMinutes += record.durationMinutes || 0;
    }

    // Sort sessions inside each user by checkIn time ascending
    for (const group of map.values()) {
      group.sessions.sort(
        (a, b) =>
          new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime(),
      );
    }

    return Array.from(map.values());
  }, [records]);

  // Counts for tabs
  const memberCount = useMemo(
    () => groupedUsers.filter((u) => u.role === "member").length,
    [groupedUsers],
  );
  const trainerCount = useMemo(
    () => groupedUsers.filter((u) => u.role === "trainer").length,
    [groupedUsers],
  );
  const allCount = groupedUsers.length;

  // Filtered users for the selected tab
  const filteredUsers = useMemo(() => {
    if (activeTab === "member") {
      return groupedUsers.filter((u) => u.role === "member");
    }
    if (activeTab === "trainer") {
      return groupedUsers.filter((u) => u.role === "trainer");
    }
    return groupedUsers;
  }, [groupedUsers, activeTab]);

  if (!date) return null;

  const totalCheckIns = records.length;
  const formattedDate = formatModalHeaderDate(date);

  return (
    <Modal
      open={Boolean(open)}
      onClose={onClose}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(6px)",
            backgroundColor: "rgba(15, 23, 42, 0.45)",
          },
        },
      }}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-xl max-h-[85vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl outline-none text-slate-800 dark:text-slate-100 transition-colors duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 shadow-xs shrink-0">
              <LuCalendar className="w-5 h-5" />
            </div>

            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
                Daily Attendance Logs
              </h3>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {formattedDate} • {totalCheckIns} Total Check-In
                {totalCheckIns === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <LuX className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-6 px-6 pt-3 border-b border-slate-100 dark:border-slate-800 shrink-0 text-sm">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`flex items-center gap-2 pb-3 transition-colors font-semibold cursor-pointer border-b-2 ${
              activeTab === "all"
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            <span>All Users</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                activeTab === "all"
                  ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
              }`}
            >
              {allCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("member")}
            className={`flex items-center gap-2 pb-3 transition-colors font-semibold cursor-pointer border-b-2 ${
              activeTab === "member"
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            <span>Members</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                activeTab === "member"
                  ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
              }`}
            >
              {memberCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("trainer")}
            className={`flex items-center gap-2 pb-3 transition-colors font-semibold cursor-pointer border-b-2 ${
              activeTab === "trainer"
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            <span>Trainers</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                activeTab === "trainer"
                  ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
              }`}
            >
              {trainerCount}
            </span>
          </button>
        </div>

        {/* Scrollable List of Logs */}
        <div className="p-5 sm:p-6 space-y-3.5 overflow-y-auto flex-1">
          {filteredUsers.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center gap-2 text-slate-400 dark:text-slate-500">
              <LuCalendar className="w-10 h-10 stroke-1" />
              <p className="text-sm font-medium">
                No attendance logs found for this filter.
              </p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.userId}
                className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                {/* Left: Avatar & Info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.fullName}
                      className="w-11 h-11 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-base font-bold shadow-sm shadow-blue-500/25 shrink-0">
                      {getInitial(user.fullName)}
                    </div>
                  )}

                  <div className="min-w-0">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                      {user.fullName}
                    </h4>
                    <div className="mt-1">
                      {user.role === "trainer" ? (
                        <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 dark:border-purple-900/50 uppercase">
                          TRAINER
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50 uppercase">
                          MEMBER
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Center: Sessions / Time Intervals */}
                <div className="flex flex-col gap-1.5 shrink-0">
                  {user.sessions.map((sess, idx) => (
                    <div
                      key={sess.attendanceId || idx}
                      className="flex items-center gap-2 text-xs font-mono font-medium text-slate-700 dark:text-slate-200"
                    >
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                        <LuClock className="w-3.5 h-3.5" />
                        <span>{formatTimeOnly(sess.checkIn)}</span>
                      </div>
                      <LuArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      {sess.checkOut ? (
                        <div className="flex items-center gap-1.5 text-rose-500 dark:text-rose-400">
                          <LuClock className="w-3.5 h-3.5" />
                          <span>{formatTimeOnly(sess.checkOut)}</span>
                        </div>
                      ) : (
                        <span className="text-[11px] font-sans font-semibold text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 rounded-md">
                          In Gym
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Right: Total duration badge */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800/80 pt-2 sm:pt-0 sm:pl-4 shrink-0 gap-1">
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                    TOTAL
                  </span>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/40 text-xs font-bold font-mono">
                    <LuTimer className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>{user.totalDurationMinutes}m</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};

export default DailyAttendanceLogsModal;
