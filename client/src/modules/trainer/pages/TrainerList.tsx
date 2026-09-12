import { useMemo } from "react";
import { FiPlus } from "react-icons/fi";
import { LuFilter } from "react-icons/lu";

import Button from "@/shared/components/ui/buttons/Button";
import DataTable from "@/shared/components/ui/table/DataTable";
import PageHeader from "@/shared/components/ui/page/PageHeader";
import SearchBar from "@/shared/components/ui/search/SearchBar";
import DeleteModal from "@/shared/components/ui/modals/DeleteModal";
import Container from "@/shared/components/ui/containers/Container";
import SelectDropdown from "@/shared/components/ui/dropdown/SelectDropdown";
import ViewModeToggle from "@/shared/components/ui/view-mode-toggle/ViewModeToggle";

import useTrainer from "@/modules/trainer/hooks/use-trainer";
import useTrainerDelete from "@/modules/trainer/hooks/use-trainer.delete";
import { getTrainerColumns } from "@/modules/trainer/constants/trainer.columns";

const statusFilterOptions = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active Plans" },
  { value: "inactive", label: "Inactive Plans" },
];

const TrainerList = () => {
  const {
    loading,
    viewMode,
    setViewMode,
    searchQuery,
    statusFilter,
    filteredRows,
    setSearchQuery,
    setStatusFilter,
    handleNavigateToAdd,
    handleNavigateToEdit,
    handleNavigateToView,
  } = useTrainer();

  const {
    isDeleting,
    handleDeleteTrainer,
    openDeleteTrainerModal,
    handleDeleteTrainerClick,
    setOpenDeleteTrainerModal,
  } = useTrainerDelete();

  const columns = useMemo(
    () =>
      getTrainerColumns({
        onView: handleNavigateToView,
        onEdit: handleNavigateToEdit,
        onDelete: handleDeleteTrainerClick,
      }),
    [handleNavigateToView, handleNavigateToEdit, handleDeleteTrainerClick],
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Trainers" description="Manage your gym's trainers.">
        <div className="justify-center align-center">
          <Button
            variant="primary"
            className="font-semibold text-sm px-4!"
            onClick={handleNavigateToAdd}
            aria-label="Add Trainer"
          >
            <div className="flex justify-between items-center gap-2">
              <FiPlus /> <span>Add Trainer</span>
            </div>
          </Button>
        </div>
      </PageHeader>
      <Container
        variant="secondary"
        className="w-full! max-w-full! mx-0! flex justify-between items-center p-3.5! sm:p-3! rounded-2xl! shadow-xs relative! z-30! overflow-visible!"
      >
        <div>
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            placeholder="Search trainers by id, name, email or phone..."
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

      {/* Data Table */}
      <div className="relative z-0">
        {viewMode === "grid" ? (
          <div>
            {/* <DietPlanGrid
              loading={loading}
              rows={filteredRows}
              deletePlan={handleDeletePlanClick}
              editPlan={handleNavigateToEdit}
              viewPlan={handleNavigateToView}
            /> */}
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
              getRowId={(row) => row.userId}
              className="border-none! rounded-none! shadow-none! bg-transparent!"
            />
          </Container>
        )}
      </div>

      {/* Plan Deletion Confirmation Modal */}
      <DeleteModal
        open={openDeleteTrainerModal}
        loading={isDeleting}
        onClose={() => setOpenDeleteTrainerModal(false)}
        onConfirm={handleDeleteTrainer}
        title="Delete Trainer"
        content="Are you sure you want to delete this trainer? This action cannot be undone."
      />
    </div>
  );
};

export default TrainerList;
