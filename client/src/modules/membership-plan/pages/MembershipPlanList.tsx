import { FiPlus } from "react-icons/fi";

import Button from "@/shared/components/ui/buttons/Button";
import PageHeader from "@/shared/components/ui/page/PageHeader";
import SearchBar from "@/shared/components/ui/search/SearchBar";
import DataTable from "@/shared/components/ui/table/DataTable";

import { membershipPlanColumns } from "../constants/membership-plan.columns";
import useMembershipPlan from "../hooks/use-membership-plan";
import ViewModeToggle from "@/shared/components/ui/view-mode-toggle/ViewModeToggle";
import MembershipPlanGrid from "../components/MembershipPlanGrid";

const MembershipPlanList = () => {
  const {
    loading,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    membershipPlans,
    handleDeletePlan,
    handleNavigateToAdd,
    handleNavigateToEdit,
    handleNavigateToView,
  } = useMembershipPlan();

  // const initialRows: MembershipPlan[] = [
  //   {
  //     id: "1",
  //     name: "Monthly Pass",
  //     duration: "1 Month",
  //     price: 29.99,
  //     description: "Full access to gym equipment and locker rooms.",
  //     status: "Active",
  //   },
  //   {
  //     id: "2",
  //     name: "Quarterly Starter",
  //     duration: "3 Months",
  //     price: 79.99,
  //     description: "Includes 1 free personal trainer consultation.",
  //     status: "Active",
  //   },
  //   {
  //     id: "3",
  //     name: "Annual VIP",
  //     duration: "12 Months",
  //     price: 299.99,
  //     description: "Unlimited access, spa, sauna, and free group classes.",
  //     status: "Active",
  //   },
  // ];

  // const filteredRows = initialRows.filter(
  //   (plan) =>
  //     plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     plan.duration.toLowerCase().includes(searchQuery.toLowerCase()),
  // );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Membership Plan"
        description="Manage your gym's membership plans and pricing."
      />
      <div className="flex justify-between items-center align-middle">
        <div>
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            placeholder="Search plans by name or duration..."
          />
        </div>
        <div className="flex justify-between gap-6">
          {/* View Mode */}
          <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />

          <Button
            variant="primary"
            className="font-semibold text-sm px-4!"
            onClick={handleNavigateToAdd}
            aria-label="Add Membership Plan"
          >
            <div className="flex justify-between items-center gap-2">
              <FiPlus /> <span>Add Plan</span>
            </div>
          </Button>
        </div>
      </div>
      <div>
        {viewMode === "grid" ? (
          <div>
            <MembershipPlanGrid
              loading={loading}
              rows={membershipPlans}
              deletePlan={handleDeletePlan}
              editPlan={handleNavigateToEdit}
              viewPlan={handleNavigateToView}
            />
          </div>
        ) : (
          <DataTable
            loading={loading}
            rows={membershipPlans}
            columns={membershipPlanColumns}
            getRowId={(row) => row.membershipPlanId}
          />
        )}
      </div>
    </div>
  );
};

export default MembershipPlanList;
