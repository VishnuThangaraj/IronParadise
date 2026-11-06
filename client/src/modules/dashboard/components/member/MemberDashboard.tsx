import { useNavigate } from "react-router-dom";
import {
  LuFlame,
  LuCalendarCheck2,
  LuClock,
  LuDumbbell,
  LuSalad,
  LuUsers,
  LuCalendar,
  LuArrowRight,
  LuCreditCard,
  LuSparkles,
  LuShieldCheck,
  LuActivity,
  LuCheck,
} from "react-icons/lu";

import Container from "@/shared/components/ui/containers/Container";
import KPICard from "@/shared/components/ui/kpi/KPICard";
import type { MemberDashboardData } from "../../types/dashboard.types";

interface MemberDashboardProps {
  overview: MemberDashboardData;
}

export const MemberDashboard = ({ overview }: MemberDashboardProps) => {
  const navigate = useNavigate();
  const {
    memberProfile,
    kpis,
    activeMembership,
    assignedTrainer,
    assignedWorkoutPlan,
    assignedDietPlan,
    recentAttendance,
    paymentSummary,
  } = overview;

  const formatTime = (isoString?: string | null) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const firstName = memberProfile?.fullName?.trim()?.split(" ")[0] || "Athlete";

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn transition-colors duration-300">
      {/* Hero Member Profile Banner */}
      <Container
        variant="secondary"
        className="w-full! max-w-none! mx-0! p-6! sm:p-8! rounded-3xl! border-indigo-200/50! dark:border-indigo-900/30! bg-linear-to-br from-white via-indigo-50/20 to-slate-50 dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="relative shrink-0">
            {memberProfile.profileImage ? (
              <img
                src={memberProfile.profileImage}
                alt={memberProfile.fullName}
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
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-300/40 dark:border-indigo-500/30 font-mono">
                {memberProfile.userId}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              {activeMembership ? (
                <>
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                    {activeMembership.planName || activeMembership.name}
                  </span>{" "}
                  • Valid until {formatDate(activeMembership.endDate)}
                </>
              ) : (
                "No active membership plan"
              )}
            </p>

            {/* Streak & Plan Status Badge */}
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                <LuFlame className="w-3.5 h-3.5 text-amber-500" />
                {kpis.attendanceStreak > 0
                  ? `${kpis.attendanceStreak} Day Streak 🔥`
                  : "Start streak today!"}
              </span>

              {kpis.daysRemainingInPlan > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                  <LuShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  {kpis.daysRemainingInPlan} days remaining
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Today's Gym Status Badge */}
        <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2 shrink-0 bg-white/70 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 backdrop-blur-xs w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Today's Gym Status
          </span>
          {kpis.todayGymStatus === "CHECKED_IN" ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>In Gym (Since {formatTime(kpis.todayCheckInTime)})</span>
            </div>
          ) : kpis.todayGymStatus === "COMPLETED" ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30 text-xs font-bold">
              <LuCheck className="w-3.5 h-3.5 text-blue-500" />
              <span>Workout Completed Today</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span>Not Visited Yet Today</span>
            </div>
          )}
        </div>
      </Container>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Monthly Visits"
          value={kpis.totalVisitsThisMonth}
          subtitle="Gym check-ins this month"
          icon={<LuCalendarCheck2 className="w-6 h-6 text-emerald-500" />}
          color="emerald"
        />

        <KPICard
          title="Workout Streak"
          value={`${kpis.attendanceStreak} Days`}
          subtitle="Consecutive gym days"
          icon={<LuFlame className="w-6 h-6 text-amber-500" />}
          color="amber"
        />

        <KPICard
          title="Avg Session"
          value={`${kpis.averageSessionMinutes} mins`}
          subtitle="Typical workout time"
          icon={<LuClock className="w-6 h-6 text-indigo-500" />}
          color="indigo"
        />

        <KPICard
          title="Plan Validity"
          value={`${kpis.daysRemainingInPlan} Days`}
          subtitle="Remaining on membership"
          icon={<LuShieldCheck className="w-6 h-6 text-blue-500" />}
          color="blue"
        />
      </div>

      {/* Main Two-Column Row: Assigned Coach & Active Programs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Assigned Personal Trainer (5 cols) */}
        <Container
          variant="secondary"
          className="lg:col-span-5 w-full! max-w-none! mx-0! p-6! rounded-3xl! flex flex-col justify-between gap-5 border-slate-200/80 dark:border-slate-800"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <LuUsers className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-800 dark:text-white">
                Assigned Personal Trainer
              </h3>
            </div>
            {assignedTrainer && (
              <button
                onClick={() => navigate("/member/my-trainer")}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                Profile <LuArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {assignedTrainer ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                {assignedTrainer.profileImage ? (
                  <img
                    src={assignedTrainer.profileImage}
                    alt={assignedTrainer.fullName}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/20"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
                    {assignedTrainer.fullName?.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                  <h4 className="font-bold text-base text-slate-900 dark:text-white truncate">
                    {assignedTrainer.fullName}
                  </h4>
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                    {assignedTrainer.qualification}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5">
                    {assignedTrainer.experienceYears} Years Experience
                  </span>
                </div>
              </div>

              {/* Specializations & Shift Hours */}
              <div className="flex flex-col gap-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Available Shift:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {assignedTrainer.shiftTime?.start} - {assignedTrainer.shiftTime?.end}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {assignedTrainer.specialization?.map((spec, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => navigate("/member/my-trainer")}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 border border-indigo-200/60 dark:border-indigo-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View Full Coach Profile & Contact</span>
                <LuArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-2">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No Trainer Assigned Yet
              </p>
              <p className="text-xs text-slate-400 max-w-xs">
                Contact the gym front desk or administration to get a personal coach assigned.
              </p>
            </div>
          )}
        </Container>

        {/* Right Column: Active Workout & Diet Strategy (7 cols) */}
        <Container
          variant="secondary"
          className="lg:col-span-7 w-full! max-w-none! mx-0! p-6! rounded-3xl! flex flex-col justify-between gap-5 border-slate-200/80 dark:border-slate-800"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <LuActivity className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-800 dark:text-white">
                Active Fitness Programs
              </h3>
            </div>
            <button
              onClick={() => navigate("/member/my-plans")}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              All Plans <LuArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Workout Routine Card */}
            <div className="p-5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-900/40 flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <LuDumbbell className="w-3.5 h-3.5" /> Workout Plan
                </span>
                {assignedWorkoutPlan?.difficulty && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                    {assignedWorkoutPlan.difficulty}
                  </span>
                )}
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {assignedWorkoutPlan?.planName || assignedWorkoutPlan?.name || "General Gym Routine"}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Goal: {assignedWorkoutPlan?.fitnessGoal || "Overall strength & conditioning"}
                </p>
              </div>

              <button
                onClick={() => navigate("/member/my-plans")}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 pt-1 cursor-pointer"
              >
                View Exercises <LuArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Diet Plan Card */}
            <div className="p-5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/40 flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <LuSalad className="w-3.5 h-3.5" /> Diet Strategy
                </span>
                {assignedDietPlan?.caloriesPerDay && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
                    {assignedDietPlan.caloriesPerDay} kcal
                  </span>
                )}
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {assignedDietPlan?.planName || assignedDietPlan?.name || "Healthy Nutrition Strategy"}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Focus: {assignedDietPlan?.goal || "Clean eating & macronutrient balance"}
                </p>
              </div>

              <button
                onClick={() => navigate("/member/my-plans")}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 pt-1 cursor-pointer"
              >
                View Meals <LuArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* Bottom Row: Recent Attendance Feed & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recent Attendance Log (7 cols) */}
        <Container
          variant="secondary"
          className="lg:col-span-7 w-full! max-w-none! mx-0! p-6! rounded-3xl! flex flex-col gap-4 border-slate-200/80 dark:border-slate-800"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <LuCalendarCheck2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-800 dark:text-white">
                Recent Gym Attendance
              </h3>
            </div>
            <button
              onClick={() => navigate("/member/my-attendance")}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              Full History <LuArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentAttendance && recentAttendance.length > 0 ? (
            <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800/80">
              {recentAttendance.slice(0, 5).map((log) => (
                <div
                  key={log.attendanceId}
                  className="py-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                      <LuCalendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {formatDate(log.date || log.checkIn)}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Check-in: {formatTime(log.checkIn)}{" "}
                        {log.checkOut && `• Check-out: ${formatTime(log.checkOut)}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium text-slate-600 dark:text-slate-300">
                      {log.durationMinutes > 0 ? `${log.durationMinutes}m` : "Active"}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.status === "Checked In"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                          : "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              No recent attendance recorded. Visit the gym kiosk to check in!
            </div>
          )}
        </Container>

        {/* Quick Member Actions & Membership Snapshot (5 cols) */}
        <Container
          variant="secondary"
          className="lg:col-span-5 w-full! max-w-none! mx-0! p-6! rounded-3xl! flex flex-col justify-between gap-5 border-slate-200/80 dark:border-slate-800"
        >
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <LuSparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-800 dark:text-white">
              Quick Member Services
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/member/my-attendance")}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 border border-slate-200/60 dark:border-slate-800 transition-all flex items-center gap-3 text-left cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <LuCalendarCheck2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h5 className="font-bold text-xs text-slate-800 dark:text-white">Attendance</h5>
                <p className="text-[10px] text-slate-400 truncate">View monthly logs</p>
              </div>
            </button>

            <button
              onClick={() => navigate("/member/my-trainer")}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 border border-slate-200/60 dark:border-slate-800 transition-all flex items-center gap-3 text-left cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <LuUsers className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h5 className="font-bold text-xs text-slate-800 dark:text-white">My Trainer</h5>
                <p className="text-[10px] text-slate-400 truncate">Coach details & shift</p>
              </div>
            </button>

            <button
              onClick={() => navigate("/member/my-plans")}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 border border-slate-200/60 dark:border-slate-800 transition-all flex items-center gap-3 text-left cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <LuDumbbell className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h5 className="font-bold text-xs text-slate-800 dark:text-white">My Plans</h5>
                <p className="text-[10px] text-slate-400 truncate">Workout & diet</p>
              </div>
            </button>

            <button
              onClick={() => navigate("/member/my-membership")}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 border border-slate-200/60 dark:border-slate-800 transition-all flex items-center gap-3 text-left cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <LuCreditCard className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h5 className="font-bold text-xs text-slate-800 dark:text-white">Membership</h5>
                <p className="text-[10px] text-slate-400 truncate">Receipts & status</p>
              </div>
            </button>
          </div>

          {/* Membership Renewal & Payment Alert */}
          {paymentSummary && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Payment Status
                </span>
                <p className="font-bold text-xs text-slate-800 dark:text-white mt-0.5">
                  {paymentSummary.paymentStatus}
                </p>
              </div>
              {paymentSummary.amountDue > 0 ? (
                <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300 border border-rose-200">
                  Due: ₹{paymentSummary.amountDue}
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 border border-emerald-200">
                  Fully Paid
                </span>
              )}
            </div>
          )}
        </Container>
      </div>
    </div>
  );
};

export default MemberDashboard;
