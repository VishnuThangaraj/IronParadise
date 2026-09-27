import { useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";
import {
  LuClock,
  LuPencil,
  LuTrash2,
  LuCalendarDays,
  LuCake,
  LuMapPin,
  LuUserCheck,
} from "react-icons/lu";

import Button from "@/shared/components/ui/buttons/Button";
import PageHeader from "@/shared/components/ui/page/PageHeader";
import Container from "@/shared/components/ui/containers/Container";
import DeleteModal from "@/shared/components/ui/modals/DeleteModal";
import CalendarView from "@/shared/components/ui/calendar/CalendarView";
import {
  isSameDay,
  MONTH_NAMES,
  toDateKey,
  VISIBILITY_CONFIG,
} from "@/shared/components/ui/calendar/config/calendar.config";

import EventForm from "../components/EventForm";
import { initialEventState } from "../state/initial-event.state";
import { useEventsByMonth } from "../hooks/use-event.fetch";
import { useEventDelete } from "../hooks/use-event.delete";
import type { Event, BirthdayUser } from "../types/event.types";

const formatDateForInput = (val?: string | Date | null): string => {
  if (!val) return "";
  try {
    if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
      return val;
    }
    const d = new Date(val);
    if (isNaN(d.getTime())) return "";
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  } catch {
    return "";
  }
};

const EventsCalendar = () => {
  // Navigation & selection state
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const currentMonth = currentDate.getMonth() + 1; // 1-12
  const currentYear = currentDate.getFullYear();

  // Modal states
  const [isEdit, setIsEdit] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

  const [eventData, setEventData] = useState(initialEventState);
  const [currentEvent, setCurrentEvent] = useState<Record<string, any>>({});

  // Query events & birthdays for the current month
  const { data: monthData } = useEventsByMonth({
    month: currentMonth,
    year: currentYear,
  });

  // Delete mutation
  const { mutate: deleteEventMutate, isPending: isDeleting } = useEventDelete({
    onSuccess: () => {
      setOpenDeleteModal(false);
      setEventToDelete(null);
    },
  });

  // Extract events and birthdays safely
  const events: Event[] = useMemo(() => {
    if (!monthData?.data) return [];
    if (Array.isArray(monthData.data)) return monthData.data;
    return monthData.data.events || [];
  }, [monthData]);

  const birthdays: BirthdayUser[] = useMemo(() => {
    if (!monthData?.data || Array.isArray(monthData.data)) return [];
    return monthData.data.birthdays || [];
  }, [monthData]);

  // Selected date key (YYYY-MM-DD)
  const selectedDateKey = toDateKey(selectedDate);

  // Filter events and birthdays for the selected date
  const selectedDateEvents = useMemo(() => {
    return events.filter((e) => isSameDay(e.date, selectedDateKey));
  }, [events, selectedDateKey]);

  const selectedDateBirthdays = useMemo(() => {
    return birthdays.filter((b) => isSameDay(b.birthdayDate, selectedDateKey));
  }, [birthdays, selectedDateKey]);

  // Month navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const prevDate = new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
      return prevDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const nextDate = new Date(prev.getFullYear(), prev.getMonth() + 1, 1);
      return nextDate;
    });
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Close event form handler
  const handleCloseEventForm = () => {
    setIsEdit(false);
    setCurrentEvent({});
    setEventData(initialEventState);
    setOpenForm(false);
  };

  // Open edit event
  const handleEditEvent = (event: Event) => {
    setIsEdit(true);
    setCurrentEvent(event);
    setEventData({
      title: event.title,
      description: event.description || "",
      date: formatDateForInput(event.date),
      time: event.time,
      visibility: event.visibility,
      isActive: event.isActive,
    });
    setOpenForm(true);
  };

  // Open add event for selected date
  const handleAddEventForDate = () => {
    setIsEdit(false);
    setCurrentEvent({});
    setEventData({
      ...initialEventState,
      date: formatDateForInput(selectedDate),
    });
    setOpenForm(true);
  };

  // Delete event confirmation
  const handleConfirmDelete = () => {
    if (!eventToDelete) return;
    const id = eventToDelete.eventId || eventToDelete._id;
    deleteEventMutate({ id, permanent: true });
  };

  const handleSoftDelete = () => {
    if (!eventToDelete) return;
    const id = eventToDelete.eventId || eventToDelete._id;
    deleteEventMutate({ id, permanent: false });
  };

  const selectedDayNumber = selectedDate.getDate();
  const selectedMonthName = MONTH_NAMES[selectedDate.getMonth()];
  const totalDayItems =
    selectedDateEvents.length + selectedDateBirthdays.length;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <PageHeader
            title="Event Management"
            description="Plan, schedule, and track fitness activities and gym workshops."
          />
        </div>
        <div>
          <Button
            variant="primary"
            className="font-semibold text-sm px-4!"
            aria-label="Add Event"
            onClick={() => {
              setIsEdit(false);
              setCurrentEvent({});
              setEventData(initialEventState);
              setOpenForm(true);
            }}
          >
            <div className="flex items-center gap-2">
              <FiPlus size={16} /> <span>Add Event</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Main Calendar & Schedule Grid */}
      <div className="flex flex-col lg:flex-row gap-6 w-full items-start">
        {/* Left Side: Monthly Calendar Card */}
        <div className="w-full lg:w-[70%]">
          <CalendarView
            month={currentMonth}
            year={currentYear}
            events={events}
            birthdays={birthdays}
            selectedDate={selectedDate}
            onSelectDate={(newDate) => {
              setSelectedDate(newDate);
              // If selected date is in another month, update calendar view
              if (
                newDate.getMonth() !== currentDate.getMonth() ||
                newDate.getFullYear() !== currentDate.getFullYear()
              ) {
                setCurrentDate(
                  new Date(newDate.getFullYear(), newDate.getMonth(), 1),
                );
              }
            }}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onToday={handleToday}
          />
        </div>

        {/* Right Side: Schedule for Selected Day Sidebar */}
        <Container
          className="flex flex-col w-full lg:w-[30%] p-6! gap-5 self-stretch justify-start"
          variant="secondary"
        >
          {/* Header Row */}
          <div className="flex justify-between items-start gap-4">
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">
                Schedule for {selectedDayNumber} {selectedMonthName}
              </h3>
              <p className="text-gray-400 dark:text-zinc-500 font-semibold tracking-wider text-xs uppercase mt-0.5">
                {totalDayItems} {totalDayItems === 1 ? "EVENT" : "EVENTS"} SCHEDULED
              </p>
            </div>

            {/* Plus Button */}
            <button
              type="button"
              onClick={handleAddEventForDate}
              aria-label="Add event for this date"
              className="w-9 h-9 rounded-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center shadow-md shadow-primary/25 cursor-pointer transition-transform hover:scale-105 active:scale-95 shrink-0"
              title="Add event for this date"
            >
              <FiPlus size={18} />
            </button>
          </div>

          <hr className="border-gray-200/80 dark:border-zinc-800 my-1" />

          {/* Items List */}
          <div className="flex flex-col gap-3.5 overflow-y-auto max-h-[580px] pr-1">
            {/* 1. Birthdays on Selected Day */}
            {selectedDateBirthdays.map((b) => (
              <div
                key={b.userId}
                className="bg-white dark:bg-zinc-900 rounded-2xl p-4.5 border border-amber-200/80 dark:border-amber-800/50 shadow-xs relative overflow-hidden flex flex-col gap-2.5 transition-all hover:shadow-md"
              >
                {/* Amber vertical accent bar on left edge */}
                <div className="absolute left-0 top-3 bottom-3 w-1.5 rounded-r-full bg-amber-400" />

                <div className="pl-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🎂</span>
                      <h4 className="font-bold text-base text-gray-900 dark:text-white leading-snug">
                        {b.fullName}&apos;s Birthday
                      </h4>
                    </div>

                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                      {b.role}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-zinc-400 flex items-center gap-1.5">
                    <LuCake className="text-amber-500" size={14} />
                    {b.age ? `Turning ${b.age} years old today! 🎉` : "Birthday Celebration"}
                  </p>

                  <div className="flex items-center gap-2 pt-1 text-xs text-gray-400 dark:text-zinc-500">
                    <LuUserCheck size={14} className="text-gray-400" />
                    <span>Gym {b.role}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* 2. Scheduled Events on Selected Day */}
            {selectedDateEvents.map((event) => {
              const visConfig =
                VISIBILITY_CONFIG[event.visibility] || VISIBILITY_CONFIG.all;

              return (
                <div
                  key={event._id || event.eventId}
                  className="bg-white dark:bg-zinc-900 rounded-2xl p-4.5 border border-gray-100 dark:border-zinc-800 shadow-xs relative overflow-hidden flex flex-col gap-2.5 transition-all hover:shadow-md group"
                >
                  {/* Vertical accent bar on left edge matching visibility */}
                  <div
                    className={`absolute left-0 top-3 bottom-3 w-1.5 rounded-r-full ${visConfig.borderAccent}`}
                  />

                  <div className="pl-3 flex flex-col gap-2">
                    {/* Top Row: Title + Action Icons */}
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-base text-gray-900 dark:text-white leading-snug">
                        {event.title}
                      </h4>

                      <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleEditEvent(event)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                          aria-label="Edit event"
                          title="Edit event"
                        >
                          <LuPencil size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEventToDelete(event);
                            setOpenDeleteModal(true);
                          }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          aria-label="Delete event"
                          title="Delete event"
                        >
                          <LuTrash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Visibility Chip */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider border ${visConfig.badgeBg} ${visConfig.badgeText} ${visConfig.badgeBorder}`}
                      >
                        {visConfig.label}
                      </span>
                    </div>

                    {/* Description */}
                    {event.description && (
                      <p className="text-sm text-gray-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                        {event.description}
                      </p>
                    )}

                    {/* Footer: Time & Details */}
                    <div className="flex items-center gap-4 pt-1 text-xs font-semibold text-gray-500 dark:text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <LuClock size={14} className="text-gray-400" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <LuMapPin size={13} />
                        <span>Fitness Center</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Empty State when no events or birthdays on this day */}
            {totalDayItems === 0 && (
              <div className="flex flex-col items-center justify-center p-8 text-center gap-3 bg-white/60 dark:bg-zinc-900/60 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-800">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 flex items-center justify-center">
                  <LuCalendarDays size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 dark:text-zinc-200">
                    No events scheduled
                  </h4>
                  <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">
                    No activities or workshops on this date.
                  </p>
                </div>
                
              </div>
            )}
          </div>
        </Container>
      </div>

      {/* Create / Edit Event Modal */}
      <EventForm
        open={openForm}
        onClose={handleCloseEventForm}
        isEdit={isEdit}
        currentEvent={currentEvent}
        eventData={eventData}
        setEventData={setEventData}
        onSuccess={() => {
          handleCloseEventForm();
        }}
      />

      {/* Delete Event Confirmation Modal */}
      <DeleteModal
        open={openDeleteModal}
        loading={isDeleting}
        onClose={() => {
          setOpenDeleteModal(false);
          setEventToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        inActiveBtn={true}
        inActiveConfirm={handleSoftDelete}
        title="Delete Event"
        content={`Are you sure you want to delete "${eventToDelete?.title || "this event"}"? You can deactivate it or permanently delete it.`}
      />
    </div>
  );
};

export default EventsCalendar;
