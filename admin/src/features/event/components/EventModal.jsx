import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { LuX, LuCalendar, LuClock, LuMapPin, LuEye, LuAlignLeft } from "react-icons/lu";
import { motion, AnimatePresence } from "motion/react";
import ButtonPrimary from "@/shared/components/ui/form/button/ButtonPrimary";

const EventModal = ({
  isOpen,
  onClose,
  selectedDate,
  eventToEdit,
  onSave
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [visibility, setVisibility] = useState("all");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form based on add/edit mode
  useEffect(() => {
    if (isOpen) {
      if (eventToEdit) {
        setName(eventToEdit.name || "");
        setDescription(eventToEdit.description || "");
        setDate(dayjs(eventToEdit.date).format("YYYY-MM-DD"));
        setTime(eventToEdit.time || "");
        setLocation(eventToEdit.location || "");
        setVisibility(eventToEdit.visibility || "all");
      } else {
        setName("");
        setDescription("");
        setDate(selectedDate ? selectedDate.format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"));
        setTime("09:00 AM");
        setLocation("");
        setVisibility("all");
      }
    }
  }, [isOpen, eventToEdit, selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !date || !time) return;

    setIsSubmitting(true);
    
    // Convert local YYYY-MM-DD to ISO 8601 string
    const eventDate = dayjs(date).toISOString();

    const eventData = {
      name: name.trim(),
      description: description.trim() || null,
      date: eventDate,
      time: time.trim(),
      location: location.trim() || null,
      visibility
    };

    const success = await onSave(eventData);
    setIsSubmitting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 font-montserrat p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="bg-white rounded-3xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col relative z-10 max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  {eventToEdit ? "Edit Gym Event" : "Create New Event"}
                </h3>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                  {eventToEdit ? `Modifying ID: ${eventToEdit.eventID}` : "Add schedule to community calendar"}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <LuX className="w-4 h-4" />
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Event Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Event Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. CrossFit Summer Open"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder:text-slate-400 font-semibold text-slate-800"
                />
              </div>

              {/* Grid Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <LuCalendar className="w-3.5 h-3.5 text-indigo-500" />
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <LuClock className="w-3.5 h-3.5 text-indigo-500" />
                    Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 09:00 AM"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 font-semibold"
                  />
                </div>
              </div>

              {/* Target Visibility & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <LuEye className="w-3.5 h-3.5 text-indigo-500" />
                    Target Audience *
                  </label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 font-semibold"
                  >
                    <option value="all">Public (All)</option>
                    <option value="members">Members Only</option>
                    <option value="trainer">Trainers Only</option>
                    <option value="private">Private (VIP)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <LuMapPin className="w-3.5 h-3.5 text-emerald-500" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Studio Room A / Zoom Link"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 font-semibold"
                  />
                </div>
              </div>

              {/* Event Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <LuAlignLeft className="w-3.5 h-3.5 text-indigo-500" />
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter event details, requirements, or instructions..."
                  className="w-full h-24 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 font-semibold resize-none placeholder:text-slate-400"
                />
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl transition-all cursor-pointer bg-white"
                >
                  Cancel
                </button>
                <ButtonPrimary
                  type="submit"
                  loading={isSubmitting}
                  loadingText={eventToEdit ? "Saving Changes..." : "Creating Event..."}
                  className="px-5 py-2.5 text-xs font-bold rounded-xl shadow-md cursor-pointer bg-linear-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 transition-all text-white border-0"
                >
                  {eventToEdit ? "Save Changes" : "Create Event"}
                </ButtonPrimary>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EventModal;
