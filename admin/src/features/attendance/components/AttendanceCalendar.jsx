import { useMemo, useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { LuCalendar, LuUsers, LuTimer, LuUser } from "react-icons/lu";
import DayAttendanceModal from "./DayAttendanceModal";

const AttendanceCalendar = ({ logs, selectedUser, currentMonthStr }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDayDate, setSelectedDayDate] = useState(null);
  const [selectedDayLogs, setSelectedDayLogs] = useState([]);
  // currentMonthStr is "YYYY-MM"
  const currentDate = useMemo(() => {
    if (!currentMonthStr) return new Date();
    const [year, month] = currentMonthStr.split("-");
    return new Date(year, month - 1, 1);
  }, [currentMonthStr]);

  const daysInMonth = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate));
    const end = endOfWeek(endOfMonth(currentDate));
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  // If a specific user is selected, filter logs to only their logs.
  // Wait, if a specific user is selected, the parent component might not filter `logs`.
  // Actually, parent passes `filteredLogs` which already filters by selected user if we want,
  // OR the parent passes ALL logs for the month and we filter here.
  // The backend already returns all logs for the month. The parent `Attendance.jsx` filters by `userType` and `searchQuery`.
  // Wait, in `Attendance.jsx`, `logsSearchQuery` is used for the table.
  // Since we replaced the table with a calendar, we can just use `logs` and `selectedUser`.
  
  // Create a map of date (YYYY-MM-DD) -> array of log records
  const logsByDate = useMemo(() => {
    const map = new Map();
    
    let displayLogs = Array.isArray(logs) ? logs : [];
    if (selectedUser) {
      displayLogs = displayLogs.filter(l => l.userId === selectedUser.id);
    }

    displayLogs.forEach((log) => {
      if (!log || !log.date) return;
      // log.date is ISO string, e.g., "2026-05-20T00:00:00.000Z"
      const dateStr = log.date.split("T")[0]; 
      if (!map.has(dateStr)) {
        map.set(dateStr, []);
      }
      map.get(dateStr).push(log);
    });
    return map;
  }, [logs, selectedUser]);

  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderCellContent = (dayLogs, isCurrentMonth) => {
    if (!dayLogs || dayLogs.length === 0) {
      return (
        <div className="flex h-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] text-slate-300 font-medium font-montserrat">No data</span>
        </div>
      );
    }

    if (selectedUser) {
      // User specific view: Show checkin/checkout times
      // A user has one log document per day
      const log = dayLogs[0]; // there should only be one per user per day
      if (!log || !log.records || log.records.length === 0) return null;

      return (
        <div className="mt-1 space-y-1 w-full flex flex-col font-montserrat">
          {log.records.map((rec, idx) => (
            <div key={idx} className="flex flex-col gap-0.5 bg-indigo-50 border border-indigo-100 rounded p-1">
              <div className="flex items-center gap-1 text-[9px] font-bold text-indigo-700">
                <LuTimer className="w-2.5 h-2.5" />
                <span>In: {formatTime(rec.checkIn)}</span>
              </div>
              {rec.checkOut && (
                <div className="flex items-center gap-1 text-[9px] font-medium text-slate-500">
                  <span className="w-2.5" />
                  <span>Out: {formatTime(rec.checkOut)}</span>
                </div>
              )}
            </div>
          ))}
          <div className="text-[9px] font-bold text-slate-500 text-right mt-0.5">
            {Math.round(log.totalMinutes || 0)} mins
          </div>
        </div>
      );
    } else {
      // Aggregate view: Show total attendees and breakdown
      const total = dayLogs.length;
      const members = dayLogs.filter(l => l.userType === "member").length;
      const trainers = dayLogs.filter(l => l.userType === "trainer").length;
      
      return (
        <div className="mt-1 w-full flex flex-col gap-1 font-montserrat">
          <div className="flex items-center justify-between bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-100">
            <span className="text-[10px] font-bold">Total</span>
            <span className="text-[11px] font-bold">{total}</span>
          </div>
          {(members > 0 || trainers > 0) && (
            <div className="flex items-center justify-between gap-1 text-[9px] text-slate-500 px-0.5">
              {members > 0 && <span>{members} M</span>}
              {trainers > 0 && <span>{trainers} T</span>}
            </div>
          )}
        </div>
      );
    }
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-lg shadow-slate-200/50 overflow-hidden font-montserrat">
      {/* Header section explaining the view */}
      <div className="bg-slate-50/50 border-b border-slate-100 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
            <LuCalendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              {selectedUser ? `${selectedUser.name}'s Attendance` : 'Overview Calendar'}
            </h3>
            <p className="text-[10px] font-medium text-slate-400">
              {selectedUser ? 'Daily session history' : 'Total check-ins per day'}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Days of the week header */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {daysInMonth.map((day, dayIdx) => {
            const isCurrentMonthDate = isSameMonth(day, currentDate);
            const isTodayDate = isToday(day);
            const dateStr = format(day, "yyyy-MM-dd");
            const dayLogs = logsByDate.get(dateStr) || [];
            const hasData = dayLogs.length > 0;

            return (
              <div
                key={day.toString()}
                onClick={() => {
                  if (hasData && !selectedUser) {
                    setSelectedDayDate(dateStr);
                    setSelectedDayLogs(dayLogs);
                    setIsModalOpen(true);
                  }
                }}
                className={`min-h-[90px] border rounded-xl p-2 flex flex-col group transition-all duration-200 ${
                  !isCurrentMonthDate
                    ? "bg-slate-50/50 border-transparent opacity-50"
                    : isTodayDate
                    ? "bg-indigo-50/30 border-indigo-200 shadow-sm shadow-indigo-100"
                    : hasData
                    ? "bg-white border-slate-200 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-50"
                    : "bg-white border-slate-100 hover:border-slate-200"
                } ${hasData && !selectedUser ? "cursor-pointer" : ""}`}
              >
                {/* Date Header */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-bold ${
                      isTodayDate
                        ? "bg-indigo-500 text-white w-5 h-5 rounded-full flex items-center justify-center"
                        : "text-slate-600"
                    }`}
                  >
                    {format(day, "d")}
                  </span>
                  {hasData && !selectedUser && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                  {renderCellContent(dayLogs, isCurrentMonthDate)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <DayAttendanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dateStr={selectedDayDate}
        dayLogs={selectedDayLogs}
      />
    </div>
  );
};

export default AttendanceCalendar;
