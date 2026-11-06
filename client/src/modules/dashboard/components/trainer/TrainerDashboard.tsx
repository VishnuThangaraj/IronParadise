import { useNavigate } from "react-router-dom";
import {
  LuUsers,
  LuCalendarCheck2,
  LuDumbbell,
  LuFlame,
  LuClock,
  LuArrowRight,
  LuCalendar,
  LuSparkles,
  LuShieldCheck,
  LuUserCheck,
  LuTrendingUp,
} from "react-icons/lu";
import Container from "@/shared/components/ui/containers/Container";
import KPICard from "@/shared/components/ui/kpi/KPICard";
import type { TrainerDashboardData } from "../../types/dashboard.types";

interface TrainerDashboardProps {
  overview: TrainerDashboardData;
}

export const TrainerDashboard = ({ overview }: TrainerDashboardProps) => {
  const navigate = useNavigate();
  const { trainerProfile, kpis, todayAttendanceFeed, assignedMembers, personalStats, upcomingEvents } = overview;

  const formatTime = (isoString?: string | null) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const firstName = trainerProfile?.fullName?.trim()?.split(" ")[0] || "Coach";

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn transition-colors duration-300">
      {/* Hero Trainer Profile Banner */}
      <Container
        variant="secondary"
        className="w-full! max-w-none! mx-0! p-6! sm:p-8! rounded-3xl! border-indigo-200/50! dark:border-indigo-900/30! bg-linear-to-br from-white via-indigo-50/20 to-slate-50 dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="relative shrink-0">
            {trainerProfile.profileImage ? (
              <img
                src={trainerProfile.profileImage}
                alt={trainerProfile.fullName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-indigo-500/20 shadow-md"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-black ring-4 ring-indigo-500/20 shadow-md">
                {firstName[0]}
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 flex items-center justify-center text-[10px] text-white">
              ✓
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                {getGreeting()}, {firstName}!
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-300/40 dark:border-indigo-500/30">
                {trainerProfile.userId}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              {trainerProfile.qualification} • {trainerProfile.experienceYears} Years Experience
            </p>

            {/* Specialization Tags */}
            <div className="flex flex-wrap gap-1.5 mt-1">
              {trainerProfile.specialization?.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Shift & Personal Attendance Badge */}
        <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2.5 shrink-0 bg-white/60 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 backdrop-blur-xs w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <LuClock className="w-4 h-4 text-indigo-500" />
            <span>
              Shift: {trainerProfile.shiftTime?.start} - {trainerProfile.shiftTime?.end}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <LuShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>
              Today:{" "}
              {personalStats.todayCheckedIn
                ? `Checked In (${formatTime(personalStats.todayCheckInTime)})`
                : "Not Punched Yet"}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500">
            Month Attendance: <strong className="text-slate-700 dark:text-slate-200">{personalStats.personalAttendanceThisMonth}</strong> days completed
          </div>
        </div>
      </Container>

      {/* KPI Grid */}
      <section aria-label="Trainer Key Metrics" className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5 w-full">
          <KPICard
            title="Assigned Members"
            value={kpis.totalAssignedMembers.toLocaleString()}
            subtitle={`${kpis.activeAssignedMembers} active trainees`}
            change="Roster Size"
            trend="neutral"
            icon={LuUsers}
            color="indigo"
            onClick={() => navigate("/trainer/my-members")}
          />
          <KPICard
            title="Present Today"
            value={kpis.todayAssignedPresent.toLocaleString()}
            subtitle={`${kpis.attendanceRate}% of assigned attended`}
            change={`${kpis.attendanceRate}%`}
            trend={kpis.attendanceRate >= 70 ? "up" : "neutral"}
            icon={LuCalendarCheck2}
            color="emerald"
            onClick={() => navigate("/trainer/members-attendance")}
          />
          <KPICard
            title="Training Now"
            value={kpis.currentlyCheckedIn.toLocaleString()}
            subtitle="Currently on floor"
            change="Live Count"
            trend={kpis.currentlyCheckedIn > 0 ? "up" : "neutral"}
            icon={LuDumbbell}
            color="cyan"
          />
          <KPICard
            title="Workout Plans"
            value={kpis.activeWorkoutPlans.toLocaleString()}
            subtitle="Supervised routines"
            change="Active"
            trend="neutral"
            icon={LuFlame}
            color="amber"
            onClick={() => navigate("/plan/workout/list")}
          />
          <KPICard
            title="Diet Plans"
            value={kpis.activeDietPlans.toLocaleString()}
            subtitle="Nutrition tracks"
            change="Active"
            trend="neutral"
            icon={LuSparkles}
            color="rose"
            onClick={() => navigate("/plan/diet/list")}
          />
          <KPICard
            title="Turnout Rate"
            value={`${kpis.attendanceRate}%`}
            subtitle="Today's consistency"
            change="Turnout"
            trend={kpis.attendanceRate >= 50 ? "up" : "down"}
            icon={LuTrendingUp}
            color="violet"
          />
        </div>
      </section>

      {/* Middle Section: Today's Assigned Member Presence & Quick Assigned Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* Live Assigned Members Check-In Feed */}
        <Container
          variant="secondary"
          className="w-full! max-w-none! mx-0! p-5! rounded-2xl! flex flex-col justify-between"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20">
                <LuUserCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Assigned Members Activity Today
                </h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  Real-time gym visits by your trainees
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/trainer/members-attendance")}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Full Log <LuArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar max-h-84 divide-y divide-slate-100 dark:divide-slate-800/60 my-2">
            {todayAttendanceFeed.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center gap-2">
                <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                  <LuCalendarCheck2 className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  No assigned members have logged attendance today yet
                </p>
                <p className="text-[11px] text-slate-400">
                  When your trainees punch in at the kiosk, their session will appear here in real time.
                </p>
              </div>
            ) : (
              todayAttendanceFeed.map((rec) => (
                <div key={rec.attendanceId} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {rec.profileImage ? (
                      <img
                        src={rec.profileImage}
                        alt={rec.fullName}
                        className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300">
                        {rec.fullName[0]}
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {rec.fullName}
                      </p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">
                        In: {formatTime(rec.checkIn)}
                        {rec.checkOut ? ` • Out: ${formatTime(rec.checkOut)}` : " • In Session"}
                      </p>
                    </div>
                  </div>

                  <div>
                    {!rec.checkOut || rec.status === "checked_in" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        On Floor
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </Container>

        {/* Assigned Trainees Directory Snapshot */}
        <Container
          variant="secondary"
          className="w-full! max-w-none! mx-0! p-5! rounded-2xl! flex flex-col justify-between"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 border border-indigo-500/20">
                <LuUsers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Assigned Members Overview
                </h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  {assignedMembers.length} active client profiles
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/trainer/my-members")}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              View Roster <LuArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar max-h-84 divide-y divide-slate-100 dark:divide-slate-800/60 my-2">
            {assignedMembers.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center gap-2">
                <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                  <LuUsers className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  No members are currently assigned to you
                </p>
                <p className="text-[11px] text-slate-400">
                  When gym administration assigns trainees to your coaching roster, they will show up here.
                </p>
              </div>
            ) : (
              assignedMembers.slice(0, 6).map((member) => (
                <div key={member.userId} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {member.profileImage ? (
                      <img
                        src={member.profileImage}
                        alt={member.fullName}
                        className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xs font-bold">
                        {member.fullName[0]}
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {member.fullName}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {member.membershipPlan?.planName || member.membershipPlan?.name || "Standard Membership"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {member.workoutPlan && (
                      <span className="hidden sm:inline-block px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300 border border-amber-300/40 dark:border-amber-500/20">
                        Workout: {member.workoutPlan.name}
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        member.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 border border-emerald-500/30"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {member.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Container>
      </div>

      {/* Bottom Section: Upcoming Gym Events & Quick Action Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {/* Quick Actions Card */}
        <Container
          variant="secondary"
          className="w-full! max-w-none! mx-0! p-5! rounded-2xl! flex flex-col justify-between lg:col-span-1"
        >
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Trainer Quick Actions
            </h3>
            <p className="text-[11px] text-slate-400 mb-4">
              Frequent coaching workflows and member tracking
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => navigate("/trainer/my-members")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800/60 dark:hover:bg-indigo-950/30 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 transition-all cursor-pointer font-bold text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <LuUsers className="w-4 h-4 text-indigo-500" />
                  <span>My Assigned Members</span>
                </div>
                <LuArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => navigate("/trainer/members-attendance")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800/60 dark:hover:bg-emerald-950/30 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 transition-all cursor-pointer font-bold text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <LuCalendarCheck2 className="w-4 h-4 text-emerald-500" />
                  <span>Member Attendance History</span>
                </div>
                <LuArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => navigate("/plan/workout/list")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-100 hover:bg-amber-50 dark:bg-slate-800/60 dark:hover:bg-amber-950/30 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 transition-all cursor-pointer font-bold text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <LuFlame className="w-4 h-4 text-amber-500" />
                  <span>Workout Plans Library</span>
                </div>
                <LuArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => navigate("/plan/diet/list")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-100 hover:bg-rose-50 dark:bg-slate-800/60 dark:hover:bg-rose-950/30 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 transition-all cursor-pointer font-bold text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <LuSparkles className="w-4 h-4 text-rose-500" />
                  <span>Diet & Nutrition Plans</span>
                </div>
                <LuArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </Container>

        {/* Upcoming Gym Events */}
        <Container
          variant="secondary"
          className="w-full! max-w-none! mx-0! p-5! rounded-2xl! flex flex-col justify-between lg:col-span-2"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 border border-purple-500/20">
                <LuCalendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Upcoming Gym Events & Competitions
                </h3>
                <p className="text-[11px] text-slate-400">
                  Schedules, fitness workshops & community challenges
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/events")}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Calendar <LuArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 divide-y divide-slate-100 dark:divide-slate-800/60 my-2">
            {upcomingEvents.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No events scheduled at this moment.
              </div>
            ) : (
              upcomingEvents.slice(0, 3).map((evt) => (
                <div key={evt.eventId} className="py-3 flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {evt.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {evt.description}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-block px-2 py-0.5 rounded-lg text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                      {evt.date} • {evt.time}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Container>
      </div>
    </div>
  );
};

export default TrainerDashboard;
