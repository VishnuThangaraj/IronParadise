import { KPIGrid } from "@/shared/components/ui/kpi";
import useDietPlanKPI, {
  type UseDietPlanKPIOptions,
} from "../hooks/use-diet-plan.kpi";

export type DietPlanKPIProps = UseDietPlanKPIOptions;

const DietPlanKPI = (props: DietPlanKPIProps = {}) => {
  const { kpiData } = useDietPlanKPI(props);

  return <KPIGrid items={kpiData} columns={4} />;
};

export default DietPlanKPI;
