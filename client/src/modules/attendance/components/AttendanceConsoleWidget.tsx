import { useState } from "react";
import {
  LuActivity,
  LuSearch,
  LuX,
  LuDumbbell,
  LuLogIn,
  LuLogOut,
  LuClock,
  LuLoader,
} from "react-icons/lu";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import Container from "@/shared/components/ui/containers/Container";
import Button from "@/shared/components/ui/buttons/Button";
import Chip from "@/shared/components/ui/chip/Chip";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useToast } from "@/shared/components/ui/toast";

import {
  searchKioskUsers,
  checkInUser,
  checkOutUser,
} from "../api/attendance.api";
import type { KioskUser, AttendanceRecord } from "../types/attendance.types";

const getInitial = (name?: string): string => {
  if (!name || !name.trim()) return "U";
  return name.trim().charAt(0).toUpperCase();
};

const formatTime = (dateStr?: string | null): string => {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

const AttendanceConsoleWidget = () => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<KioskUser | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Search active members and trainers
  const {
    data: searchResults = [],
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["kiosk-search-users", debouncedSearchTerm],
    queryFn: () => searchKioskUsers(debouncedSearchTerm),
    enabled: debouncedSearchTerm.trim().length > 0 && !selectedUser,
    staleTime: 5000,
  });

  const invalidateAttendanceQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["kiosk-search-users"] });
    queryClient.invalidateQueries({ queryKey: ["attendance-kpi"] });
    queryClient.invalidateQueries({ queryKey: ["attendance-monthly"] });
  };

  // Check-In Mutation
  const checkInMutation = useMutation({
    mutationFn: (userId: string) =>
      checkInUser({ userId, entryMethod: "manual" }),
    onSuccess: (data: AttendanceRecord) => {
      invalidateAttendanceQueries();
      if (selectedUser) {
        setSelectedUser({
          ...selectedUser,
          isCheckedIn: true,
          todayAttendance: {
            attendanceId: data.attendanceId,
            checkIn: data.checkIn,
            checkOut: null,
            status: data.status,
            durationMinutes: 0,
          },
        });
      }
      addToast({
        type: "success",
        message: `${selectedUser?.fullName || "User"} checked in at ${formatTime(
          data.checkIn,
        )}.`,
      });
    },
    onError: (err: unknown) => {
      let message = "Check-in failed. Please try again.";
      if (
        isAxiosError<{ message?: string }>(err) &&
        err.response?.data?.message
      ) {
        message = err.response.data.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      addToast({ type: "error", message });
    },
  });

  // Check-Out Mutation
  const checkOutMutation = useMutation({
    mutationFn: (userId: string) =>
      checkOutUser({ userId, entryMethod: "manual" }),
    onSuccess: (data: AttendanceRecord) => {
      invalidateAttendanceQueries();
      if (selectedUser) {
        setSelectedUser({
          ...selectedUser,
          isCheckedIn: false,
          todayAttendance: {
            attendanceId: data.attendanceId,
            checkIn: data.checkIn,
            checkOut: data.checkOut,
            status: data.status,
            durationMinutes: data.durationMinutes || 0,
          },
        });
      }
      addToast({
        type: "success",
        message: `${selectedUser?.fullName || "User"} checked out (${data.durationMinutes || 0} mins workout).`,
      });
    },
    onError: (err: unknown) => {
      let message = "Check-out failed. Please try again.";
      if (
        isAxiosError<{ message?: string }>(err) &&
        err.response?.data?.message
      ) {
        message = err.response.data.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      addToast({ type: "error", message });
    },
  });

  const handleSelectUser = (user: KioskUser) => {
    setSelectedUser(user);
    setSearchTerm(user.fullName);
  };

  const handleClear = () => {
    setSearchTerm("");
    setSelectedUser(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (selectedUser) {
      setSelectedUser(null);
    }
  };

  const handleCheckIn = () => {
    if (!selectedUser || checkInMutation.isPending || checkOutMutation.isPending) return;
    checkInMutation.mutate(selectedUser.userId);
  };

  const handleCheckOut = () => {
    if (!selectedUser || checkInMutation.isPending || checkOutMutation.isPending) return;
    checkOutMutation.mutate(selectedUser.userId);
  };

  return (
    <Container
      variant="secondary"
      className="p-5 sm:p-6 flex flex-col gap-5 w-full h-full max-w-none"
    >
      {/* 1. Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <LuActivity className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Check In / Check Out
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Select a member or trainer to register their arrival or departure.
        </p>
      </div>

      {/* 2. Search Input */}
      <div className="relative">
        <div className="relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
          <LuSearch className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Search member or trainer name..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none font-medium"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <LuX className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live Search Results Dropdown */}
        {debouncedSearchTerm.trim().length > 0 && !selectedUser && (
          <div className="absolute top-full left-0 right-0 mt-2 z-30 max-h-60 overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl divide-y divide-slate-100 dark:divide-slate-800/70 p-1">
            {isFetching ? (
              <div className="py-6 flex items-center justify-center gap-2 text-slate-400 text-xs">
                <LuLoader className="w-4 h-4 animate-spin text-indigo-500" />
                <span>Searching users...</span>
              </div>
            ) : isError ? (
              <div className="py-4 px-3 text-center text-xs text-rose-500">
                Failed to search users.
              </div>
            ) : searchResults.length === 0 ? (
              <div className="py-6 px-3 text-center text-xs text-slate-500">
                No active users found matching &ldquo;{debouncedSearchTerm}&rdquo;
              </div>
            ) : (
              searchResults.map((user) => (
                <div
                  key={user._id || user.userId}
                  onClick={() => handleSelectUser(user)}
                  className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.fullName}
                        className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {getInitial(user.fullName)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {user.fullName}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {user.role === "trainer" ? "Trainer" : "Member"} •{" "}
                        {user.userId}
                      </p>
                    </div>
                  </div>

                  <Chip
                    variant={user.isCheckedIn ? "active" : "gray"}
                    size="xs"
                    dot={user.isCheckedIn}
                    label={user.isCheckedIn ? "In" : "Offline"}
                  />
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* 3. Main Action or Idle Card */}
      {selectedUser ? (
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 space-y-4 shadow-xs">
          {/* User Row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {selectedUser.profileImage ? (
                <img
                  src={selectedUser.profileImage}
                  alt={selectedUser.fullName}
                  className="w-11 h-11 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                />
              ) : (
                <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                  {getInitial(selectedUser.fullName)}
                </div>
              )}
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                  {selectedUser.fullName}
                </h3>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                  {selectedUser.role === "trainer" ? "TRAINER" : "MEMBER"} •{" "}
                  {selectedUser.userId}
                </p>
              </div>
            </div>

            <Chip
              variant={selectedUser.isCheckedIn ? "active" : "gray"}
              size="xs"
              dot={selectedUser.isCheckedIn}
              label={selectedUser.isCheckedIn ? "CHECKED IN" : "OFFLINE"}
            />
          </div>

          {/* Active Session time indicator */}
          {selectedUser.isCheckedIn && (
            <div className="rounded-xl p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 flex items-center justify-between text-xs font-medium">
              <div className="flex items-center gap-2">
                <LuClock className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>
                  Active session since{" "}
                  <strong>
                    {formatTime(
                      selectedUser.todayAttendance?.checkIn ||
                        new Date().toISOString(),
                    )}
                  </strong>
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-600 dark:text-indigo-300">
                IN GYM
              </span>
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-2 pt-1">
            {!selectedUser.isCheckedIn ? (
              <Button
                variant="green-dark"
                size="md"
                type="button"
                loading={checkInMutation.isPending}
                disabled={checkInMutation.isPending}
                onClick={handleCheckIn}
                className="w-full flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-xs py-3 rounded-xl cursor-pointer"
              >
                <LuLogIn className="w-4 h-4" />
                <span>CHECK IN</span>
              </Button>
            ) : (
              <Button
                variant="red-dark"
                size="md"
                type="button"
                loading={checkOutMutation.isPending}
                disabled={checkOutMutation.isPending}
                onClick={handleCheckOut}
                className="w-full flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-xs py-3 rounded-xl cursor-pointer"
              >
                <LuLogOut className="w-4 h-4" />
                <span>CHECK OUT</span>
              </Button>
            )}

            <Button
              variant="secondary"
              size="xs"
              type="button"
              onClick={handleClear}
              className="w-full py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              Clear / Select Another
            </Button>
          </div>
        </div>
      ) : (
        /* Console Idle Box (Exact match to Image 1) */
        <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center text-center gap-3 bg-slate-50/40 dark:bg-slate-900/30">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400 dark:text-slate-500">
            <LuDumbbell className="w-6 h-6 stroke-1.5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Console Idle
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-[200px] mt-1 leading-relaxed">
              Search above and select a user to check them in or out.
            </p>
          </div>
        </div>
      )}
    </Container>
  );
};

export default AttendanceConsoleWidget;
