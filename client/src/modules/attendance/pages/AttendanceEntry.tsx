import { useState, useRef } from "react";
import {
  FiArrowLeft,
  FiMoon,
  FiSun,
  FiSearch,
  FiLogIn,
  FiLogOut,
  FiLoader,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { loginBg } from "@/modules/auth/assets";
import logoDark from "@/shared/assets/images/logo-dark.webp";
import logoWhite from "@/shared/assets/images/logo-white.webp";

import { useTheme } from "@/shared/hooks/useTheme";
import { useNavigation } from "@/shared/hooks/useNavigation";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useToast } from "@/shared/components/ui/toast";

import { developerGithubURL } from "@/config/appConfig";
import HeaderButton from "@/shared/components/ui/buttons/HeaderButton";
import Button from "@/shared/components/ui/buttons/Button";
import Chip from "@/shared/components/ui/chip/Chip";

import {
  searchKioskUsers,
  checkInUser,
  checkOutUser,
} from "../api/attendance.api";
import type { KioskUser, AttendanceRecord } from "../types/attendance.types";

interface CheckoutSummary {
  checkInTime: string;
  checkOutTime: string;
  durationMinutes: number;
}

const AttendanceEntry = () => {
  const { isDark, toggleTheme } = useTheme();
  const { navigate, openInNewTab } = useNavigation();
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<KioskUser | null>(null);
  const [checkoutSummary, setCheckoutSummary] =
    useState<CheckoutSummary | null>(null);
  const [checkinMessage, setCheckinMessage] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced input with 300ms delay for searching
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // TanStack Query for searching active members and trainers
  const {
    data: users = [],
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["kiosk-search-users", debouncedSearchTerm],
    queryFn: () => searchKioskUsers(debouncedSearchTerm),
    enabled: debouncedSearchTerm.trim().length > 0 && !selectedUser,
    staleTime: 5000,
  });

  // TanStack Mutation for Check-In
  const checkInMutation = useMutation({
    mutationFn: (userId: string) =>
      checkInUser({ userId, entryMethod: "kiosk" }),
    onSuccess: (data: AttendanceRecord) => {
      queryClient.invalidateQueries({ queryKey: ["kiosk-search-users"] });
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
      setCheckoutSummary(null);
      const timeStr = formatTime(data.checkIn);
      setCheckinMessage(`Checked in at ${timeStr}`);
      addToast({
        type: "success",
        message: `Welcome, ${selectedUser?.fullName || "User"}! Check-in recorded at ${timeStr}.`,
      });
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Check-in failed. Please try again.";
      addToast({ type: "error", message });
    },
  });

  // TanStack Mutation for Check-Out
  const checkOutMutation = useMutation({
    mutationFn: (userId: string) =>
      checkOutUser({ userId, entryMethod: "kiosk" }),
    onSuccess: (data: AttendanceRecord) => {
      queryClient.invalidateQueries({ queryKey: ["kiosk-search-users"] });
      const duration = data.durationMinutes || 0;
      if (selectedUser) {
        setSelectedUser({
          ...selectedUser,
          isCheckedIn: false,
          todayAttendance: {
            attendanceId: data.attendanceId,
            checkIn: data.checkIn,
            checkOut: data.checkOut,
            status: data.status,
            durationMinutes: duration,
          },
        });
      }
      setCheckinMessage(null);
      setCheckoutSummary({
        checkInTime: data.checkIn,
        checkOutTime: data.checkOut || new Date().toISOString(),
        durationMinutes: duration,
      });
      addToast({
        type: "success",
        message: `Goodbye, ${selectedUser?.fullName || "User"}! Workout completed (${formatDuration(duration)}).`,
      });
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Check-out failed. Please try again.";
      addToast({ type: "error", message });
    },
  });

  const handleSelectUser = (user: KioskUser) => {
    setSelectedUser(user);
    setSearchTerm(user.fullName);
    setCheckoutSummary(null);
    setCheckinMessage(null);
  };

  const handleClear = () => {
    setSearchTerm("");
    setSelectedUser(null);
    setCheckoutSummary(null);
    setCheckinMessage(null);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (selectedUser) {
      setSelectedUser(null);
      setCheckoutSummary(null);
      setCheckinMessage(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !selectedUser && users.length > 0) {
      handleSelectUser(users[0]);
    } else if (e.key === "Escape") {
      handleClear();
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

  const formatMaskedPhone = (phone?: string) => {
    if (!phone) return "••••••••••";
    const clean = phone.trim();
    if (clean.length <= 4) return clean;
    const lastFour = clean.slice(-4);
    const starsCount = Math.max(6, clean.length - 4);
    return `${"*".repeat(starsCount)}${lastFour}`;
  };

  const formatTime = (dateStr?: string | null): string => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const formatDuration = (minutes: number): string => {
    if (!minutes || minutes < 1) return "< 1 min";
    if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"}`;
    const hrs = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;
    if (remainingMins === 0) return `${hrs} hr${hrs === 1 ? "" : "s"}`;
    return `${hrs} hr${hrs === 1 ? "" : "s"} ${remainingMins} min${remainingMins === 1 ? "" : "s"}`;
  };

  const getInitial = (name: string): string => {
    const trimmed = name.trim();
    return trimmed ? trimmed.charAt(0).toUpperCase() : "U";
  };

  return (
    <div className="relative min-h-screen select-none">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${loginBg})` }}
      />
      {/* Light Mode Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-slate-300/70 via-slate-400/50 to-indigo-300/60 pointer-events-none transition-opacity duration-500 opacity-100 dark:opacity-0" />
      {/* Dark Mode Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-slate-950/90 via-slate-950/85 to-indigo-950/90 pointer-events-none transition-opacity duration-500 opacity-0 dark:opacity-100" />

      {/* Theme Toggle Button */}
      <div className="flex flex-col absolute top-6 left-6 z-20 gap-2">
        <HeaderButton
          variant="secondary"
          onClick={toggleTheme}
          ariaLabel="Toggle Theme"
          iconClassName="text-indigo-600 dark:text-amber-400"
          icon={isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
          text={isDark ? "LIGHT MODE" : "DARK MODE"}
        />
      </div>

      {/* Navigation Switch */}
      <div className="flex flex-col absolute top-6 right-6 z-20 gap-2">
        <HeaderButton
          variant="blue"
          ariaLabel="back to login"
          icon={<FiArrowLeft />}
          onClick={() => navigate("/authenticate")}
          text="Back to Login"
        />
      </div>

      {/* Centered Kiosk Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center w-full max-w-xl gap-6">
          {/* Logo */}
          <div
            onClick={() => openInNewTab(developerGithubURL)}
            className="flex items-center justify-center hover:scale-105 transition-all duration-300 ease-out cursor-pointer"
          >
            <img
              src={logoDark}
              alt="IronParadise Logo"
              draggable={false}
              className="h-12 w-auto block dark:hidden object-contain select-none"
            />
            <img
              src={logoWhite}
              alt="IronParadise Logo"
              draggable={false}
              className="h-12 w-auto hidden dark:block object-contain select-none"
            />
          </div>

          {/* Title & Subtitle */}
          <div className="text-center space-y-1">
            <h1 className="text-xl md:text-2xl font-bold tracking-widest text-slate-900 dark:text-white uppercase drop-shadow-sm">
              ATTENDANCE KIOSK
            </h1>
            <p className="text-xs md:text-sm font-semibold tracking-[0.25em] text-indigo-600 dark:text-slate-400 uppercase">
              IRON PARADISE GYM
            </p>
          </div>

          {/* Main Card */}
          <div className="w-full bg-white/95 dark:bg-[#0c1424]/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 shadow-2xl rounded-2xl md:rounded-3xl p-5 md:p-6 transition-all space-y-4">
            {/* Search Bar Input */}
            <div className="relative flex items-center gap-3 px-4 py-3 rounded-xl md:rounded-2xl bg-slate-100/90 dark:bg-slate-950/80 border border-indigo-400/80 dark:border-indigo-500/60 shadow-[0_0_15px_rgba(99,102,241,0.12)] focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/25 transition-all">
              <FiSearch className="text-indigo-600 dark:text-indigo-400 w-5 h-5 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Search by Name, Member ID or Phone..."
                className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm md:text-base outline-none font-medium"
                autoFocus
              />
              <Button
                variant="secondary"
                size="xs"
                type="button"
                onClick={handleClear}
                disabled={!searchTerm}
                className={`uppercase tracking-wider font-semibold transition-all ${
                  searchTerm
                    ? "text-slate-700 dark:text-slate-200 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700/60 cursor-pointer shadow-xs"
                    : "text-slate-400 dark:text-slate-600 bg-slate-200/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800/40 cursor-not-allowed opacity-50"
                }`}
              >
                CLEAR
              </Button>
            </div>

            {/* If a User is Selected: Show the Selected User Card */}
            {selectedUser ? (
              <div className="rounded-2xl bg-slate-50 dark:bg-[#0e1628]/90 border border-slate-200/80 dark:border-slate-800/80 p-5 md:p-6 space-y-5 transition-all shadow-md">
                {/* User Info Header */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Blue Avatar Box with Initial */}
                    {selectedUser.profileImage ? (
                      <img
                        src={selectedUser.profileImage}
                        alt={selectedUser.fullName}
                        className="w-13 h-13 rounded-2xl object-cover shrink-0 border border-slate-200 dark:border-slate-700 shadow-md"
                      />
                    ) : (
                      <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-500/25 shrink-0">
                        {getInitial(selectedUser.fullName)}
                      </div>
                    )}

                    <div className="min-w-0">
                      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white truncate">
                        {selectedUser.fullName}
                      </h2>
                      <p className="text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {selectedUser.role === "trainer" ? "TRAINER" : "MEMBER"} •{" "}
                        {selectedUser.userId}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex flex-col items-end shrink-0">
                    <span className="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-1">
                      STATUS
                    </span>
                    {selectedUser.isCheckedIn ? (
                      <Chip
                        variant="active"
                        size="sm"
                        dot
                        label="CHECKED IN"
                        className="px-3.5 py-1 text-xs font-semibold tracking-wider shadow-xs"
                      />
                    ) : (
                      <Chip
                        variant="gray"
                        size="sm"
                        label="OFFLINE"
                        className="px-3.5 py-1 text-xs font-semibold tracking-wider dark:bg-[#162035] dark:text-slate-300 dark:border-slate-700/60"
                      />
                    )}
                  </div>
                </div>

                {/* Live Session Active Indicator (if checked in) */}
                {selectedUser.isCheckedIn && !checkoutSummary && (
                  <div className="rounded-xl p-3 bg-indigo-500/10 border border-indigo-500/25 text-indigo-600 dark:text-indigo-300 flex items-center justify-between text-xs font-medium">
                    <div className="flex items-center gap-2">
                      <FiClock className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span>
                        Active session since{" "}
                        <strong className="text-slate-900 dark:text-white">
                          {formatTime(
                            selectedUser.todayAttendance?.checkIn ||
                              new Date().toISOString(),
                          )}
                        </strong>
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-indigo-500 dark:text-indigo-400 bg-indigo-500/20 px-2 py-0.5 rounded-md font-semibold">
                      IN GYM
                    </span>
                  </div>
                )}

                {/* Check-In Success Message */}
                {checkinMessage && (
                  <div className="rounded-xl p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in duration-200">
                    <FiCheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                    <div className="text-xs">
                      <span className="font-bold text-slate-900 dark:text-white">
                        Welcome to Iron Paradise!
                      </span>{" "}
                      <span className="text-slate-600 dark:text-slate-300">
                        {checkinMessage}
                      </span>
                    </div>
                  </div>
                )}

                {/* Post Check-Out Streamlined Duration & Summary Card */}
                {checkoutSummary && (
                  <div className="rounded-2xl p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-3.5 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FiCheckCircle className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                        <span className="font-bold text-sm tracking-wide text-slate-900 dark:text-white">
                          Workout Session Completed!
                        </span>
                      </div>
                      <Chip
                        variant="success"
                        size="xs"
                        label="Checked Out"
                        className="font-semibold"
                      />
                    </div>

                    {/* Prominent Duration Display */}
                    <div className="bg-white/80 dark:bg-slate-950/70 rounded-xl p-3.5 border border-emerald-500/20 flex items-center justify-between shadow-xs">
                      <div>
                        <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Total Workout Duration
                        </p>
                        <p className="text-2xl md:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tight mt-0.5">
                          {formatDuration(checkoutSummary.durationMinutes)}
                        </p>
                      </div>
                      <div className="text-right text-xs text-slate-600 dark:text-slate-400 space-y-1 font-mono">
                        <div>
                          In:{" "}
                          <span className="font-semibold text-slate-900 dark:text-slate-200">
                            {formatTime(checkoutSummary.checkInTime)}
                          </span>
                        </div>
                        <div>
                          Out:{" "}
                          <span className="font-semibold text-slate-900 dark:text-slate-200">
                            {formatTime(checkoutSummary.checkOutTime)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleClear}
                      className="w-full text-xs font-semibold uppercase tracking-wider py-2.5 cursor-pointer bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30 dark:hover:bg-emerald-500/20"
                    >
                      Done / Next Member
                    </Button>
                  </div>
                )}

                {/* Action Buttons: CHECK IN & CHECK OUT */}
                <div className="space-y-3 pt-1">
                  {/* CHECK IN button */}
                  <Button
                    variant={!selectedUser.isCheckedIn ? "green-dark" : "secondary"}
                    size="lg"
                    type="button"
                    loading={checkInMutation.isPending}
                    disabled={
                      selectedUser.isCheckedIn ||
                      checkInMutation.isPending ||
                      checkOutMutation.isPending
                    }
                    onClick={handleCheckIn}
                    className={`w-full py-3.5 px-4 rounded-xl flex items-center justify-center gap-2.5 font-bold tracking-wider uppercase text-sm md:text-base transition-all ${
                      !selectedUser.isCheckedIn
                        ? "shadow-md shadow-emerald-600/25 dark:shadow-lg dark:shadow-emerald-600/40 cursor-pointer active:scale-[0.99]"
                        : "opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-900/40"
                    }`}
                  >
                    {checkInMutation.isPending ? (
                      "Checking In..."
                    ) : (
                      <>
                        <FiLogIn className="w-5 h-5 shrink-0" />
                        <span>CHECK IN</span>
                      </>
                    )}
                  </Button>

                  {/* CHECK OUT button */}
                  <Button
                    variant={selectedUser.isCheckedIn ? "red-dark" : "secondary"}
                    size="lg"
                    type="button"
                    loading={checkOutMutation.isPending}
                    disabled={
                      !selectedUser.isCheckedIn ||
                      checkInMutation.isPending ||
                      checkOutMutation.isPending
                    }
                    onClick={handleCheckOut}
                    className={`w-full py-3.5 px-4 rounded-xl flex items-center justify-center gap-2.5 font-bold tracking-wider uppercase text-sm md:text-base transition-all ${
                      selectedUser.isCheckedIn
                        ? "shadow-md shadow-rose-600/25 dark:shadow-lg dark:shadow-rose-600/40 cursor-pointer active:scale-[0.99]"
                        : "opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-900/40"
                    }`}
                  >
                    {checkOutMutation.isPending ? (
                      "Checking Out..."
                    ) : (
                      <>
                        <FiLogOut className="w-5 h-5 shrink-0" />
                        <span>CHECK OUT</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              /* If No User Selected: Search Dropdown / State */
              <div className="space-y-2">
                {debouncedSearchTerm.trim().length === 0 ? (
                  <div className="py-8 px-4 text-center">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Type member name, ID (e.g. MBR-001) or phone to select.
                    </p>
                  </div>
                ) : isFetching ? (
                  <div className="py-10 flex flex-col items-center justify-center gap-2.5 text-slate-500 dark:text-slate-400">
                    <FiLoader className="w-6 h-6 animate-spin text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs font-medium">Searching records...</span>
                  </div>
                ) : isError ? (
                  <div className="py-8 px-4 text-center text-rose-500">
                    <p className="text-sm font-medium">
                      Error searching records. Please try again.
                    </p>
                  </div>
                ) : users.length === 0 ? (
                  <div className="py-8 px-4 text-center">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      No active members or trainers found matching &ldquo;{debouncedSearchTerm}&rdquo;
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      Try searching by full name, ID, or phone number.
                    </p>
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 pr-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 py-1">
                      Select Member / Trainer:
                    </p>
                    {users.map((user) => {
                      const roleLabel =
                        user.role === "trainer" ? "Trainer" : "Member";

                      return (
                        <div
                          key={user._id || user.userId}
                          onClick={() => handleSelectUser(user)}
                          role="button"
                          tabIndex={0}
                          className="py-3 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
                        >
                          {/* Left: Avatar & Info */}
                          <div className="flex items-center gap-3 min-w-0">
                            {user.profileImage ? (
                              <img
                                src={user.profileImage}
                                alt={user.fullName}
                                className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 text-white shadow-sm font-bold text-sm group-hover:scale-105 transition-transform">
                                {getInitial(user.fullName)}
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {user.fullName}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                                {roleLabel} • ID: {user.userId}
                              </p>
                            </div>
                          </div>

                          {/* Right: Masked Phone & Status Pill */}
                          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                            <Chip
                              variant="secondary"
                              size="xs"
                              className="font-mono tracking-wider dark:bg-[#131b2e] dark:text-slate-400 dark:border-slate-800/80"
                              label={formatMaskedPhone(user.phone)}
                            />

                            {user.isCheckedIn ? (
                              <Chip
                                variant="active"
                                size="xs"
                                dot
                                label="In"
                              />
                            ) : (
                              <Chip
                                variant="gray"
                                size="xs"
                                label="Offline"
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceEntry;
