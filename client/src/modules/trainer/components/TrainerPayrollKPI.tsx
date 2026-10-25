import { KPIGrid, type KPIGridProps } from "@/shared/components/ui/kpi";
import useTrainerPayrollKPI, {
  type UseTrainerPayrollKPIOptions,
} from "../hooks/use-trainer-payroll.kpi";

export interface TrainerPayrollKPIProps extends UseTrainerPayrollKPIOptions {
  columns?: KPIGridProps["columns"];
  className?: string;
}

const TrainerPayrollKPI = ({
  columns = 4,
  className = "",
  ...options
}: TrainerPayrollKPIProps = {}) => {
  const { kpiData } = useTrainerPayrollKPI(options);

  return <KPIGrid items={kpiData} columns={columns} className={className} />;
};

export default TrainerPayrollKPI;
