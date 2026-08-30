import { KPIGrid } from "@/shared/components/ui/kpi";
import useMembershipPlanKPI, {
  type UseMembershipPlanKPIOptions,
} from "../hooks/use-membership-plan.kpi";

export type MembershipPlanKPIProps = UseMembershipPlanKPIOptions;

const MembershipPlanKPI = (props: MembershipPlanKPIProps = {}) => {
  const { kpiData } = useMembershipPlanKPI(props);

  return <KPIGrid items={kpiData} columns={4} />;
};

export default MembershipPlanKPI;

