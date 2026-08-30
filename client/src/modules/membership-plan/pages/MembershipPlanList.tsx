import { useMemo } from "react";
import { FiPlus } from "react-icons/fi";
import { LuFilter } from "react-icons/lu";

import Button from "@/shared/components/ui/buttons/Button";
import PageHeader from "@/shared/components/ui/page/PageHeader";
import SearchBar from "@/shared/components/ui/search/SearchBar";
import DataTable from "@/shared/components/ui/table/DataTable";

import { getMembershipPlanColumns } from "../constants/membership-plan.columns";
import useMembershipPlan from "../hooks/use-membership-plan";
import ViewModeToggle from "@/shared/components/ui/view-mode-toggle/ViewModeToggle";
import MembershipPlanGrid from "../components/MembershipPlanGrid";
import Container from "@/shared/components/ui/containers/Container";
import useMembershipPlanDelete from "../hooks/use-membership-plan.delete";
import DeleteModal from "@/shared/components/ui/modals/DeleteModal";
import MembershipPlanKPI from "../components/MembershipPlanKPI";
import SelectDropdown from "@/shared/components/ui/dropdown/SelectDropdown";

const statusFilterOptions = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active Plans" },
  { value: "inactive", label: "Inactive Plans" },
];

const MembershipPlanList = () => {
  const {
    loading,
    viewMode,
    setViewMode,
    searchQuery,
    statusFilter,
    setStatusFilter,
    filteredRows,
    setSearchQuery,
    handleNavigateToAdd,
    handleNavigateToEdit,
    handleNavigateToView,
  } = useMembershipPlan();

  const {
    isDeleting,
    openDeletePlanModal,
    setOpenDeletePlanModal,
    handleDeletePlanClick,
    handleDeletePlan,
  } = useMembershipPlanDelete();

  const columns = useMemo(
    () =>
      getMembershipPlanColumns({
        onView: handleNavigateToView,
        onEdit: handleNavigateToEdit,
        onDelete: handleDeletePlanClick,
      }),
    [handleNavigateToView, handleNavigateToEdit, handleDeletePlanClick],
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Membership Plan"
        description="Manage your gym's membership plans and pricing."
      >
        <div className="justify-center align-center">
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
      </PageHeader>
      {/* KPI */}
      <MembershipPlanKPI />
      <Container
        variant="secondary"
        className="w-full! max-w-full! mx-0! flex justify-between items-center p-4! sm:p-5! rounded-2xl! shadow-xs relative! z-30! overflow-visible!"
      >
        <div>
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            placeholder="Search plans by name or duration..."
          />
        </div>
        <div className="flex justify-between gap-6 items-center">
          {/* View Mode */}
          <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
          {/* Filters */}
          <SelectDropdown
            options={statusFilterOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            icon={<LuFilter className="w-4 h-4" />}
          />
        </div>
      </Container>
      <div className="relative z-0">
        {viewMode === "grid" ? (
          <div>
            <MembershipPlanGrid
              loading={loading}
              rows={filteredRows}
              deletePlan={handleDeletePlanClick}
              editPlan={handleNavigateToEdit}
              viewPlan={handleNavigateToView}
            />
          </div>
        ) : (
          <Container
            variant="secondary"
            className="w-full! max-w-full! p-0! overflow-hidden rounded-2xl! flex-col shadow-xs"
          >
            <DataTable
              loading={loading}
              rows={filteredRows}
              columns={columns}
              getRowId={(row) => row.membershipPlanId}
              className="border-none! rounded-none! shadow-none! bg-transparent!"
            />
          </Container>
        )}
      </div>

      {/* Plan Deletion Confirmation Modal */}
      <DeleteModal
        open={openDeletePlanModal}
        loading={isDeleting}
        onClose={() => setOpenDeletePlanModal(false)}
        onConfirm={handleDeletePlan}
        title="Delete Membership Plan"
        content="Are you sure you want to delete this membership plan? This action cannot be undone."
      />
    </div>
  );
};

export default MembershipPlanList;
