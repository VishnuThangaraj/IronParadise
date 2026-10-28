import { useSelector } from "react-redux";
import {
  LuRefreshCw,
  LuShieldCheck,
  LuCircleAlert,
} from "react-icons/lu";
import { selectUser } from "@/modules/auth/redux/auth.selector";
import Container from "@/shared/components/ui/containers/Container";
import useDashboardOverview from "../hooks/use-dashboard";
import DashboardKpiGrid from "../components/DashboardKpiGrid";
import {
  AttendanceTrendChart,
  RevenueMetricsChart,
  PlanDistributionChart,
  PeakHoursHeatmap,
} from "../components/charts";
import {
  RecentCheckInsWidget,
  UpcomingEventsWidget,
  QuickActionsWidget,
  DemographicsAndPlansWidget,
  RecentEnquiriesWidget,
} from "../components/widgets";

const DashboardSkeleton = () => (
  <div className="flex flex-col gap-6 animate-pulse select-none">
    {/* KPI skeletons */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-28 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800"
        />
      ))}
    </div>

    {/* Chart skeletons */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="h-72 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800" />
      <div className="h-72 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800" />
    </div>

    {/* Secondary charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="h-64 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800" />
      <div className="h-64 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800" />
    </div>

    {/* Widget skeletons */}
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div className="h-80 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800" />
      <div className="h-80 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800" />
      <div className="h-80 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800" />
    </div>
  </div>
);

const Dashboard = () => {
  const currentUser = useSelector(selectUser);
  const { data, isLoading, isError, error, refetch, isFetching } =
    useDashboardOverview();

  const overview = data?.data;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12 transition-colors duration-300">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/70 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              {getGreeting()},{" "}
              <span className="text-indigo-600 dark:text-indigo-400">
                {currentUser?.fullName?.split(" ")[0] || "Coach"}
              </span>
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60 shadow-xs">
              <LuShieldCheck className="w-3 h-3" />
              {currentUser?.role || "Admin"}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <span>IronParadise command center</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live overview & operations
            </span>
          </p>
        </div>

        {/* Header Right Action Buttons */}
        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer transition-all shadow-xs active:scale-95 disabled:opacity-50"
            title="Refresh dashboard data"
          >
            <LuRefreshCw
              className={`w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 ${
                isFetching ? "animate-spin" : ""
              }`}
            />
            <span>{isFetching ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && <DashboardSkeleton />}

      {/* Error State */}
      {isError && (
        <Container
          variant="secondary"
          className="p-6! rounded-2xl! border-rose-300! dark:border-rose-900/50! bg-rose-50/50! dark:bg-rose-950/20! flex-col items-center justify-center text-center gap-3 my-4"
        >
          <div className="p-3 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400">
            <LuCircleAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-rose-800 dark:text-rose-300">
              Failed to load dashboard overview
            </h3>
            <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 max-w-md">
              {error?.message || "An error occurred while communicating with the server."}
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="px-4 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer shadow-sm"
          >
            Retry Connection
          </button>
        </Container>
      )}

      {/* Loaded Dashboard Content */}
      {overview && (
        <div className="flex flex-col gap-6">
          {/* Section 1: KPI Metrics Grid */}
          <section aria-label="Key Performance Indicators">
            <DashboardKpiGrid kpis={overview.kpis} />
          </section>

          {/* Section 2: Primary Visualizations (Attendance Trend & 6-Month Financials) */}
          <section aria-label="Primary Trends and Financials">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Container
                variant="secondary"
                className="w-full! max-w-none! mx-0! p-4! sm:p-5! rounded-2xl! flex-col justify-between"
              >
                <AttendanceTrendChart data={overview.attendanceTrends} />
              </Container>

              <Container
                variant="secondary"
                className="w-full! max-w-none! mx-0! p-4! sm:p-5! rounded-2xl! flex-col justify-between"
              >
                <RevenueMetricsChart
                  financialOverview={overview.financialOverview}
                />
              </Container>
            </div>
          </section>

          {/* Section 3: Secondary Visualizations (Membership Plan Share & Peak Hours) */}
          <section aria-label="Distribution and Peak Hours">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Container
                variant="secondary"
                className="w-full! max-w-none! mx-0! p-4! sm:p-5! rounded-2xl! flex-col justify-between"
              >
                <PlanDistributionChart data={overview.planDistribution} />
              </Container>

              <Container
                variant="secondary"
                className="w-full! max-w-none! mx-0! p-4! sm:p-5! rounded-2xl! flex-col justify-between"
              >
                <PeakHoursHeatmap data={overview.peakHours} />
              </Container>
            </div>
          </section>

          {/* Section 4: Operational Feeds (Check-Ins, Events & Birthdays, Inquiries) */}
          <section aria-label="Operational Feeds">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <RecentCheckInsWidget checkIns={overview.recentCheckIns} />
              <UpcomingEventsWidget
                events={overview.upcomingEvents}
                birthdays={overview.birthdaysThisMonth}
              />
              <RecentEnquiriesWidget enquiries={overview.recentEnquiries} />
            </div>
          </section>

          {/* Section 5: Demographics & Catalog Blueprints */}
          <section aria-label="Demographics and Program Blueprint Catalog">
            <DemographicsAndPlansWidget
              demographics={overview.demographics}
              plansOverview={overview.plansOverview}
            />
          </section>

          {/* Section 6: Quick Action Operations Bar */}
          <section aria-label="Quick Actions">
            <QuickActionsWidget />
          </section>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
