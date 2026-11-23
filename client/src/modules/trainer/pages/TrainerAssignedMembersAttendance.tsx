import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import type { GridColDef } from "@mui/x-data-grid";
import {
  LuCalendarCheck2,
  LuClock,
  LuArrowLeft,
  LuCalendar,
  LuActivity,
  LuRefreshCw,
  LuUser,
  LuFilter,
} from "react-icons/lu";

import PageHeader from "@/shared/components/ui/page/PageHeader";
import Container from "@/shared/components/ui/containers/Container";
import SearchBar from "@/shared/components/ui/search/SearchBar";
import SelectDropdown from "@/shared/components/ui/dropdown/SelectDropdown";
import DataTable from "@/shared/components/ui/table/DataTable";
import Button from "@/shared/components/ui/buttons/Button";
import Chip from "@/shared/components/ui/chip/Chip";
import { KPIGrid, KPICard } from "@/shared/components/ui/kpi";
import { getDeterministicGradient } from "@/shared/utils/gradient-colors";
import { getInitials } from "@/shared/hooks/getInitials";

import { useAssignedMembersAttendance } from "../hooks/use-assigned-members-attendance";
import { useTrainerAssignedMembers } from "../hooks/use-trainer-assigned-members";
import type { AssignedAttendanceRecord } from "../types/trainer.types";

const statusFilterOptions = [
  { value: "all", label: "All Statuses" },
  { value: "checked_in", label: "Checked In" },
  { value: "checked_out", label: "Checked Out" },
  { value: "late", label: "Late" },
  { value: "present", label: "Present" },
];

export const TrainerAssignedMembersAttendance = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialMemberId = searchParams.get("memberId") || "all";

  const [selectedMemberId, setSelectedMemberId] = useState<string>(initialMemberId);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Sync state if URL changes
  useEffect(() => {
    const urlId = searchParams.get("memberId");
    if (urlId && urlId !== selectedMemberId) {
      setSelectedMemberId(urlId);
    }
  }, [searchParams]);

  // Fetch assigned members list for the member dropdown
  const { data: membersRes } = useTrainerAssignedMembers();
  const assignedMembers = useMemo(
    () => membersRes?.data?.members ?? [],
    [membersRes?.data?.members]
  );

  const memberDropdownOptions = useMemo(() => {
    const base = [{ value: "all", label: "All Assigned Members" }];
    const membersList = assignedMembers.map((m) => ({
      value: m.userId,
      label: `${m.fullName} (${m.userId})`,
    }));
    return [...base, ...membersList];
  }, [assignedMembers]);

  // Attendance query
  const queryParams = useMemo(() => {
    return {
      memberId: selectedMemberId !== "all" ? selectedMemberId : undefined,
      status: statusFilter !== "all" ? statusFilter : undefined,
      startDate: selectedDate ? `${selectedDate}T00:00:00.000Z` : undefined,
      endDate: selectedDate ? `${selectedDate}T23:59:59.999Z` : undefined,
      limit: 100,
    };
  }, [selectedMemberId, statusFilter, selectedDate]);

  const {
    data: attendanceRes,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAssignedMembersAttendance(queryParams);

  const records = useMemo(
    () => attendanceRes?.data?.records ?? [],
    [attendanceRes?.data?.records]
  );

  // Client search filtering
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        r.fullName?.toLowerCase().includes(q) ||
        r.userId?.toLowerCase().includes(q) ||
        r.attendanceId?.toLowerCase().includes(q) ||
        r.entryMethod?.toLowerCase().includes(q)
      );
    });
  }, [records, searchQuery]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const totalSessions = filteredRecords.length;
    const activeInGym = filteredRecords.filter((r) => {
      const s = (r.status || "").toLowerCase();
      return s === "checked_in" || s === "checked in" || (r.checkIn && !r.checkOut);
    }).length;
    const completed = filteredRecords.filter((r) => r.checkOut);
    const totalMinutes = completed.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
    const avgMinutes = completed.length > 0 ? Math.round(totalMinutes / completed.length) : 0;

    return { totalSessions, activeInGym, avgMinutes };
  }, [filteredRecords]);

  const formatTime = (isoString?: string | null) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDuration = (mins?: number, checkOut?: string | null) => {
    if (!checkOut) return "In Progress";
    if (!mins || mins <= 0) return "< 1 min";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m}m`;
    return `${h}h ${m}m`;
  };

  // Table Columns
  const columns: GridColDef<AssignedAttendanceRecord>[] = useMemo(
    () => [
      {
        field: "date",
        headerName: "Date",
        flex: 1.1,
        minWidth: 145,
        headerAlign: "left",
        align: "left",
        renderCell: (params) => (
          <div className="flex items-center gap-2.5 w-full text-xs font-semibold text-slate-700 dark:text-slate-300">
            <LuCalendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="truncate">{formatDate(params.row.date || params.row.checkIn)}</span>
          </div>
        ),
      },
      {
        field: "member",
        headerName: "Member",
        flex: 1.6,
        minWidth: 220,
        headerAlign: "left",
        align: "left",
        renderCell: (params) => {
          const row = params.row;
          const initials = getInitials(row.fullName || "Member");
          return (
            <div className="flex items-center gap-3 w-full min-w-0 py-1">
              {row.profileImage ? (
                <img
                  src={row.profileImage}
                  alt={row.fullName}
                  className="w-9 h-9 rounded-xl object-cover ring-2 ring-indigo-500/20 shrink-0"
                />
              ) : (
                <div
                  className={`w-9 h-9 rounded-xl ${getDeterministicGradient(
                    row.userId || row.fullName || "Member",
                  )} text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0`}
                >
                  {initials}
                </div>
              )}
              <div className="flex flex-col justify-center min-w-0 flex-1 leading-snug">
                <span className="font-semibold text-xs text-slate-800 dark:text-slate-100 truncate">
                  {row.fullName}
                </span>
                <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-mono font-medium truncate">
                  {row.userId}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        field: "status",
        headerName: "Status",
        flex: 1.1,
        minWidth: 140,
        headerAlign: "left",
        align: "left",
        renderCell: (params) => {
          const row = params.row;
          const status = (row.status || "").toLowerCase();
          const isAct = status === "checked_in" || status === "checked in" || (row.checkIn && !row.checkOut);

          let variant: "active" | "inactive" | "warning" = "inactive";
          let label = "Checked Out";

          if (isAct) {
            variant = "active";
            label = "Checked In";
          } else if (status === "late") {
            variant = "warning";
            label = "Late";
          } else if (status === "present") {
            variant = "active";
            label = "Present";
          } else if (status === "checked_out" || status === "checked out") {
            variant = "inactive";
            label = "Checked Out";
          } else if (row.status) {
            label = row.status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
          }

          return (
            <div className="flex items-center">
              <Chip
                variant={variant}
                dot
                label={label}
                size="sm"
                className="h-6! max-h-6!"
              />
            </div>
          );
        },
      },
      {
        field: "checkIn",
        headerName: "Check In",
        flex: 0.9,
        minWidth: 115,
        headerAlign: "left",
        align: "left",
        renderCell: (params) => (
          <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span>{formatTime(params.row.checkIn)}</span>
          </div>
        ),
      },
      {
        field: "checkOut",
        headerName: "Check Out",
        flex: 0.9,
        minWidth: 115,
        headerAlign: "left",
        align: "left",
        renderCell: (params) => (
          <div className="flex items-center gap-1.5">
            {params.row.checkOut ? (
              <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-slate-700 dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                <span>{formatTime(params.row.checkOut)}</span>
              </div>
            ) : (
              <span className="inline-flex items-center h-5 px-2 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 border border-emerald-300/40">
                In Gym
              </span>
            )}
          </div>
        ),
      },
      {
        field: "durationMinutes",
        headerName: "Session Duration",
        flex: 1.1,
        minWidth: 140,
        headerAlign: "left",
        align: "left",
        renderCell: (params) => (
          <div className="flex items-center gap-1.5">
            <LuClock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {formatDuration(params.row.durationMinutes, params.row.checkOut)}
            </span>
          </div>
        ),
      },
      {
        field: "entryMethod",
        headerName: "Method",
        flex: 0.9,
        minWidth: 110,
        headerAlign: "left",
        align: "left",
        renderCell: (params) => {
          const raw = (params.row.entryMethod || "manual").toLowerCase();
          let display = "Manual";
          if (raw === "qr") display = "QR Code";
          else if (raw === "kiosk") display = "Kiosk";
          else if (raw === "rfid") display = "RFID";
          else if (raw === "biometric") display = "Biometric";
          else display = raw.replace(/_/g, " ").toUpperCase();

          return (
            <div className="flex items-center">
              <span className="inline-flex items-center h-6 max-h-6 px-2.5 rounded-lg text-[11px] font-mono font-semibold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60 shadow-2xs">
                {display}
              </span>
            </div>
          );
        },
      },
    ],
    []
  );

  const handleMemberChange = (id: string) => {
    setSelectedMemberId(id);
    if (id === "all") {
      searchParams.delete("memberId");
    } else {
      searchParams.set("memberId", id);
    }
    setSearchParams(searchParams);
  };

  const handleTodayClick = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    setSelectedDate(todayStr);
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-10 animate-fadeIn">
      {/* Header */}
      <PageHeader
        title="Member Attendance Logs"
        description="Monitor daily check-ins, check-outs, and training durations for members under your supervision."
      >
        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate("/trainer/my-members")}
            variant="secondary"
            size="sm"
            className="rounded-xl! font-semibold!"
          >
            <LuArrowLeft className="w-4 h-4 mr-1 text-slate-500" />
            My Members Roster
          </Button>

          <Button
            onClick={() => refetch()}
            variant="secondary"
            size="sm"
            className="rounded-xl! p-2!"
            title="Refresh logs"
          >
            <LuRefreshCw className={`w-4 h-4 text-slate-600 dark:text-slate-300 ${isFetching ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </PageHeader>

      {/* Overview Metric Cards */}
      <KPIGrid columns={3}>
        <KPICard
          title="Total Sessions Logged"
          value={metrics.totalSessions.toLocaleString()}
          subtitle="All training visits"
          icon={LuCalendarCheck2}
          color="indigo"
        />
        <KPICard
          title="Currently In Gym"
          value={metrics.activeInGym.toLocaleString()}
          subtitle="Active on floor"
          icon={LuActivity}
          color="emerald"
        />
        <KPICard
          title="Avg Session Length"
          value={`${metrics.avgMinutes} mins`}
          subtitle="Typical workout time"
          icon={LuClock}
          color="blue"
        />
      </KPIGrid>

      {/* Filter and Search Toolbar */}
      <Container
        variant="secondary"
        className="w-full! max-w-full! mx-0! flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5! sm:p-3! rounded-2xl! shadow-xs relative! z-30! overflow-visible!"
      >
        {/* Left Side: Search Bar */}
        <div className="w-full md:w-auto shrink-0">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            placeholder="Search records by member, ID, or method..."
            containerClassName="w-full! sm:w-72!"
          />
        </div>

        {/* Right Side: Filters */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full md:w-auto justify-start md:justify-end">
          {/* Member Dropdown */}
          <SelectDropdown
            options={memberDropdownOptions}
            value={selectedMemberId}
            onChange={handleMemberChange}
            icon={<LuUser className="w-4 h-4" />}
            className="w-48 sm:w-56"
          />

          {/* Status Dropdown */}
          <SelectDropdown
            options={statusFilterOptions}
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            icon={<LuFilter className="w-4 h-4" />}
            className="w-36 sm:w-40"
          />

          {/* Date Picker Input */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200/90 dark:border-slate-700/80 bg-slate-100/90 dark:bg-slate-800/90 backdrop-blur-md hover:border-slate-300 dark:hover:border-slate-600 transition-all text-xs font-semibold text-slate-800 dark:text-slate-100 shadow-xs h-10">
            <LuCalendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-slate-700 dark:text-slate-200 text-xs font-medium outline-hidden cursor-pointer"
            />
            {selectedDate && (
              <button
                type="button"
                onClick={() => setSelectedDate("")}
                className="text-[10px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-1 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Today Button */}
          <button
            type="button"
            onClick={handleTodayClick}
            className="h-10 px-3.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 border border-indigo-200/60 dark:border-indigo-500/30 transition-colors cursor-pointer shrink-0"
          >
            Today
          </button>
        </div>
      </Container>

      {/* Main Table Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 rounded-full border-3 border-indigo-600 border-t-transparent animate-spin" />
          <span className="text-sm font-semibold text-slate-500">Loading attendance records...</span>
        </div>
      ) : isError ? (
        <Container variant="secondary" className="w-full! max-w-full! mx-0! p-8 text-center rounded-2xl border-rose-200">
          <p className="text-sm font-semibold text-rose-600">
            {error instanceof Error ? error.message : "Failed to load attendance records."}
          </p>
          <Button onClick={() => refetch()} variant="secondary" size="sm" className="mt-4">
            Try Again
          </Button>
        </Container>
      ) : (
        <div className="relative z-0 w-full">
          <Container
            variant="secondary"
            className="w-full! max-w-full! mx-0! p-0! overflow-hidden rounded-2xl! flex-col shadow-xs"
          >
            <DataTable
              rows={filteredRecords}
              columns={columns}
              getRowId={(row) => row._id || row.attendanceId}
              pageSize={10}
              height={550}
              rowHeight={64}
              className="border-none! rounded-none! shadow-none! bg-transparent!"
            />
          </Container>
        </div>
      )}
    </div>
  );
};

export default TrainerAssignedMembersAttendance;
