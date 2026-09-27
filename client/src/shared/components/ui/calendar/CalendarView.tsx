import { useMemo } from "react";
import { LuCalendar, LuChevronLeft, LuChevronRight } from "react-icons/lu";

import type { Event, BirthdayUser } from "@/modules/event/types/event.types";
import Container from "../containers/Container";
import {
  CALENDAR_WEEK_DAYS,
  generateCalendarGrid,
  isSameDay,
  MONTH_NAMES,
  VISIBILITY_CONFIG,
} from "./config/calendar.config";

export interface CalendarViewProps {
  month: number; // 1-12
  year: number;
  events?: Event[];
  birthdays?: BirthdayUser[];
  selectedDate?: Date;
  onSelectDate?: (date: Date) => void;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  onToday?: () => void;
  showHeader?: boolean;
  className?: string;
}

const CalendarView = ({
  month,
  year,
  events = [],
  birthdays = [],
  selectedDate = new Date(),
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  onToday,
  showHeader = true,
  className = "",
}: CalendarViewProps) => {
  // Generate the 35 or 42 grid slots for the calendar
  const calendarDays = useMemo(
    () => generateCalendarGrid(year, month),
    [year, month],
  );

  return (
    <Container
      variant="secondary"
      className={`flex flex-col justify-between p-6! gap-6 w-full ${className}`}
    >
      {/* 1. Month Header & Navigation */}
      {showHeader && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary flex items-center justify-center shadow-xs">
              <LuCalendar size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-xl sm:text-2xl text-gray-900 dark:text-white leading-tight">
                {MONTH_NAMES[month - 1]} {year}
              </h2>
              <span className="uppercase text-xs font-semibold text-gray-400 dark:text-zinc-500 tracking-wider">
                Event Schedule
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {onToday && (
              <button
                type="button"
                onClick={onToday}
                className="px-3.5 py-1.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-700/60 font-semibold text-sm transition-colors shadow-2xs cursor-pointer"
              >
                Today
              </button>
            )}

            {(onPrevMonth || onNextMonth) && (
              <div className="flex items-center rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-0.5 shadow-2xs">
                {onPrevMonth && (
                  <button
                    type="button"
                    onClick={onPrevMonth}
                    className="p-1.5 rounded-lg text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700/60 transition-colors cursor-pointer"
                    aria-label="Previous month"
                  >
                    <LuChevronLeft size={18} />
                  </button>
                )}
                {onNextMonth && (
                  <button
                    type="button"
                    onClick={onNextMonth}
                    className="p-1.5 rounded-lg text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700/60 transition-colors cursor-pointer"
                    aria-label="Next month"
                  >
                    <LuChevronRight size={18} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. Weekday Header Labels */}
      <div className="grid grid-cols-7 w-full text-center">
        {CALENDAR_WEEK_DAYS.map((day) => (
          <div
            key={day}
            className="uppercase text-xs font-semibold text-gray-400 dark:text-zinc-500 tracking-wider py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 3. Monthly Days Grid */}
      <div className="grid grid-cols-7 gap-2 sm:gap-2.5 w-full">
        {calendarDays.map((day, idx) => {
          const isSelected = isSameDay(selectedDate, day.dateString);
          const dayEvents = events.filter((e) =>
            isSameDay(e.date, day.dateString),
          );
          const dayBirthdays = birthdays.filter((b) =>
            isSameDay(b.birthdayDate, day.dateString),
          );
          const hasEvents = dayEvents.length > 0 || dayBirthdays.length > 0;

          return (
            <button
              key={`${day.dateString}-${idx}`}
              type="button"
              onClick={() => onSelectDate?.(day.date)}
              className={`relative h-15 sm:h-18 md:h-20 rounded-2xl p-2 sm:p-2.5 flex flex-col justify-between items-start transition-all duration-200 cursor-pointer text-left select-none ${
                isSelected
                  ? "bg-primary-light border-2 border-indigo-500/50 dark:border-indigo-400/50 shadow-sm scale-[1.02] ring-2 ring-indigo-400/20"
                  : day.isCurrentMonth
                    ? "bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 hover:border-primary/40 hover:bg-white dark:hover:bg-zinc-800/60 shadow-2xs"
                    : "bg-transparent hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 text-gray-300 dark:text-zinc-600 border border-transparent"
              } ${day.isToday && !isSelected ? "ring-1.5 ring-primary/40 dark:ring-primary/50" : ""}`}
            >
              {/* Day Number */}
              <span
                className={`text-xs sm:text-sm font-semibold ${
                  isSelected
                    ? "text-indigo-600 dark:text-indigo-300 font-bold"
                    : day.isCurrentMonth
                      ? "text-gray-800 dark:text-zinc-200"
                      : "text-gray-300 dark:text-zinc-600"
                }`}
              >
                {day.dayNumber}
              </span>

              {/* Event / Birthday Dots */}
              {hasEvents && (
                <div className="flex items-center justify-center w-full gap-1 pt-1 mt-auto">
                  {isSelected ? (
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary shadow-2xs" />
                  ) : (
                    <>
                      {dayEvents.slice(0, 3).map((e, eIdx) => {
                        const visConfig =
                          VISIBILITY_CONFIG[e.visibility] ||
                          VISIBILITY_CONFIG.all;
                        return (
                          <span
                            key={e._id || eIdx}
                            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${visConfig.dot}`}
                            title={e.title}
                          />
                        );
                      })}
                      {dayBirthdays.length > 0 && (
                        <span
                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-400"
                          title={`Birthday: ${dayBirthdays
                            .map((b) => b.fullName)
                            .join(", ")}`}
                        />
                      )}
                      {dayEvents.length > 3 && (
                        <span className="text-[9px] font-bold text-gray-400 leading-none">
                          +{dayEvents.length - 3}
                        </span>
                      )}
                    </>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 4. Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2 font-semibold text-xs text-gray-500 dark:text-zinc-400 w-full">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>All (Public)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-500"></span>
          <span>Members</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
          <span>Trainers</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          <span>Private</span>
        </div>
        {birthdays.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Birthdays 🎂</span>
          </div>
        )}
      </div>
    </Container>
  );
};

export default CalendarView;
