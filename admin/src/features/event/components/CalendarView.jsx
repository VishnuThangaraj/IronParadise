import { useEffect, useMemo } from "react";
import dayjs from "dayjs";
import { LuChevronLeft, LuChevronRight, LuCalendar } from "react-icons/lu";
import { motion } from "motion/react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarView = ({
  currentDate,
  setCurrentDate,
  selectedDate,
  setSelectedDate,
  events,
  onMonthChange,
  isLoading
}) => {
  // Generate calendar days
  const calendarDays = useMemo(() => {
    const startOfMonth = currentDate.startOf("month");
    const endOfMonth = currentDate.endOf("month");
    
    const startDay = startOfMonth.startOf("week");
    const endDay = endOfMonth.endOf("week");
    
    const days = [];
    let day = startDay;
    
    while (day.isBefore(endDay) || day.isSame(endDay, "day")) {
      days.push(day);
      day = day.add(1, "day");
    }
    return days;
  }, [currentDate]);

  // Fetch events whenever month/year changes
  useEffect(() => {
    const startOfMonth = currentDate.startOf("month").startOf("week").format("YYYY-MM-DDTHH:mm:ss");
    const endOfMonth = currentDate.endOf("month").endOf("week").format("YYYY-MM-DDTHH:mm:ss");
    onMonthChange(startOfMonth, endOfMonth);
  }, [currentDate, onMonthChange]);

  // Group events by day string (YYYY-MM-DD) for fast lookup
  const eventsByDay = useMemo(() => {
    const map = {};
    events.forEach(evt => {
      if (!evt.date) return;
      const dayKey = dayjs(evt.date).format("YYYY-MM-DD");
      if (!map[dayKey]) map[dayKey] = [];
      map[dayKey].push(evt);
    });
    return map;
  }, [events]);

  const handlePrevMonth = () => {
    setCurrentDate(prev => prev.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => prev.add(1, "month"));
  };

  const handleToday = () => {
    const today = dayjs();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const getVisibilityColor = (vis) => {
    switch (vis) {
      case "all": return "bg-emerald-500";
      case "members": return "bg-sky-500";
      case "trainer": return "bg-indigo-500";
      case "private": return "bg-rose-500";
      default: return "bg-slate-400";
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full font-montserrat">
      {/* Calendar Header */}
      <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <LuCalendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">
              {currentDate.format("MMMM YYYY")}
            </h2>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
              Event Schedule
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToday}
            className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            Today
          </button>
          <div className="flex bg-white border border-slate-200 rounded-lg p-0.5">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 text-slate-600 hover:bg-slate-50 rounded-md cursor-pointer"
            >
              <LuChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 text-slate-600 hover:bg-slate-50 rounded-md cursor-pointer"
            >
              <LuChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50 py-2.5 text-center shrink-0">
        {WEEKDAYS.map(day => (
          <span key={day} className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {day}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-6 p-3 gap-1 min-h-[320px] bg-slate-50/20 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-xs flex items-center justify-center z-10">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {calendarDays.map((day, idx) => {
          const dateStr = day.format("YYYY-MM-DD");
          const isCurrentMonth = day.isSame(currentDate, "month");
          const isSelected = day.isSame(selectedDate, "day");
          const isToday = day.isSame(dayjs(), "day");
          const dayEvents = eventsByDay[dateStr] || [];

          return (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedDate(day)}
              className={`relative flex flex-col items-center justify-between p-2 rounded-2xl cursor-pointer select-none transition-all duration-200 text-left hover:-translate-y-0.5 border ${
                isSelected
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                  : isToday
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-bold"
                    : isCurrentMonth
                      ? "bg-white border-slate-200/50 hover:border-slate-300 text-slate-700 font-medium"
                      : "bg-slate-50/50 border-transparent text-slate-300"
              }`}
            >
              {/* Day Number */}
              <span className="text-[11px] self-start font-bold">
                {day.format("D")}
              </span>

              {/* Event indicators */}
              {dayEvents.length > 0 && (
                <div className="flex flex-wrap gap-1 max-w-full justify-center mt-1">
                  {dayEvents.slice(0, 3).map((evt, eIdx) => (
                    <span
                      key={eIdx}
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? "bg-white" : getVisibilityColor(evt.visibility)
                      }`}
                      title={evt.name}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <span className={`text-[7px] font-bold leading-none ${isSelected ? "text-white" : "text-slate-400"}`}>
                      +{dayEvents.length - 3}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend Footer */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-4 items-center justify-center text-[10px] font-bold text-slate-500 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          All (Public)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-500"></span>
          Members
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
          Trainers
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          Private
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
