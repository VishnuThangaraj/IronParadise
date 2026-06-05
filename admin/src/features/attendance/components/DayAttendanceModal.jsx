import { useState, useMemo } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "motion/react";
import { LuX, LuCalendar, LuUser, LuClock, LuTimer } from "react-icons/lu";

const DayAttendanceModal = ({ isOpen, onClose, dateStr, dayLogs }) => {
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'member', 'trainer'

  const formattedDate = useMemo(() => {
    if (!dateStr) return "";
    return format(new Date(dateStr), "EEEE, MMMM d, yyyy");
  }, [dateStr]);

  const { members, trainers, all } = useMemo(() => {
    if (!dayLogs) return { members: [], trainers: [], all: [] };
    
    const membersList = dayLogs.filter(log => log.userType === "member");
    const trainersList = dayLogs.filter(log => log.userType === "trainer");
    
    return {
      members: membersList,
      trainers: trainersList,
      all: dayLogs
    };
  }, [dayLogs]);

  const displayedLogs = useMemo(() => {
    if (activeTab === "member") return members;
    if (activeTab === "trainer") return trainers;
    return all;
  }, [activeTab, members, trainers, all]);

  // Helper to format iso date string to time
  const formatTime = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 font-montserrat p-4 sm:p-6">
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
            className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col relative z-10 max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-5 bg-linear-to-r from-slate-50 to-white border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 shadow-sm border border-indigo-100/50">
                  <LuCalendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Daily Attendance Logs
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                    {formattedDate} • {all.length} Total Check-Ins
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 bg-slate-50 hover:bg-slate-200 rounded-xl text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <LuX className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs & Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* Tab Navigation */}
              <div className="flex items-center px-6 pt-4 pb-2 gap-4 border-b border-slate-100 shrink-0">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`pb-3 px-1 text-xs font-bold transition-all border-b-2 ${
                    activeTab === "all" 
                      ? "border-indigo-500 text-indigo-600" 
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  } cursor-pointer flex items-center gap-1.5`}
                >
                  All Users <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md text-[9px]">{all.length}</span>
                </button>
                <button
                  onClick={() => setActiveTab("member")}
                  className={`pb-3 px-1 text-xs font-bold transition-all border-b-2 ${
                    activeTab === "member" 
                      ? "border-blue-500 text-blue-600" 
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  } cursor-pointer flex items-center gap-1.5`}
                >
                  Members <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-md text-[9px]">{members.length}</span>
                </button>
                <button
                  onClick={() => setActiveTab("trainer")}
                  className={`pb-3 px-1 text-xs font-bold transition-all border-b-2 ${
                    activeTab === "trainer" 
                      ? "border-purple-500 text-purple-600" 
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  } cursor-pointer flex items-center gap-1.5`}
                >
                  Trainers <span className="bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded-md text-[9px]">{trainers.length}</span>
                </button>
              </div>

              {/* Logs List Container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-slate-50/50">
                {displayedLogs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
                    <LuUser className="w-12 h-12 text-slate-300 mb-3" />
                    <h4 className="text-sm font-bold text-slate-600">No logs found</h4>
                    <p className="text-xs font-medium text-slate-400 mt-1 max-w-[200px]">
                      No one checked in matching this filter on this day.
                    </p>
                  </div>
                ) : (
                  displayedLogs.map((log) => (
                    <div 
                      key={log._id || log.userId} 
                      className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm shadow-slate-200/50 hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      {/* User Info */}
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 ${
                          log.userType === "trainer" ? "bg-purple-500 shadow-purple-200" : "bg-blue-500 shadow-blue-200"
                        } shadow-md`}>
                          {log.userName ? log.userName.charAt(0).toUpperCase() : <LuUser className="w-5 h-5" />}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">{log.userName || log.userId}</h4>
                          <span
                            className={`inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                              log.userType === "trainer"
                                ? "text-purple-700 bg-purple-50"
                                : "text-blue-700 bg-blue-50"
                            }`}
                          >
                            {log.userType}
                          </span>
                        </div>
                      </div>

                      {/* Sessions Info */}
                      <div className="flex flex-col gap-1.5 bg-slate-50 rounded-xl p-2.5 sm:min-w-[220px]">
                        {log.records?.map((rec, idx) => (
                          <div key={idx} className="flex items-center justify-between text-[10px] font-bold text-slate-600">
                            <div className="flex items-center gap-1">
                              <LuClock className="w-3 h-3 text-emerald-500" />
                              <span>{formatTime(rec.checkIn)}</span>
                            </div>
                            <span className="text-slate-300 mx-1">→</span>
                            <div className="flex items-center gap-1">
                              {rec.checkOut ? (
                                <>
                                  <LuClock className="w-3 h-3 text-rose-400" />
                                  <span>{formatTime(rec.checkOut)}</span>
                                </>
                              ) : (
                                <span className="text-amber-500 px-1 py-0.5 bg-amber-50 rounded">Active</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Total Duration */}
                      <div className="flex items-center gap-2 sm:flex-col sm:items-end justify-between sm:justify-center border-t border-slate-100 sm:border-t-0 sm:border-l sm:pl-4 pt-3 sm:pt-0 mt-1 sm:mt-0">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total</span>
                        <div className="flex items-center gap-1 text-slate-700 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100/50">
                          <LuTimer className="w-3 h-3 text-indigo-500" />
                          <span className="text-xs font-bold">{Math.round(log.totalMinutes || 0)}m</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DayAttendanceModal;
