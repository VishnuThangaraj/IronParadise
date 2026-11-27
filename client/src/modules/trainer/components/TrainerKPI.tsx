import { KPIGrid, type KPIGridProps } from "@/shared/components/ui/kpi";
import useTrainerKPI, {
  type UseTrainerKPIOptions,
} from "../hooks/use-trainer.kpi";

export interface TrainerKPIProps extends UseTrainerKPIOptions {
  columns?: KPIGridProps["columns"];
  className?: string;
}

const TrainerKPI = ({
  columns = 4,
  className = "",
  ...options
}: TrainerKPIProps = {}) => {
  const { kpiData } = useTrainerKPI(options);

  return <KPIGrid items={kpiData} columns={columns} className={className} />;
};

export default TrainerKPI;
