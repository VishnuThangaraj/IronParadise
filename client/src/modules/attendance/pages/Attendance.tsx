import PageHeader from "@/shared/components/ui/page/PageHeader";
import AttendanceKPI from "../components/AttendanceKPI";
import AttendanceConsoleWidget from "../components/AttendanceConsoleWidget";
import AttendanceCalendarView from "../components/AttendanceCalendarView";

const Attendance = () => {
  return (
    <div className="flex flex-col gap-6 w-full pb-8">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <PageHeader
            title="Attendance Console"
            description="Scan cards, register entries/exits, and track live occupancy in real-time."
          />
        </div>
      </div>

      {/* Overview Statistics KPIs */}
      <AttendanceKPI />

      {/* Main 2-Column Section: Left Console Widget & Right Monthly Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
        {/* Left Column: Quick Check In / Check Out Action Console */}
        <div className="lg:col-span-4 xl:col-span-4 w-full">
          <AttendanceConsoleWidget />
        </div>

        {/* Right Column: Monthly Calendar View with dynamic check-ins */}
        <div className="lg:col-span-8 xl:col-span-8 w-full">
          <AttendanceCalendarView />
        </div>
      </div>
    </div>
  );
};

export default Attendance;
