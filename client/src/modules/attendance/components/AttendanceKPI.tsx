import { KPIGrid, type KPIGridProps } from "@/shared/components/ui/kpi";
import useAttendanceKPI, {
  type UseAttendanceKPIOptions,
} from "../hooks/use-attendance.kpi";

export interface AttendanceKPIProps extends UseAttendanceKPIOptions {
  columns?: KPIGridProps["columns"];
  className?: string;
}

const AttendanceKPI = ({
  columns = 5,
  className = "",
  ...options
}: AttendanceKPIProps = {}) => {
  const { kpiData } = useAttendanceKPI(options);

  return <KPIGrid items={kpiData} columns={columns} className={className} />;
};

export default AttendanceKPI;
