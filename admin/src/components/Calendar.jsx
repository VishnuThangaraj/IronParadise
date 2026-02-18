import { useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const Calendar = ({
  events = [],
  height = 650,
  handleDatesChange,
  showEventCountOnly = false,
  eventOnClick,
}) => {
  const formatDateLocal = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const eventCountByDate = useMemo(() => {
    const map = {};

    events.forEach((event) => {
      if (!event.date) return;

      const localDate = formatDateLocal(new Date(event.date));

      if (!map[localDate]) {
        map[localDate] = {
          Member: 0,
          Trainer: 0,
        };
      }

      if (event.userType === "Member") {
        map[localDate].Member += 1;
      }

      if (event.userType === "User") {
        map[localDate].Trainer += 1;
      }
    });

    return map;
  }, [events]);

  // Handle date click from FullCalendar
  const handleDateClick = (info) => {
    if (eventOnClick) {
      eventOnClick(info.dateStr, info);
    }
  };

  // Custom day cell renderer
  const renderDayCell = (arg) => {
    if (!showEventCountOnly) return undefined;

    const dateStr = formatDateLocal(arg.date);
    const dayData = eventCountByDate[dateStr];

    return (
      <div
        className="relative w-full h-full flex flex-col cursor-pointer hover:font-bold hover:scale-103 transition-all ease-in-out"
        onClick={() => eventOnClick && eventOnClick(dateStr)}
      >
        {/* Day Number */}
        <div className="text-sm p-1 text-right ">{arg.dayNumberText}</div>

        {/* Count Display */}
        {dayData && (dayData.Member > 0 || dayData.Trainer > 0) && (
          <div className="flex flex-col gap-2 mt-auto w-full text-xs font-medium text-right py-1">
            <div className="bg-indigo-50 border-indigo-100 rounded-md px-2 py-1 shadow-lg">
              Member : {String(dayData.Member).padStart(2, "0")}
            </div>
            <div className="bg-indigo-50 border-indigo-100 rounded-md px-2 py-1 shadow-lg">
              Trainer: {String(dayData.Trainer).padStart(2, "0")}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={events}
      height={height}
      datesSet={handleDatesChange}
      dateClick={handleDateClick}
      eventDisplay={showEventCountOnly ? "none" : "auto"}
      dayCellContent={showEventCountOnly ? renderDayCell : undefined}
    />
  );
};

export default Calendar;
