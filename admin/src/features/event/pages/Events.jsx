import { useState, useCallback } from "react";
import dayjs from "dayjs";
import { motion } from "motion/react";
import { LuCalendarDays } from "react-icons/lu";

import CalendarView from "../components/CalendarView";
import EventListPanel from "../components/EventListPanel";
import EventModal from "../components/EventModal";
import useEvents from "../hooks/useEvents";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

const Events = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);

  const {
    events,
    isLoading,
    fetchEvents,
    addEvent,
    editEvent,
    removeEvent
  } = useEvents();

  const handleMonthChange = useCallback((start, end) => {
    fetchEvents(start, end);
  }, [fetchEvents]);

  const handleAddEventClick = useCallback((date) => {
    setSelectedDate(date);
    setEventToEdit(null);
    setIsModalOpen(true);
  }, []);

  const handleEditEventClick = useCallback((event) => {
    setEventToEdit(event);
    setIsModalOpen(true);
  }, []);

  const handleSaveEvent = useCallback(async (eventData) => {
    if (eventToEdit) {
      const updated = await editEvent(eventToEdit.eventID, eventData);
      return !!updated;
    } else {
      const added = await addEvent(eventData);
      return !!added;
    }
  }, [eventToEdit, editEvent, addEvent]);

  const handleDeleteEvent = useCallback(async (eventId) => {
    await removeEvent(eventId);
  }, [removeEvent]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto space-y-6 pb-12 font-montserrat"
    >
      {/* Header Banner */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <LuCalendarDays className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-linear-to-r from-slate-800 to-indigo-900 bg-clip-text text-transparent">
              Event Management
            </h1>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Plan, schedule, and track fitness activities and gym workshops.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleAddEventClick(selectedDate)}
          className="px-5 py-2.5 text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-2 bg-linear-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 transition-all text-white border-0"
        >
          Add Gym Event
        </button>
      </motion.div>

      {/* Main Grid Content */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
      >
        {/* Calendar Grid Section */}
        <div className="lg:col-span-8 flex flex-col h-[520px]">
          <CalendarView
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            events={events}
            onMonthChange={handleMonthChange}
            isLoading={isLoading}
          />
        </div>

        {/* Selected Day Event List Section */}
        <div className="lg:col-span-4 flex flex-col h-[520px]">
          <EventListPanel
            selectedDate={selectedDate}
            events={events}
            onAddEventClick={handleAddEventClick}
            onEditEventClick={handleEditEventClick}
            onDeleteEventClick={handleDeleteEvent}
          />
        </div>
      </motion.div>

      {/* Add / Edit Form Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        eventToEdit={eventToEdit}
        onSave={handleSaveEvent}
      />
    </motion.div>
  );
};

export default Events;
