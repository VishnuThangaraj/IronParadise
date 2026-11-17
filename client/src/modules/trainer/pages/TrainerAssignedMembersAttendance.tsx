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
} from "react-icons/lu";

import PageHeader from "@/shared/components/ui/page/PageHeader";
import Container from "@/shared/components/ui/containers/Container";
import SearchBar from "@/shared/components/ui/search/SearchBar";
import SelectDropdown from "@/shared/components/ui/dropdown/SelectDropdown";
import DataTable from "@/shared/components/ui/table/DataTable";
import Button from "@/shared/components/ui/buttons/Button";
import { KPIGrid, KPICard } from "@/shared/components/ui/kpi";

import { useAssignedMembersAttendance } from "../hooks/use-assigned-members-attendance";
import { useTrainerAssignedMembers } from "../hooks/use-trainer-assigned-members";
import type { AssignedAttendanceRecord } from "../types/trainer.types";

const statusFilterOptions = [
  { value: "all", label: "All Statuses" },
  { value: "Checked In", label: "Checked In (Active)" },
  { value: "Checked Out", label: "Checked Out" },
  { value: "Present", label: "Present" },
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
    const activeInGym = filteredRecords.filter(
      (r) => r.status === "Checked In" || (r.checkIn && !r.checkOut)
    ).length;
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
        minWidth: 150,
        renderCell: (params) => (
          <div className="flex items-center gap-2 h-full text-xs font-semibold text-slate-700 dark:text-slate-300">
            <LuCalendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>{formatDate(params.row.date || params.row.checkIn)}</span>
          </div>
        ),
      },
      {
        field: "member",
        headerName: "Member",
        flex: 1.5,
        minWidth: 220,
        renderCell: (params) => {
          const row = params.row;
          const initials = row.fullName?.slice(0, 2).toUpperCase() || "MB";
          return (
            <div className="flex items-center gap-3 h-full min-w-0">
              {row.profileImage ? (
                <img
                  src={row.profileImage}
                  alt={row.fullName}
                  className="w-9 h-9 rounded-xl object-cover ring-2 ring-indigo-500/20 shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                  {initials}
                </div>
              )}
              <div className="flex flex-col justify-center min-w-0">
                <span className="font-semibold text-xs text-slate-800 dark:text-white truncate">
                  {row.fullName}
                </span>
                <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-mono font-medium">
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
        renderCell: (params) => {
          const row = params.row;
          const isAct = row.status === "Checked In" || (row.checkIn && !row.checkOut);
          return (
            <div className="flex items-center h-full">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                  isAct
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 border-emerald-300/40"
                    : "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 border-blue-300/40"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isAct ? "bg-emerald-500 animate-pulse" : "bg-blue-500"
                  }`}
                />
                {row.status}
              </span>
            </div>
          );
        },
      },
      {
        field: "checkIn",
        headerName: "Check In",
        flex: 1,
        minWidth: 120,
        renderCell: (params) => (
          <div className="flex items-center h-full">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              {formatTime(params.row.checkIn)}
            </span>
          </div>
        ),
      },
      {
        field: "checkOut",
        headerName: "Check Out",
        flex: 1,
        minWidth: 120,
        renderCell: (params) => (
          <div className="flex items-center h-full">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              {params.row.checkOut ? formatTime(params.row.checkOut) : "Active"}
            </span>
          </div>
        ),
      },
      {
        field: "durationMinutes",
        headerName: "Session Duration",
        flex: 1.1,
        minWidth: 140,
        renderCell: (params) => (
          <div className="flex items-center h-full">
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
        renderCell: (params) => (
          <div className="flex items-center h-full">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {params.row.entryMethod || "Manual"}
            </span>
          </div>
        ),
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

      {/* Filter Toolbar */}
      <Container
        variant="secondary"
        className="w-full! max-w-full! mx-0! flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4 p-3.5! sm:p-3! rounded-2xl! shadow-xs relative! z-30! overflow-visible!"
      >
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Member Dropdown */}
          <SelectDropdown
            options={memberDropdownOptions}
            value={selectedMemberId}
            onChange={handleMemberChange}
            className="w-full sm:w-64"
          />

          {/* Status Dropdown */}
          <SelectDropdown
            options={statusFilterOptions}
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            className="w-full sm:w-44"
          />

          {/* Date Picker Input */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 h-10 text-xs">
            <LuCalendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-slate-700 dark:text-slate-200 text-xs outline-hidden cursor-pointer"
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate("")}
                className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-1 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <button
            onClick={handleTodayClick}
            className="h-10 px-3.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 border border-indigo-200/60 dark:border-indigo-500/30 transition-colors cursor-pointer"
          >
            Today
          </button>
        </div>

        {/* Search */}
        <div className="w-full lg:w-auto">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            placeholder="Search records..."
            containerClassName="w-full! sm:w-64!"
          />
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
              className="border-none! rounded-none! shadow-none! bg-transparent!"
            />
          </Container>
        </div>
      )}
    </div>
  );
};

export default TrainerAssignedMembersAttendance;
