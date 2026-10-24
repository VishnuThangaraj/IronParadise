import { useState, useMemo } from "react";
import {
  LuCalendar,
  LuChevronLeft,
  LuChevronRight,
} from "react-icons/lu";

import Container from "@/shared/components/ui/containers/Container";
import {
  MONTH_NAMES,
  CALENDAR_WEEK_DAYS,
  generateCalendarGrid,
} from "@/shared/components/ui/calendar/config/calendar.config";

import {
  useAttendanceMonthly,
  formatLocalDateKey,
} from "../hooks/use-attendance.monthly";
import type { AttendanceRecord } from "../types/attendance.types";
import DailyAttendanceLogsModal from "./DailyAttendanceLogsModal";

export interface AttendanceCalendarViewProps {
  className?: string;
}

const AttendanceCalendarView = ({ className = "" }: AttendanceCalendarViewProps) => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth() + 1); // 1-12

  // Modal State
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedRecords, setSelectedRecords] = useState<AttendanceRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Month navigation
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Generate 35 or 42 grid slots
  const calendarDays = useMemo(
    () => generateCalendarGrid(currentYear, currentMonth),
    [currentYear, currentMonth],
  );

  // Start and end dates covering the visible grid range
  const gridStartDate = calendarDays[0]?.dateString || `${currentYear}-01-01`;
  const gridEndDate =
    calendarDays[calendarDays.length - 1]?.dateString || `${currentYear}-12-31`;

  // Fetch monthly attendance records
  const { dayAttendanceMap } = useAttendanceMonthly(
    gridStartDate,
    gridEndDate,
  );

  const handleDayClick = (dayDate: Date, dayDateString: string) => {
    const summary = dayAttendanceMap[dayDateString];
    setSelectedDate(dayDate);
    setSelectedRecords(summary?.records || []);
    setIsModalOpen(true);
  };

  return (
    <div className={`flex flex-col gap-3 w-full ${className}`}>
      {/* 1. Header row above calendar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 w-full">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Monthly Calendar View
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            View check-ins dynamically across the month
          </p>
        </div>

        {/* Month Selector Pill */}
        <div className="flex items-center gap-1.5 self-stretch sm:self-auto justify-between sm:justify-end">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer shadow-2xs"
            aria-label="Previous Month"
          >
            <LuChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-2xs text-xs sm:text-sm font-semibold select-none">
            <LuCalendar className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              {MONTH_NAMES[currentMonth - 1]} {currentYear}
            </span>
          </div>

          <button
            type="button"
            onClick={handleNextMonth}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer shadow-2xs"
            aria-label="Next Month"
          >
            <LuChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Main Calendar Container */}
      <Container
        variant="secondary"
        className="p-5 sm:p-6 flex flex-col gap-5 w-full max-w-none"
      >
        {/* Card Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 shadow-xs shrink-0">
            <LuCalendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Overview Calendar
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Total check-ins per day
            </p>
          </div>
        </div>

        {/* Weekday Header */}
        <div className="grid grid-cols-7 w-full text-center">
          {CALENDAR_WEEK_DAYS.map((day) => (
            <div
              key={day}
              className="uppercase text-[11px] font-bold text-slate-400 dark:text-slate-500 py-1 tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5 w-full">
          {calendarDays.map((day, idx) => {
            const dayKey = formatLocalDateKey(day.date);
            const daySummary = dayAttendanceMap[dayKey];
            const hasCheckIns = daySummary && daySummary.total > 0;

            if (!day.isCurrentMonth) {
              return (
                <div
                  key={`${day.dateString}-${idx}`}
                  className="rounded-2xl border border-transparent bg-slate-50/20 dark:bg-slate-900/15 p-2 sm:p-2.5 min-h-[70px] sm:min-h-[85px] flex flex-col justify-between text-slate-300 dark:text-slate-700 pointer-events-none select-none"
                >
                  <span className="text-xs sm:text-sm font-medium">
                    {day.dayNumber}
                  </span>
                </div>
              );
            }

            return (
              <button
                key={`${day.dateString}-${idx}`}
                type="button"
                onClick={() => handleDayClick(day.date, dayKey)}
                className={`group rounded-2xl border p-2 sm:p-2.5 min-h-[70px] sm:min-h-[85px] flex flex-col justify-between text-left transition-all duration-200 cursor-pointer shadow-2xs select-none ${
                  day.isToday
                    ? "bg-white dark:bg-slate-900/80 border-indigo-400/80 dark:border-indigo-500/80 ring-2 ring-indigo-500/20"
                    : "bg-white dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md hover:-translate-y-0.5"
                }`}
              >
                {/* Top Row: Date number & optional green dot */}
                <div className="flex items-center justify-between w-full">
                  {day.isToday ? (
                    <div className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px] sm:text-xs font-bold shadow-xs">
                      {day.dayNumber}
                    </div>
                  ) : (
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {day.dayNumber}
                    </span>
                  )}

                  {hasCheckIns && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 shadow-xs" />
                  )}
                </div>

                {/* Bottom Row: Check-in badge & breakdown */}
                {hasCheckIns ? (
                  <div className="w-full mt-auto space-y-1">
                    <div className="w-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/60 rounded-md px-1.5 py-0.5 text-[10.5px] sm:text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center justify-between">
                      <span>Total</span>
                      <span className="font-bold">{daySummary.total}</span>
                    </div>

                    <div className="text-[9.5px] sm:text-[10px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pl-0.5">
                      {daySummary.members > 0 && (
                        <span>{daySummary.members} M</span>
                      )}
                      {daySummary.trainers > 0 && (
                        <span>{daySummary.trainers} T</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div />
                )}
              </button>
            );
          })}
        </div>
      </Container>

      {/* Daily Attendance Logs Modal */}
      <DailyAttendanceLogsModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        date={selectedDate}
        records={selectedRecords}
      />
    </div>
  );
};

export default AttendanceCalendarView;
