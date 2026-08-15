import type { GridColDef } from "@mui/x-data-grid";
import type { MembershipPlan } from "../types/membership-plan.types";

export interface MembershipPlanGridProps {
  rows: MembershipPlan[];
  loading?: boolean;
}

const MembershipPlanGrid = ({
  rows,
  loading,
}: MembershipPlanGridProps) => {
  return (
    <div className="flex justify-between gap-3">
      <div className="border-2 border-gray-200 rounded-md"></div>
    </div>
  );
};

export default MembershipPlanGrid;
