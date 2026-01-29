import { useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const Calendar = ({
  events = [],
  height = 650,
  handleDatesChange,
  showEventCountOnly = false,
}) => {
  const formatDateLocal = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // date → event count
  const eventCountByDate = useMemo(() => {
    const map = {};
    events.forEach((event) => {
      if (!event.date) return;
      map[event.date] = (map[event.date] || 0) + 1;
    });
    return map;
  }, [events]);

  const renderDayCell = (arg) => {
    if (!showEventCountOnly) return undefined;

    const dateStr = formatDateLocal(arg.date);
    const count = eventCountByDate[dateStr] || 0;

    return (
      <div className="relative w-full h-full flex flex-col">
        <div className="text-sm p-1">{arg.dayNumberText}</div>

        {count > 0 && (
          <div className="mt-auto w-full bg-indigo-50 text-indigo-700 text-xs font-medium text-center py-1 border-t border-indigo-100">
            Count: {count}
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
      eventDisplay={showEventCountOnly ? "none" : "auto"}
      dayCellContent={showEventCountOnly ? renderDayCell : undefined}
    />
  );
};

export default Calendar;
