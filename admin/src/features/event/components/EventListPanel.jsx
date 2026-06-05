import { useMemo } from "react";
import dayjs from "dayjs";
import { LuPlus, LuMapPin, LuClock, LuPencil, LuTrash2, LuInbox, LuEye } from "react-icons/lu";
import Swal from "sweetalert2";

const EventListPanel = ({
  selectedDate,
  events,
  onAddEventClick,
  onEditEventClick,
  onDeleteEventClick
}) => {
  // Filter events matching selectedDate
  const dayEvents = useMemo(() => {
    return events.filter(evt => {
      if (!evt.date) return false;
      return dayjs(evt.date).isSame(selectedDate, "day");
    });
  }, [events, selectedDate]);

  const handleDelete = (event) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete the event "${event.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6366f1",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        onDeleteEventClick(event.eventID);
      }
    });
  };

  const getVisibilityConfig = (vis) => {
    switch (vis) {
      case "all":
        return { label: "Public", border: "border-l-emerald-500", text: "text-emerald-700 bg-emerald-50 border-emerald-100" };
      case "members":
        return { label: "Members Only", border: "border-l-sky-500", text: "text-sky-700 bg-sky-50 border-sky-100" };
      case "trainer":
        return { label: "Trainers Only", border: "border-l-indigo-500", text: "text-indigo-700 bg-indigo-50 border-indigo-100" };
      case "private":
        return { label: "Private VIP", border: "border-l-rose-500", text: "text-rose-700 bg-rose-50 border-rose-100" };
      default:
        return { label: vis, border: "border-l-slate-400", text: "text-slate-700 bg-slate-50 border-slate-100" };
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full font-montserrat">
      {/* Panel Header */}
      <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            Schedule for {selectedDate.format("DD MMMM")}
          </h3>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
            {dayEvents.length} {dayEvents.length === 1 ? "Event" : "Events"} Scheduled
          </p>
        </div>
        
        <button
          type="button"
          onClick={() => onAddEventClick(selectedDate)}
          className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-center group"
        >
          <LuPlus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
        </button>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent bg-slate-50/20">
        {dayEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center h-full">
            <div className="p-4 bg-slate-100 rounded-full text-slate-400 mb-3">
              <LuInbox className="w-8 h-8" />
            </div>
            <p className="text-xs font-bold text-slate-500">No events scheduled today</p>
            <p className="text-[10px] text-slate-400 mt-1 max-w-[200px] leading-relaxed">
              Create an event to keep trainers or members informed.
            </p>
            <button
              type="button"
              onClick={() => onAddEventClick(selectedDate)}
              className="mt-4 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold rounded-xl transition-all cursor-pointer border border-indigo-100/50"
            >
              Add New Event
            </button>
          </div>
        ) : (
          dayEvents.map(event => {
            const visConfig = getVisibilityConfig(event.visibility);
            return (
              <div
                key={event.eventID}
                className={`bg-white p-4.5 rounded-2xl border border-slate-200 border-l-4 ${visConfig.border} shadow-xs hover:shadow-sm transition-all flex flex-col justify-between gap-3`}
              >
                {/* Event Name & Actions */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 break-words line-clamp-2 leading-relaxed">
                      {event.name}
                    </h4>
                    <span className={`inline-block mt-2 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide border rounded-md ${visConfig.text}`}>
                      {visConfig.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => onEditEventClick(event)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                      title="Edit Event"
                    >
                      <LuPencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(event)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Event"
                    >
                      <LuTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Event Description */}
                {event.description && (
                  <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">
                    {event.description}
                  </p>
                )}

                {/* Event Metadata (Time & Location) */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2.5 border-t border-slate-100 text-[10px] text-slate-400 font-semibold mt-1">
                  <div className="flex items-center gap-1.5">
                    <LuClock className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{event.time}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-1.5 min-w-0">
                      <LuMapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate" title={event.location}>{event.location}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default EventListPanel;
