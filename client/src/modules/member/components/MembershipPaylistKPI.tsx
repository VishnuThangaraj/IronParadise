import { KPIGrid, type KPIGridProps } from "@/shared/components/ui/kpi";
import useMemberPaymentKPI, {
  type UseMemberPaymentKPIOptions,
} from "../hooks/use-member-payment.kpi";

export interface MembershipPaylistKPIProps extends UseMemberPaymentKPIOptions {
  columns?: KPIGridProps["columns"];
  className?: string;
}

const MembershipPaylistKPI = ({
  columns = 4,
  className = "",
  ...options
}: MembershipPaylistKPIProps = {}) => {
  const { kpiData } = useMemberPaymentKPI(options);

  return <KPIGrid items={kpiData} columns={columns} className={className} />;
};

export default MembershipPaylistKPI;
