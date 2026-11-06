import { useSelector } from "react-redux";
import { LuCircleAlert } from "react-icons/lu";
import { selectUser } from "@/modules/auth/redux/auth.selector";
import PageHeader from "@/shared/components/ui/page/PageHeader";
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
import TrainerDashboard from "../components/trainer/TrainerDashboard";
import MemberDashboard from "../components/member/MemberDashboard";
import type {
  TrainerDashboardData,
  MemberDashboardData,
  DashboardOverviewData,
} from "../types/dashboard.types";

const DashboardSkeleton = () => (
  <div className="flex flex-col gap-6 w-full animate-pulse select-none">
    {/* KPI skeletons */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5 w-full">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-28 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800"
        />
      ))}
    </div>

    {/* Chart skeletons */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      <div className="h-72 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800" />
      <div className="h-72 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800" />
    </div>

    {/* Secondary charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      <div className="h-64 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800" />
      <div className="h-64 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800" />
    </div>

    {/* Widget skeletons */}
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
      <div className="h-80 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800" />
      <div className="h-80 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800" />
      <div className="h-80 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800" />
    </div>
  </div>
);

const Dashboard = () => {
  const currentUser = useSelector(selectUser);
  const { data, isLoading, isError, error, refetch } =
    useDashboardOverview();

  const overview = data?.data;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const firstName = currentUser?.fullName?.trim()?.split(" ")[0] || "there";
  const greeting = `${getGreeting()}, ${firstName}`;

  return (
    <div className="flex flex-col gap-6 w-full pb-10 transition-colors duration-300">
      {/* Top Header via Common PageHeader */}
      {currentUser?.role?.toLowerCase() === "admin" && (
        <PageHeader
          title={greeting}
          description="Monitor member activity, attendance trends, and daily gym operations across IronParadise."
        />
      )}

      {/* Loading Skeleton */}
      {isLoading && <DashboardSkeleton />}

      {/* Error State */}
      {isError && (
        <Container
          variant="secondary"
          className="w-full! max-w-none! mx-0! p-6! rounded-2xl! border-rose-300! dark:border-rose-900/50! bg-rose-50/50! dark:bg-rose-950/20! flex-col items-center justify-center text-center gap-3 my-4"
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

      {/* Loaded Trainer Dashboard Content */}
      {overview && currentUser?.role?.toLowerCase() === "trainer" && (
        <TrainerDashboard
          overview={overview as unknown as TrainerDashboardData}
        />
      )}

      {/* Loaded Member Dashboard Content */}
      {overview && currentUser?.role?.toLowerCase() === "member" && (
        <MemberDashboard
          overview={overview as unknown as MemberDashboardData}
        />
      )}

      {/* Loaded Admin Dashboard Content */}
      {overview && currentUser?.role?.toLowerCase() === "admin" && (
        <div className="flex flex-col gap-6 w-full">
          {/* Section 1: KPI Metrics Grid */}
          <section aria-label="Key Performance Indicators" className="w-full">
            <DashboardKpiGrid
              kpis={(overview as unknown as DashboardOverviewData).kpis}
            />
          </section>

          {/* Section 2: Primary Visualizations (Attendance Trend & 6-Month Financials) */}
          <section aria-label="Primary Trends and Financials" className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
              <Container
                variant="secondary"
                className="w-full! max-w-none! mx-0! p-4! sm:p-5! rounded-2xl! flex-col justify-between"
              >
                <AttendanceTrendChart
                  data={
                    (overview as unknown as DashboardOverviewData)
                      .attendanceTrends
                  }
                />
              </Container>

              <Container
                variant="secondary"
                className="w-full! max-w-none! mx-0! p-4! sm:p-5! rounded-2xl! flex-col justify-between"
              >
                <RevenueMetricsChart
                  financialOverview={
                    (overview as unknown as DashboardOverviewData)
                      .financialOverview
                  }
                />
              </Container>
            </div>
          </section>

          {/* Section 3: Secondary Visualizations (Membership Plan Share & Peak Hours) */}
          <section aria-label="Distribution and Peak Hours" className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
              <Container
                variant="secondary"
                className="w-full! max-w-none! mx-0! p-4! sm:p-5! rounded-2xl! flex-col justify-between"
              >
                <PlanDistributionChart
                  data={
                    (overview as unknown as DashboardOverviewData)
                      .planDistribution
                  }
                />
              </Container>

              <Container
                variant="secondary"
                className="w-full! max-w-none! mx-0! p-4! sm:p-5! rounded-2xl! flex-col justify-between"
              >
                <PeakHoursHeatmap
                  data={
                    (overview as unknown as DashboardOverviewData).peakHours
                  }
                />
              </Container>
            </div>
          </section>

          {/* Section 4: Operational Feeds (Check-Ins, Events & Birthdays, Inquiries) */}
          <section aria-label="Operational Feeds" className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
              <RecentCheckInsWidget
                checkIns={
                  (overview as unknown as DashboardOverviewData).recentCheckIns
                }
              />
              <UpcomingEventsWidget
                events={
                  (overview as unknown as DashboardOverviewData).upcomingEvents
                }
                birthdays={
                  (overview as unknown as DashboardOverviewData)
                    .birthdaysThisMonth
                }
              />
              <RecentEnquiriesWidget
                enquiries={
                  (overview as unknown as DashboardOverviewData).recentEnquiries
                }
              />
            </div>
          </section>

          {/* Section 5: Demographics & Catalog Blueprints */}
          <section
            aria-label="Demographics and Program Blueprint Catalog"
            className="w-full"
          >
            <DemographicsAndPlansWidget
              demographics={
                (overview as unknown as DashboardOverviewData).demographics
              }
              plansOverview={
                (overview as unknown as DashboardOverviewData).plansOverview
              }
            />
          </section>

          {/* Section 6: Quick Action Operations Bar */}
          <section aria-label="Quick Actions" className="w-full">
            <QuickActionsWidget />
          </section>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
