import { KPIGrid } from "@/shared/components/ui/kpi";
import useWorkoutPlanKPI, {
  type UseWorkoutPlanKPIOptions,
} from "../hooks/use-workout-plan.kpi";

export type WorkoutPlanKPIProps = UseWorkoutPlanKPIOptions;

const WorkoutPlanKPI = (props: WorkoutPlanKPIProps = {}) => {
  const { kpiData } = useWorkoutPlanKPI(props);

  return <KPIGrid items={kpiData} columns={4} />;
};

export default WorkoutPlanKPI;
