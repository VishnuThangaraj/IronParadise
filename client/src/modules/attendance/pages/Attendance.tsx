import PageHeader from "@/shared/components/ui/page/PageHeader";
import AttendanceKPI from "../components/AttendanceKPI";

const Attendance = () => {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <PageHeader
            title="Attendance Console"
            description="Scan cards, register entries/exits, and track live occupancy in real-time."
          />
        </div>
      </div>
      <AttendanceKPI />
    </div>
  );
};

export default Attendance;
