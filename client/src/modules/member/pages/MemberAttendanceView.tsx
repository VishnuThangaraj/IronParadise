import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { GridColDef } from "@mui/x-data-grid";
import {
  LuCalendarCheck2,
  LuClock,
  LuCalendar,
  LuArrowLeft,
  LuActivity,
  LuRefreshCw,
} from "react-icons/lu";

import PageHeader from "@/shared/components/ui/page/PageHeader";
import Container from "@/shared/components/ui/containers/Container";
import DataTable from "@/shared/components/ui/table/DataTable";
import Button from "@/shared/components/ui/buttons/Button";
import SelectDropdown from "@/shared/components/ui/dropdown/SelectDropdown";

import { useMemberSelfAttendance } from "../hooks/use-member-self-attendance";
import type { MemberAttendanceRecord } from "../types/member.types";

const monthOptions = [
  { value: "all", label: "All Months" },
  { value: "0", label: "January" },
  { value: "1", label: "February" },
  { value: "2", label: "March" },
  { value: "3", label: "April" },
  { value: "4", label: "May" },
  { value: "5", label: "June" },
  { value: "6", label: "July" },
  { value: "7", label: "August" },
  { value: "8", label: "September" },
  { value: "9", label: "October" },
  { value: "10", label: "November" },
  { value: "11", label: "December" },
];

export const MemberAttendanceView = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState<string>("all");

  const queryParams = useMemo(() => {
    if (selectedMonth === "all") return undefined;
    const currentYear = new Date().getFullYear();
    return {
      month: parseInt(selectedMonth, 10),
      year: currentYear,
      limit: 100,
    };
  }, [selectedMonth]);

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useMemberSelfAttendance(queryParams);

  const records = useMemo(() => response?.data?.records ?? [], [response?.data?.records]);
  const totalVisits = response?.data?.totalVisits ?? records.length;
  const totalMinutes = response?.data?.totalMinutes ?? 0;
  const avgMinutes = response?.data?.averageMinutes ?? 0;

  const totalHours = useMemo(() => {
    return (totalMinutes / 60).toFixed(1);
  }, [totalMinutes]);

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
    if (!checkOut) return "Active Workout";
    if (!mins || mins <= 0) return "< 1 min";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m}m`;
    return `${h}h ${m}m`;
  };

  const columns: GridColDef<MemberAttendanceRecord>[] = useMemo(
    () => [
      {
        field: "date",
        headerName: "Date",
        flex: 1.3,
        minWidth: 160,
        renderCell: (params) => (
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <LuCalendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>{formatDate(params.row.date || params.row.checkIn)}</span>
          </div>
        ),
      },
      {
        field: "checkIn",
        headerName: "Check In",
        flex: 1,
        minWidth: 120,
        renderCell: (params) => (
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
            {formatTime(params.row.checkIn)}
          </span>
        ),
      },
      {
        field: "checkOut",
        headerName: "Check Out",
        flex: 1,
        minWidth: 120,
        renderCell: (params) => (
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
            {params.row.checkOut ? formatTime(params.row.checkOut) : "Active in Gym"}
          </span>
        ),
      },
      {
        field: "durationMinutes",
        headerName: "Session Length",
        flex: 1.1,
        minWidth: 140,
        renderCell: (params) => (
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {formatDuration(params.row.durationMinutes, params.row.checkOut)}
          </span>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        flex: 1,
        minWidth: 130,
        renderCell: (params) => {
          const isAct = params.row.status === "Checked In" || (params.row.checkIn && !params.row.checkOut);
          return (
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
              {params.row.status}
            </span>
          );
        },
      },
      {
        field: "entryMethod",
        headerName: "Entry Method",
        flex: 0.9,
        minWidth: 110,
        renderCell: (params) => (
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {params.row.entryMethod || "Kiosk"}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-6 w-full pb-10 animate-fadeIn">
      {/* Header */}
      <PageHeader
        title="My Attendance History"
        description="Review all your gym visits, workout session durations, and training frequency."
      >
        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate("/dashboard")}
            variant="secondary"
            size="sm"
            className="rounded-xl! font-semibold!"
          >
            <LuArrowLeft className="w-4 h-4 mr-1 text-slate-500" />
            Dashboard
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

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Container
          variant="secondary"
          className="p-5! rounded-2xl! border-emerald-100 dark:border-emerald-900/30 bg-linear-to-br from-emerald-500/5 to-transparent flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Check-Ins
            </p>
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {totalVisits}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl">
            <LuCalendarCheck2 />
          </div>
        </Container>

        <Container
          variant="secondary"
          className="p-5! rounded-2xl! border-indigo-100 dark:border-indigo-900/30 bg-linear-to-br from-indigo-500/5 to-transparent flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Time in Gym
            </p>
            <h3 className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
              {totalHours} hrs
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl">
            <LuClock />
          </div>
        </Container>

        <Container
          variant="secondary"
          className="p-5! rounded-2xl! border-blue-100 dark:border-blue-900/30 bg-linear-to-br from-blue-500/5 to-transparent flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Avg Workout Time
            </p>
            <h3 className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
              {avgMinutes} mins
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl">
            <LuActivity />
          </div>
        </Container>
      </div>

      {/* Filter Toolbar */}
      <Container
        variant="secondary"
        className="p-4! rounded-2xl! flex items-center justify-between gap-4 border-slate-200/80 dark:border-slate-800 shadow-xs"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Filter by Month:
          </span>
          <SelectDropdown
            options={monthOptions}
            value={selectedMonth}
            onChange={(val) => setSelectedMonth(val)}
            className="w-48"
          />
        </div>

        {selectedMonth !== "all" && (
          <button
            onClick={() => setSelectedMonth("all")}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            Show All Months
          </button>
        )}
      </Container>

      {/* Data Table */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 rounded-full border-3 border-indigo-600 border-t-transparent animate-spin" />
          <span className="text-sm font-semibold text-slate-500">Loading your attendance logs...</span>
        </div>
      ) : isError ? (
        <Container variant="secondary" className="p-8 text-center rounded-2xl border-rose-200">
          <p className="text-sm font-semibold text-rose-600">
            {error instanceof Error ? error.message : "Failed to load attendance logs."}
          </p>
          <Button onClick={() => refetch()} variant="secondary" size="sm" className="mt-4">
            Try Again
          </Button>
        </Container>
      ) : (
        <Container variant="secondary" className="p-0! rounded-3xl! overflow-hidden shadow-sm">
          <DataTable
            rows={records}
            columns={columns}
            getRowId={(row) => row._id || row.attendanceId}
            pageSize={10}
            height={550}
          />
        </Container>
      )}
    </div>
  );
};

export default MemberAttendanceView;
