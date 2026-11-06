import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "@mui/material";
import type { GridColDef } from "@mui/x-data-grid";
import {
  LuUsers,
  LuCalendarCheck2,
  LuDumbbell,
  LuSalad,
  LuPhone,
  LuMail,
  LuClock,
  LuEye,
  LuX,
  LuUser,
  LuShieldAlert,
  LuCalendar,
  LuActivity,
  LuArrowUpRight,
} from "react-icons/lu";

import PageHeader from "@/shared/components/ui/page/PageHeader";
import Container from "@/shared/components/ui/containers/Container";
import SearchBar from "@/shared/components/ui/search/SearchBar";
import SelectDropdown from "@/shared/components/ui/dropdown/SelectDropdown";
import ViewModeToggle from "@/shared/components/ui/view-mode-toggle/ViewModeToggle";
import DataTable from "@/shared/components/ui/table/DataTable";
import Button from "@/shared/components/ui/buttons/Button";

import { useTrainerAssignedMembers } from "../hooks/use-trainer-assigned-members";
import type { AssignedMemberItem } from "../types/trainer.types";

const statusFilterOptions = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active Roster" },
  { value: "expired", label: "Expired" },
  { value: "upcoming", label: "Upcoming" },
];

export const TrainerAssignedMembers = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<string>("grid");

  // Selected member for modal inspection
  const [selectedMember, setSelectedMember] = useState<AssignedMemberItem | null>(null);

  const { data: response, isLoading, isError, error, refetch } = useTrainerAssignedMembers({
    search: searchQuery.trim() || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const members = useMemo(() => response?.data?.members ?? [], [response?.data?.members]);

  // Fallback client-side filtering
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        member.fullName?.toLowerCase().includes(q) ||
        member.userId?.toLowerCase().includes(q) ||
        member.email?.toLowerCase().includes(q) ||
        member.phone?.includes(q);

      const status = (member.assignment?.status || "ACTIVE").toLowerCase();
      const matchesStatus =
        statusFilter === "all" ||
        status === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [members, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const total = members.length;
    const active = members.filter(
      (m) => (m.assignment?.status || "ACTIVE").toUpperCase() === "ACTIVE"
    ).length;
    const inGymToday = members.filter(
      (m) => m.todayAttendance?.status === "Checked In" || m.todayAttendance?.status === "Present"
    ).length;

    return { total, active, inGymToday };
  }, [members]);

  const formatTime = (isoString?: string | null) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  };

  // Table columns definition
  const columns: GridColDef<AssignedMemberItem>[] = useMemo(
    () => [
      {
        field: "member",
        headerName: "Member",
        flex: 1.4,
        minWidth: 220,
        renderCell: (params) => {
          const row = params.row;
          const initials = row.fullName?.trim()?.slice(0, 2).toUpperCase() || "MB";
          return (
            <div className="flex items-center gap-3 py-1">
              {row.profileImage ? (
                <img
                  src={row.profileImage}
                  alt={row.fullName}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/20"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {initials}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-sm text-slate-800 dark:text-white truncate">
                  {row.fullName}
                </span>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono font-medium">
                  {row.userId}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        field: "contact",
        headerName: "Contact",
        flex: 1.2,
        minWidth: 190,
        renderCell: (params) => {
          const row = params.row;
          return (
            <div className="flex flex-col text-xs text-slate-600 dark:text-slate-300 py-1">
              <span className="truncate">{row.email}</span>
              <span className="text-slate-400 font-mono">{row.phone}</span>
            </div>
          );
        },
      },
      {
        field: "plans",
        headerName: "Assigned Plans",
        flex: 1.6,
        minWidth: 240,
        renderCell: (params) => {
          const row = params.row;
          return (
            <div className="flex flex-col gap-1 py-1">
              {row.membershipPlan ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {row.membershipPlan.planName || row.membershipPlan.name}
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">No membership plan</span>
              )}
              <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                {row.workoutPlan && (
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    🏋️ {row.workoutPlan.planName || row.workoutPlan.name}
                  </span>
                )}
                {row.dietPlan && (
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    🥗 {row.dietPlan.planName || row.dietPlan.name}
                  </span>
                )}
              </div>
            </div>
          );
        },
      },
      {
        field: "todayAttendance",
        headerName: "Today's Status",
        flex: 1.1,
        minWidth: 160,
        renderCell: (params) => {
          const att = params.row.todayAttendance;
          if (!att) {
            return (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                Not Visited
              </span>
            );
          }
          if (att.status === "Checked In" || att.status === "Present") {
            return (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                In Gym ({formatTime(att.checkIn)})
              </span>
            );
          }
          return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/30">
              Completed ({att.durationMinutes || 0}m)
            </span>
          );
        },
      },
      {
        field: "status",
        headerName: "Roster Status",
        flex: 0.9,
        minWidth: 120,
        renderCell: (params) => {
          const status = (params.row.assignment?.status || "ACTIVE").toUpperCase();
          const isAct = status === "ACTIVE";
          return (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                isAct
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 border-emerald-300/40"
                  : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300 border-rose-300/40"
              }`}
            >
              {status}
            </span>
          );
        },
      },
      {
        field: "actions",
        headerName: "Action",
        flex: 1,
        minWidth: 140,
        sortable: false,
        renderCell: (params) => {
          return (
            <button
              onClick={() => setSelectedMember(params.row)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 border border-indigo-200/60 dark:border-indigo-500/30 transition-all cursor-pointer"
            >
              <LuEye className="w-3.5 h-3.5" />
              <span>Details</span>
            </button>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-6 w-full pb-10 animate-fadeIn">
      {/* Header */}
      <PageHeader
        title="Assigned Members"
        description="Review training schedules, assigned diet & workout plans, and daily gym attendance for your members."
      >
        <Button
          onClick={() => navigate("/trainer/members-attendance")}
          variant="secondary"
          size="sm"
          className="rounded-xl! font-semibold!"
        >
          <LuCalendarCheck2 className="w-4 h-4 mr-1.5 text-indigo-500" />
          Attendance Logs
        </Button>
      </PageHeader>

      {/* KPI Counters Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Container
          variant="secondary"
          className="p-5! rounded-2xl! border-indigo-100 dark:border-indigo-900/30 bg-linear-to-br from-indigo-500/5 to-transparent flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Assigned
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {stats.total}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl">
            <LuUsers />
          </div>
        </Container>

        <Container
          variant="secondary"
          className="p-5! rounded-2xl! border-emerald-100 dark:border-emerald-900/30 bg-linear-to-br from-emerald-500/5 to-transparent flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Members
            </p>
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {stats.active}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl">
            <LuActivity />
          </div>
        </Container>

        <Container
          variant="secondary"
          className="p-5! rounded-2xl! border-amber-100 dark:border-amber-900/30 bg-linear-to-br from-amber-500/5 to-transparent flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              In Gym Today
            </p>
            <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
              {stats.inGymToday}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl">
            <LuCalendarCheck2 />
          </div>
        </Container>
      </div>

      {/* Filter and View Controls Toolbar */}
      <Container
        variant="secondary"
        className="p-4! rounded-2xl! flex flex-col md:flex-row items-center justify-between gap-4 border-slate-200/80 dark:border-slate-800 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            placeholder="Search by name, ID, phone..."
            containerClassName="w-full! sm:w-80!"
          />
          <SelectDropdown
            options={statusFilterOptions}
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            className="w-full sm:w-44"
          />
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>
      </Container>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 rounded-full border-3 border-indigo-600 border-t-transparent animate-spin" />
          <span className="text-sm font-semibold text-slate-500">Loading your assigned members...</span>
        </div>
      ) : isError ? (
        <Container variant="secondary" className="p-8 text-center rounded-2xl border-rose-200">
          <p className="text-sm font-semibold text-rose-600">
            {error instanceof Error ? error.message : "Failed to load assigned members."}
          </p>
          <Button onClick={() => refetch()} variant="secondary" size="sm" className="mt-4">
            Try Again
          </Button>
        </Container>
      ) : filteredMembers.length === 0 ? (
        <Container
          variant="secondary"
          className="p-12 text-center rounded-3xl border-dashed border-2 border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-3"
        >
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center text-2xl">
            <LuUsers />
          </div>
          <h4 className="text-lg font-bold text-slate-800 dark:text-white">No Members Found</h4>
          <p className="text-sm text-slate-500 max-w-sm">
            {searchQuery
              ? `No assigned members match your query "${searchQuery}".`
              : "You do not have any members assigned to your roster yet."}
          </p>
        </Container>
      ) : viewMode === "list" ? (
        /* Table View */
        <Container variant="secondary" className="p-0! rounded-3xl! overflow-hidden shadow-sm">
          <DataTable
            rows={filteredMembers}
            columns={columns}
            getRowId={(row) => row._id || row.userId}
            pageSize={10}
            height={550}
          />
        </Container>
      ) : (
        /* Cards Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredMembers.map((member) => {
            const initials = member.fullName?.trim()?.slice(0, 2).toUpperCase() || "MB";
            const att = member.todayAttendance;
            const assignment = member.assignment;
            const isAct = (assignment?.status || "ACTIVE").toUpperCase() === "ACTIVE";

            return (
              <div
                key={member._id || member.userId}
                className="group relative flex flex-col justify-between p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-300 shadow-xs hover:shadow-xl hover:-translate-y-1"
              >
                <div>
                  {/* Top Bar: Profile & Roster Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      {member.profileImage ? (
                        <img
                          src={member.profileImage}
                          alt={member.fullName}
                          className="w-13 h-13 rounded-2xl object-cover ring-2 ring-indigo-500/20 group-hover:ring-indigo-500 transition-all"
                        />
                      ) : (
                        <div className="w-13 h-13 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                          {initials}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {member.fullName}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                            {member.userId}
                          </span>
                          <span className="text-slate-300 dark:text-slate-700">•</span>
                          <span className="text-xs text-slate-500 capitalize">{member.gender}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border shrink-0 ${
                        isAct
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 border-emerald-300/40"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300 border-rose-300/40"
                      }`}
                    >
                      {assignment?.status || "ACTIVE"}
                    </span>
                  </div>

                  {/* Contact Snippets */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/70 flex flex-col gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <LuMail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <LuPhone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono">{member.phone}</span>
                    </div>
                  </div>

                  {/* Assigned Plans Badges */}
                  <div className="mt-4 flex flex-col gap-2 bg-slate-50/80 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Membership:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {member.membershipPlan?.planName || member.membershipPlan?.name || "None"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium flex items-center gap-1">
                        <LuDumbbell className="w-3 h-3 text-indigo-500" /> Workout:
                      </span>
                      <span className="font-medium text-slate-700 dark:text-slate-300 text-[11px] truncate max-w-[150px]">
                        {member.workoutPlan?.planName || member.workoutPlan?.name || "Default"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium flex items-center gap-1">
                        <LuSalad className="w-3 h-3 text-emerald-500" /> Diet:
                      </span>
                      <span className="font-medium text-slate-700 dark:text-slate-300 text-[11px] truncate max-w-[150px]">
                        {member.dietPlan?.planName || member.dietPlan?.name || "Default"}
                      </span>
                    </div>
                  </div>

                  {/* Today's Gym Attendance Status */}
                  <div className="mt-3 flex items-center justify-between px-3 py-2 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100/60 dark:border-indigo-900/30 text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                      <LuClock className="w-3.5 h-3.5 text-indigo-500" />
                      Today's Gym:
                    </span>
                    {att ? (
                      att.status === "Checked In" || att.status === "Present" ? (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          In Gym ({formatTime(att.checkIn)})
                        </span>
                      ) : (
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          Checked Out ({att.durationMinutes || 0}m)
                        </span>
                      )
                    ) : (
                      <span className="text-slate-400 font-medium italic">No attendance</span>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedMember(member)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors cursor-pointer"
                  >
                    <LuEye className="w-3.5 h-3.5" />
                    <span>View Profile</span>
                  </button>
                  <button
                    onClick={() => navigate(`/trainer/members-attendance?memberId=${member.userId}`)}
                    title="View Attendance Logs"
                    className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  >
                    <LuCalendarCheck2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Member Details Modal */}
      {selectedMember && (
        <Modal
          open={Boolean(selectedMember)}
          onClose={() => setSelectedMember(null)}
          slotProps={{
            backdrop: {
              sx: {
                backdropFilter: "blur(4px)",
                backgroundColor: "rgba(15, 23, 42, 0.65)",
              },
            },
          }}
        >
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 flex flex-col gap-6 max-h-[90vh] overflow-y-auto animate-scaleUp">
              {/* Modal Top Bar */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  {selectedMember.profileImage ? (
                    <img
                      src={selectedMember.profileImage}
                      alt={selectedMember.fullName}
                      className="w-16 h-16 rounded-2xl object-cover ring-4 ring-indigo-500/20"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                      {selectedMember.fullName?.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">
                      {selectedMember.fullName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 font-mono">
                        {selectedMember.userId}
                      </span>
                      <span className="text-xs text-slate-400 capitalize">• {selectedMember.gender}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedMember(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <LuX className="w-5 h-5" />
                </button>
              </div>

              {/* Contact & Emergency Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <LuUser className="w-3.5 h-3.5 text-indigo-500" /> Member Contact
                  </h5>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-semibold">Email:</span> {selectedMember.email}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    <span className="font-semibold">Phone:</span> {selectedMember.phone}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <LuShieldAlert className="w-3.5 h-3.5 text-rose-500" /> Emergency Contact
                  </h5>
                  {selectedMember.emergencyContact?.fullName ? (
                    <>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        <span className="font-semibold">Name:</span> {selectedMember.emergencyContact.fullName} ({selectedMember.emergencyContact.relation || "Contact"})
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                        <span className="font-semibold">Phone:</span> {selectedMember.emergencyContact.phone}
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No emergency contact provided</p>
                  )}
                </div>
              </div>

              {/* Roster Assignment & Validity */}
              <div className="p-4 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                    <LuCalendar className="w-3.5 h-3.5" /> Coaching Assignment
                  </h5>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    Duration: {formatDate(selectedMember.assignment?.startDate)} to {formatDate(selectedMember.assignment?.endDate)}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  {selectedMember.assignment?.status || "ACTIVE"}
                </span>
              </div>

              {/* Assigned Plans Breakdown */}
              <div className="flex flex-col gap-3">
                <h5 className="text-sm font-bold text-slate-800 dark:text-white">Assigned Programs</h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Membership
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-white mt-1">
                      {selectedMember.membershipPlan?.planName || selectedMember.membershipPlan?.name || "Standard"}
                    </span>
                    {selectedMember.membershipPlan?.price !== undefined && (
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                        ₹{selectedMember.membershipPlan.price}
                      </span>
                    )}
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Workout Routine
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-white mt-1">
                      {selectedMember.workoutPlan?.planName || selectedMember.workoutPlan?.name || "General Fitness"}
                    </span>
                    {selectedMember.workoutPlan?.fitnessGoal && (
                      <span className="text-[11px] text-indigo-500 font-medium mt-0.5">
                        Goal: {selectedMember.workoutPlan.fitnessGoal}
                      </span>
                    )}
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Diet Strategy
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-white mt-1">
                      {selectedMember.dietPlan?.planName || selectedMember.dietPlan?.name || "Balanced Nutrition"}
                    </span>
                    {selectedMember.dietPlan?.goal && (
                      <span className="text-[11px] text-amber-500 font-medium mt-0.5">
                        {selectedMember.dietPlan.goal}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Today's Activity Details */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex flex-col gap-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <LuClock className="w-3.5 h-3.5 text-indigo-500" /> Today's Gym Attendance
                </h5>
                {selectedMember.todayAttendance ? (
                  <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Status:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {selectedMember.todayAttendance.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Check In:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {formatTime(selectedMember.todayAttendance.checkIn)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Check Out:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {selectedMember.todayAttendance.checkOut
                          ? formatTime(selectedMember.todayAttendance.checkOut)
                          : "Active in Gym"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No attendance recorded today.</p>
                )}
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button
                  onClick={() => setSelectedMember(null)}
                  variant="secondary"
                  size="sm"
                  className="rounded-xl!"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    const id = selectedMember.userId;
                    setSelectedMember(null);
                    navigate(`/trainer/members-attendance?memberId=${id}`);
                  }}
                  variant="primary"
                  size="sm"
                  className="rounded-xl! font-semibold!"
                >
                  <span>View Member Attendance</span>
                  <LuArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TrainerAssignedMembers;
