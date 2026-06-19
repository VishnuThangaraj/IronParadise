import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Paper } from "@mui/material";
import { 
  LuSearch, 
  LuLogIn, 
  LuLogOut, 
  LuUser, 
  LuArrowLeft 
} from "react-icons/lu";

import { fadeUp, fadeIn } from "@/shared/animations";
import useAttendanceKiosk from "../hooks/useAttendanceKiosk";
import KioskMeasurementModal from "../components/KioskMeasurementModal";

const MotionPaper = motion.create(Paper);

const AttendanceKioskPage = () => {
  const {
    searchQuery,
    setSearchQuery,
    isDropdownOpen,
    setIsDropdownOpen,
    selectedUser,
    setSelectedUser,
    selectedUserStatus,
    isActionLoading,
    isPageLoading,
    filteredUsers,
    handleCheckIn,
    handleCheckOut,
    clearSelection,
    fetchSelectedUserStatus,
    showMeasurementModal,
    setShowMeasurementModal,
    handleSaveMeasurement
  } = useAttendanceKiosk();

  return (
    <motion.div
      {...fadeIn}
      className="relative flex flex-col justify-center items-center gap-5 bg-slate-950 w-full min-h-screen overflow-hidden font-montserrat"
    >
      {/* Dark overlay & blur blobs */}
      <div className="absolute inset-0 bg-linear-to-b from-slate-950/90 via-slate-950/85 to-indigo-950/90 pointer-events-none" />

      {/* Decorative Neon Glow Blobs */}
      <div className="top-1/4 left-1/4 absolute bg-indigo-500/10 blur-[100px] rounded-full w-80 h-80 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="right-1/4 bottom-1/4 absolute bg-purple-500/10 blur-[120px] rounded-full w-96 h-96 translate-x-1/2 translate-y-1/2 pointer-events-none" />

      {/* Back to Home Link */}
      <Link to="/home" className="top-6 left-6 z-20 absolute flex items-center gap-2 bg-slate-900/50 backdrop-blur-md px-4 py-2 border border-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
        <LuArrowLeft className="w-4 h-4" />
        <span className="font-bold text-xs uppercase tracking-wider">Back to Admin</span>
      </Link>

      {/* Logo */}
      <motion.div
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.1 }}
        className="z-10 relative flex flex-col justify-center items-center mb-2"
      >
        <img
          src="/images/logo_white.webp"
          alt="Iron Paradise"
          className="drop-shadow-[0_0_15px_rgba(99,102,241,0.25)] w-20 sm:w-24 h-20 sm:h-24 object-contain hover:scale-105 transition-transform duration-300"
        />
        <h1 className="mt-4 font-bold text-white text-xl sm:text-2xl tracking-wider">ATTENDANCE KIOSK</h1>
        <p className="opacity-80 mt-1 font-medium text-indigo-300 text-xs sm:text-sm uppercase tracking-widest">Iron Paradise Gym</p>
      </motion.div>

      <MotionPaper
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.2 }}
        sx={{
          py: { xs: 4, sm: 5 },
          px: { xs: 3, sm: 4 },
          borderRadius: "24px",
          bgcolor: "rgba(15, 23, 42, 0.75)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        }}
        className="z-10 relative w-[90%] max-w-lg"
        elevation={0}
      >
        {isPageLoading ? (
          <div className="flex flex-col justify-center items-center py-10">
            <div className="border-4 border-indigo-500 border-t-transparent rounded-full w-8 h-8 animate-spin"></div>
            <p className="mt-4 font-semibold text-slate-400 text-sm">Initializing Kiosk...</p>
          </div>
        ) : (
          <div className="flex flex-col">
            
            {/* Search Input Box */}
            <div className="relative mb-6">
              <div className="z-20 relative">
                <LuSearch className="top-1/2 left-4 absolute w-5 h-5 text-indigo-400 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, ID, or mobile..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsDropdownOpen(true);
                    if (!e.target.value) setSelectedUser(null);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  className="bg-slate-900/80 focus:bg-slate-900 shadow-inner py-4 pr-4 pl-12 border-2 border-slate-700/50 focus:border-indigo-500 rounded-2xl focus:outline-none w-full font-semibold text-white placeholder:text-slate-500 text-sm transition-all"
                />
                {searchQuery && (
                  <button 
                    onClick={clearSelection}
                    className="top-1/2 right-4 absolute bg-slate-800 px-2 py-1 rounded-md font-bold text-slate-400 hover:text-white text-xs -translate-y-1/2 cursor-pointer"
                  >
                    CLEAR
                  </button>
                )}
              </div>

              {/* Autocomplete Dropdown */}
              {isDropdownOpen && searchQuery && !selectedUser && (
                <div className="top-full left-0 z-30 absolute bg-slate-800 shadow-2xl mt-2 border border-slate-700 rounded-xl w-full max-h-64 overflow-hidden overflow-y-auto">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(u => (
                      <div 
                        key={u.id}
                        onClick={() => {
                          setSelectedUser(u);
                          setSearchQuery(u.name);
                          setIsDropdownOpen(false);
                          fetchSelectedUserStatus(u.id);
                        }}
                        className="flex justify-between items-center hover:bg-slate-700 p-3 border-slate-700/50 border-b transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold ${
                            u.type === 'trainer' ? 'bg-purple-500/80' : 'bg-blue-500/80'
                          }`}>
                            <LuUser className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-200 text-sm">{u.name}</p>
                            <p className="text-[10px] text-slate-400">{u.subtext}</p>
                          </div>
                        </div>
                        <div className="bg-slate-900 px-2 py-1 rounded font-mono text-[10px] text-slate-500">
                          {u.mobile}
                        </div>a
                      </div>
                    ))
                  ) : (
                    <div className="p-4 font-medium text-slate-400 text-sm text-center">
                      No matching user found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Selected User Action Console */}
            {selectedUser && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900/80 p-5 sm:p-6 border border-slate-700/50 rounded-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg ${
                      selectedUser.type === 'trainer' ? 'bg-purple-500 shadow-purple-500/20' : 'bg-blue-500 shadow-blue-500/20'
                    }`}>
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg leading-tight">{selectedUser.name}</h3>
                      <p className="mt-0.5 font-bold text-[11px] text-slate-400 uppercase tracking-wider">
                        {selectedUser.type} • {selectedUser.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="mb-1 font-bold text-[10px] text-slate-500 uppercase tracking-widest">Status</span>
                    {selectedUserStatus === "checked-in" ? (
                      <span className="flex items-center gap-1.5 bg-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)] px-3 py-1 border border-emerald-500/30 rounded-full font-bold text-emerald-400 text-xs uppercase tracking-wider">
                        <span className="bg-emerald-400 rounded-full w-1.5 h-1.5 animate-pulse"></span>
                        Active
                      </span>
                    ) : (
                      <span className="bg-slate-800 px-3 py-1 border border-slate-700 rounded-full font-bold text-slate-400 text-xs uppercase tracking-wider">
                        Offline
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleCheckIn}
                    disabled={selectedUserStatus === "checked-in" || isActionLoading}
                    className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
                      selectedUserStatus === "checked-in"
                        ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                        : "bg-emerald-500 hover:bg-emerald-400 text-slate-900 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] cursor-pointer"
                    }`}
                  >
                    <LuLogIn className="w-5 h-5" />
                    {isActionLoading && selectedUserStatus !== "checked-in" ? "Processing..." : "Check In"}
                  </button>

                  <button
                    onClick={handleCheckOut}
                    disabled={selectedUserStatus !== "checked-in" || isActionLoading}
                    className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
                      selectedUserStatus !== "checked-in"
                        ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                        : "bg-rose-500 hover:bg-rose-400 text-white shadow-[0_0_20px_rgba(244,63,94,0.2)] hover:shadow-[0_0_25px_rgba(244,63,94,0.4)] cursor-pointer"
                    }`}
                  >
                    <LuLogOut className="w-5 h-5" />
                    {isActionLoading && selectedUserStatus === "checked-in" ? "Processing..." : "Check Out"}
                  </button>
                </div>
              </motion.div>
            )}

            {!selectedUser && (
              <div className="opacity-60 py-8 text-center">
                <p className="mx-auto max-w-[250px] font-medium text-slate-400 text-xs">
                  Search your name or mobile number to record your attendance.
                </p>
              </div>
            )}
          </div>
        )}
      </MotionPaper>

      {/* Measurement Modal for Members */}
      <KioskMeasurementModal
        isOpen={showMeasurementModal}
        onClose={() => setShowMeasurementModal(false)}
        onSave={handleSaveMeasurement}
        userName={selectedUser?.name || ""}
      />
    </motion.div>
  );
};

export default AttendanceKioskPage;
