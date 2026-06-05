import { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { 
  LuSearch, 
  LuUsers, 
  LuTimer, 
  LuCalendar, 
  LuLogIn, 
  LuLogOut, 
  LuUser, 
  LuDumbbell, 
  LuFlame, 
  LuActivity,
  LuDatabase
} from "react-icons/lu";

import api from "@/service/api";
import { selectToken } from "@/features/auth/redux/authSelector";
import AttendanceCalendar from "../components/AttendanceCalendar";

const Attendance = () => {
  const token = useSelector(selectToken);
  
  // State for autocomplete/search console
  const [users, setUsers] = useState([]); // Combined members and trainers
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserStatus, setSelectedUserStatus] = useState("absent");
  const [selectedUserRecord, setSelectedUserRecord] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // State for dashboard summary
  const [summary, setSummary] = useState({
    currentlyCheckedIn: 0,
    totalCheckInsToday: 0,
    averageDurationMinutes: 0
  });

  // State for logs list
  const [logs, setLogs] = useState([]);
  const [isLogsLoading, setIsLogsLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 7); // YYYY-MM
  });

  const [isPopulating, setIsPopulating] = useState(false);

  // Function to populate logs
  const handlePopulateLogs = async () => {
    if (!token) return;
    setIsPopulating(true);
    try {
      const res = await api.get("attendance/populate", {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(res.data?.message || "Attendance logs seeded successfully!");
      fetchSummary();
      fetchLogs();
    } catch (err) {
      const errMsg = err.response?.data?.detail || "Failed to seed logs";
      toast.error(errMsg);
    } finally {
      setIsPopulating(false);
    }
  };

  // Fetch all members and trainers for search
  const fetchUsers = useCallback(async () => {
    if (!token) return;
    try {
      const [membersRes, trainersRes] = await Promise.all([
        api.get("member/all", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("trainer/all", { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const formattedMembers = (membersRes.data || []).map(m => ({
        id: m.memberId,
        name: m.name,
        email: m.email,
        mobile: m.mobile,
        type: "member",
        subtext: `Member • ID: ${m.memberId}`
      }));

      const formattedTrainers = (trainersRes.data || []).map(t => ({
        id: t.trainerID,
        name: t.name,
        email: t.email,
        mobile: t.mobile,
        type: "trainer",
        subtext: `Trainer • ID: ${t.trainerID}`
      }));

      setUsers([...formattedMembers, ...formattedTrainers]);
    } catch (err) {
      console.error("Failed to load users for attendance search", err);
    }
  }, [token]);

  // Fetch summary
  const fetchSummary = useCallback(async () => {
    if (!token) return;
    try {
      const res = await api.get("attendance/summary", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSummary(res.data || { currentlyCheckedIn: 0, totalCheckInsToday: 0, averageDurationMinutes: 0 });
    } catch (err) {
      console.error("Failed to load summary", err);
    }
  }, [token]);

  // Fetch logs
  const fetchLogs = useCallback(async () => {
    if (!token) return;
    setIsLogsLoading(true);
    try {
      const res = await api.get("attendance/logs", {
        params: {
          month: filterMonth
        },
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(res.data || []);
    } catch (err) {
      console.error("Failed to load logs", err);
      toast.error("Failed to load attendance logs");
    } finally {
      setIsLogsLoading(false);
    }
  }, [token, filterMonth]);

  // Fetch specific user's status when selected
  const fetchSelectedUserStatus = useCallback(async (userId) => {
    if (!token || !userId) return;
    try {
      const res = await api.get(`attendance/status/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedUserStatus(res.data.status);
      setSelectedUserRecord(res.data.lastRecord);
    } catch (err) {
      console.error("Failed to load user status", err);
    }
  }, [token]);

  // Initialize
  useEffect(() => {
    if (token) {
      fetchUsers();
      fetchSummary();
      fetchLogs();
    }
  }, [token, fetchUsers, fetchSummary, fetchLogs]);

  // Refetch logs when filterMonth changes
  useEffect(() => {
    if (token) {
      fetchLogs();
    }
  }, [token, filterMonth, fetchLogs]);

  // Filtered dropdown users based on query
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return users.filter(
      u =>
        u.name.toLowerCase().includes(query) ||
        u.id.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        u.mobile.includes(query)
    );
  }, [users, searchQuery]);

  // Handle checking in
  const handleCheckIn = async () => {
    if (!selectedUser || !token) return;
    setIsActionLoading(true);
    try {
      const res = await api.post(
        "attendance/check-in",
        {
          userId: selectedUser.id,
          userType: selectedUser.type
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data?.message || "Checked in successfully!");
      
      // Update local state
      await fetchSelectedUserStatus(selectedUser.id);
      fetchSummary();
      fetchLogs();
    } catch (err) {
      const errMsg = err.response?.data?.detail || "Check-in failed";
      toast.error(errMsg);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Handle checking out
  const handleCheckOut = async () => {
    if (!selectedUser || !token) return;
    setIsActionLoading(true);
    try {
      const res = await api.post(
        "attendance/check-out",
        {
          userId: selectedUser.id,
          userType: selectedUser.type
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data?.message || "Checked out successfully!");
      
      // Update local state
      await fetchSelectedUserStatus(selectedUser.id);
      fetchSummary();
      fetchLogs();
    } catch (err) {
      const errMsg = err.response?.data?.detail || "Check-out failed";
      toast.error(errMsg);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Helper to format dates & times for records
  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 font-montserrat">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold bg-linear-to-r from-slate-800 to-indigo-900 bg-clip-text text-transparent">
            Gym Attendance Console
          </h1>
          <p className="text-xs font-medium text-slate-500">
            Scan cards, register entries/exits, and track live occupancy in real-time.
          </p>
        </div>
        <button
          onClick={handlePopulateLogs}
          disabled={isPopulating}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all duration-250 cursor-pointer self-start sm:self-auto"
        >
          <LuDatabase className="w-3.5 h-3.5" />
          <span>{isPopulating ? "Seeding..." : "Populate Logs"}</span>
        </button>
      </div>

      {/* Dashboard Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Live Occupancy */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-lg shadow-slate-200/50 flex items-center gap-4 hover:border-rose-100 transition-all duration-300">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
            <LuFlame className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live Occupancy</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{summary.currentlyCheckedIn}</h3>
            <p className="text-[10px] text-slate-400 font-medium">Currently active inside</p>
          </div>
        </div>

        {/* Card 2: Total Checkins */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-lg shadow-slate-200/50 flex items-center gap-4 hover:border-indigo-100 transition-all duration-300">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
            <LuUsers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Check-Ins</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{summary.totalCheckInsToday}</h3>
            <p className="text-[10px] text-slate-400 font-medium">Recorded logs today</p>
          </div>
        </div>

        {/* Card 3: Avg Workout Duration */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-lg shadow-slate-200/50 flex items-center gap-4 hover:border-teal-100 transition-all duration-300">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-500">
            <LuTimer className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg. Session Time</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{summary.averageDurationMinutes}m</h3>
            <p className="text-[10px] text-slate-400 font-medium">Minutes spent on average</p>
          </div>
        </div>
      </div>

      {/* Main split dashboard content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left column: Quick Actions / Checkin check-out console */}
        <div className="md:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-lg shadow-slate-200/50 space-y-6">
          <div className="space-y-1.5">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <LuActivity className="w-4 h-4 text-indigo-500" /> Check In / Check Out
            </h2>
            <p className="text-[11px] font-medium text-slate-400">
              Select a member or trainer to register their arrival or departure.
            </p>
          </div>

          {/* Autocomplete Input Container */}
          <div className="relative">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <LuSearch className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsDropdownOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                placeholder="Search member or trainer name..."
                className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-50/50 border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
              />
            </div>

            {/* Dropdown list */}
            {isDropdownOpen && searchQuery.trim() && (
              <div className="absolute z-30 mt-1 w-full max-h-52 overflow-y-auto bg-white border border-slate-150 rounded-xl shadow-xl divide-y divide-slate-100">
                {filteredUsers.length === 0 ? (
                  <div className="p-3 text-[11px] font-semibold text-slate-400 text-center">
                    No results found
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        setSelectedUser(user);
                        setSearchQuery("");
                        setIsDropdownOpen(false);
                        fetchSelectedUserStatus(user.id);
                      }}
                      className="w-full text-left p-3 hover:bg-slate-50/70 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-slate-700">{user.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{user.subtext}</span>
                      </div>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          user.type === "trainer"
                            ? "text-purple-700 bg-purple-50"
                            : "text-blue-700 bg-blue-50"
                        }`}
                      >
                        {user.type}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Selected user console card */}
          {selectedUser ? (
            <div className="border border-slate-150 rounded-xl p-4 space-y-4 bg-slate-50/50 animate-fade-in">
              {/* Profile card summary */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${
                  selectedUser.type === "trainer" ? "bg-purple-500 shadow-purple-200" : "bg-indigo-500 shadow-indigo-200"
                } shadow-md`}>
                  <LuUser className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 truncate">{selectedUser.name}</h4>
                  <p className="text-[10px] text-slate-400 font-medium truncate">{selectedUser.email}</p>
                </div>
                <span
                  className={`text-[9px] font-bold px-2.5 py-0.5 rounded-md border uppercase tracking-wider ${
                    selectedUser.type === "trainer"
                      ? "text-purple-700 bg-purple-50 border-purple-150"
                      : "text-blue-700 bg-blue-50 border-blue-150"
                  }`}
                >
                  {selectedUser.type}
                </span>
              </div>

              {/* Status details info */}
              <div className="bg-white border border-slate-100 rounded-lg p-3 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status Today</span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border uppercase tracking-wider flex items-center gap-1 ${
                    selectedUserStatus === "checked-in"
                      ? "text-emerald-700 bg-emerald-50 border-emerald-150"
                      : selectedUserStatus === "checked-out"
                      ? "text-amber-700 bg-amber-50 border-amber-150"
                      : "text-slate-500 bg-slate-50 border-slate-150"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    selectedUserStatus === "checked-in" ? "bg-emerald-500" : selectedUserStatus === "checked-out" ? "bg-amber-500" : "bg-slate-400"
                  }`} />
                  {selectedUserStatus === "checked-in"
                    ? "Checked In"
                    : selectedUserStatus === "checked-out"
                    ? "Checked Out"
                    : "Absent"}
                </span>
              </div>

              {/* Display recent sessions inside checkout card */}
              {selectedUserRecord && selectedUserRecord.records && selectedUserRecord.records.length > 0 && (
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Today's Visits</p>
                  <div className="max-h-24 overflow-y-auto space-y-1">
                    {selectedUserRecord.records.map((rec, idx) => (
                      <div key={idx} className="bg-white text-[10px] text-slate-500 font-semibold px-2.5 py-1.5 rounded-lg border border-slate-100 flex items-center justify-between">
                        <span>Check-In: {formatTime(rec.checkIn)}</span>
                        <span>Check-Out: {rec.checkOut ? formatTime(rec.checkOut) : "Active"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Main Action buttons */}
              <div className="flex gap-2">
                {selectedUserStatus === "checked-in" ? (
                  <button
                    onClick={handleCheckOut}
                    disabled={isActionLoading}
                    className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                  >
                    <LuLogOut className="w-4 h-4" />
                    <span>Check Out</span>
                  </button>
                ) : (
                  <button
                    onClick={handleCheckIn}
                    disabled={isActionLoading}
                    className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                  >
                    <LuLogIn className="w-4 h-4" />
                    <span>Check In</span>
                  </button>
                )}
                
                <button
                  onClick={() => {
                    setSelectedUser(null);
                    setSelectedUserStatus("absent");
                    setSelectedUserRecord(null);
                  }}
                  className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center flex flex-col items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                <LuDumbbell className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-slate-600">Console Idle</h4>
              <p className="text-[10px] text-slate-400 font-medium max-w-[180px]">
                Search above and select a user to check them in or out.
              </p>
            </div>
          )}
        </div>

        {/* Right column: Calendar View */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-lg shadow-slate-200/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 font-montserrat">
            <div className="flex flex-col gap-1">
              <h2 className="text-sm font-bold text-slate-800">Monthly Calendar View</h2>
              <p className="text-[11px] font-medium text-slate-400">
                View check-ins dynamically across the month
              </p>
            </div>

            {/* Filter: Month selector */}
            <div className="flex items-center gap-2">
              <div className="relative flex items-center">
                <span className="absolute left-2.5 text-slate-400 pointer-events-none">
                  <LuCalendar className="w-3.5 h-3.5" />
                </span>
                <input
                  type="month"
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  className="pl-8 pr-2.5 py-1.5 text-[11px] font-bold text-slate-600 bg-slate-50/50 border border-slate-200 rounded-lg outline-hidden focus:border-indigo-500 cursor-pointer transition-colors"
                />
              </div>
            </div>
          </div>

          <div className={isLogsLoading ? "opacity-50 pointer-events-none transition-opacity" : "transition-opacity"}>
            <AttendanceCalendar
              logs={logs}
              selectedUser={selectedUser}
              currentMonthStr={filterMonth}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
