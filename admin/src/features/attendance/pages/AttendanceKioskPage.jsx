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
    fetchSelectedUserStatus
  } = useAttendanceKiosk();

  return (
    <motion.div
      {...fadeIn}
      className="relative flex flex-col items-center justify-center min-h-screen w-full gap-5 overflow-hidden bg-slate-950 font-montserrat"
    >
      {/* Dark overlay & blur blobs */}
      <div className="absolute inset-0 bg-linear-to-b from-slate-950/90 via-slate-950/85 to-indigo-950/90 pointer-events-none" />

      {/* Decorative Neon Glow Blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Back to Home Link */}
      <Link to="/home" className="absolute top-6 left-6 z-20 flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800 backdrop-blur-md">
        <LuArrowLeft className="w-4 h-4" />
        <span className="text-xs font-bold uppercase tracking-wider">Back to Admin</span>
      </Link>

      {/* Logo */}
      <motion.div
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.1 }}
        className="flex flex-col items-center justify-center relative z-10 mb-2"
      >
        <img
          src="/images/logo_white.webp"
          alt="Iron Paradise"
          className="w-20 h-20 sm:w-24 sm:h-24 object-contain hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(99,102,241,0.25)]"
        />
        <h1 className="text-white text-xl sm:text-2xl font-bold mt-4 tracking-wider">ATTENDANCE KIOSK</h1>
        <p className="text-indigo-300 text-xs sm:text-sm font-medium mt-1 uppercase tracking-widest opacity-80">Iron Paradise Gym</p>
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
        className="w-[90%] max-w-lg relative z-10"
        elevation={0}
      >
        {isPageLoading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 text-sm mt-4 font-semibold">Initializing Kiosk...</p>
          </div>
        ) : (
          <div className="flex flex-col">
            
            {/* Search Input Box */}
            <div className="relative mb-6">
              <div className="relative z-20">
                <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
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
                  className="w-full bg-slate-900/80 border-2 border-slate-700/50 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-slate-900 transition-all font-semibold text-sm shadow-inner"
                />
                {searchQuery && (
                  <button 
                    onClick={clearSelection}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white font-bold px-2 py-1 bg-slate-800 rounded-md cursor-pointer"
                  >
                    CLEAR
                  </button>
                )}
              </div>

              {/* Autocomplete Dropdown */}
              {isDropdownOpen && searchQuery && !selectedUser && (
                <div className="absolute top-full mt-2 left-0 w-full bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-30 max-h-64 overflow-y-auto overflow-hidden">
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
                        className="p-3 border-b border-slate-700/50 hover:bg-slate-700 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold ${
                            u.type === 'trainer' ? 'bg-purple-500/80' : 'bg-blue-500/80'
                          }`}>
                            <LuUser className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-200">{u.name}</p>
                            <p className="text-[10px] text-slate-400">{u.subtext}</p>
                          </div>
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded">
                          {u.mobile}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-slate-400 font-medium">
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
                className="bg-slate-900/80 border border-slate-700/50 rounded-2xl p-5 sm:p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg ${
                      selectedUser.type === 'trainer' ? 'bg-purple-500 shadow-purple-500/20' : 'bg-blue-500 shadow-blue-500/20'
                    }`}>
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white leading-tight">{selectedUser.name}</h3>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                        {selectedUser.type} • {selectedUser.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Status</span>
                    {selectedUserStatus === "checked-in" ? (
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Active
                      </span>
                    ) : (
                      <span className="bg-slate-800 text-slate-400 border border-slate-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
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
              <div className="text-center py-8 opacity-60">
                <p className="text-slate-400 text-xs font-medium max-w-[250px] mx-auto">
                  Search your name or mobile number to record your attendance.
                </p>
              </div>
            )}
          </div>
        )}
      </MotionPaper>
    </motion.div>
  );
};

export default AttendanceKioskPage;
