import { useMemo, useState } from "react";
import { LuFilter } from "react-icons/lu";

import PageHeader from "@/shared/components/ui/page/PageHeader";
import Container from "@/shared/components/ui/containers/Container";
import SearchBar from "@/shared/components/ui/search/SearchBar";
import SelectDropdown from "@/shared/components/ui/dropdown/SelectDropdown";
import ViewModeToggle from "@/shared/components/ui/view-mode-toggle/ViewModeToggle";
import DataTable from "@/shared/components/ui/table/DataTable";

import useTrainerPayroll from "../hooks/use-trainer-payroll";
import TrainerPayrollKPI from "../components/TrainerPayrollKPI";
import TrainerPayrollGrid from "../components/TrainerPayrollGrid";
import PayTrainerModal from "../components/PayTrainerModal";
import TrainerPaymentReceiptsModal from "../components/TrainerPaymentReceiptsModal";
import TrainerTransactionsTab from "../components/TrainerTransactionsTab";
import TrainerPayrollTabs from "../components/TrainerPayrollTabs";
import { getTrainerPayrollColumns } from "../constants/trainer-payroll.columns";

const paymentStatusFilterOptions = [
  { value: "all", label: "All Payment Statuses" },
  { value: "PAID", label: "Fully Paid" },
  { value: "PENDING", label: "Pending" },
  { value: "PARTIAL", label: "Partially Paid" },
  { value: "OVERDUE", label: "Overdue" },
];

const employmentFilterOptions = [
  { value: "all", label: "All Staff" },
  { value: "active", label: "Active Trainers" },
  { value: "on_leave", label: "On Leave" },
  { value: "inactive", label: "Inactive" },
];

const TrainerPayroll = () => {
  const [activeTab, setActiveTab] = useState<"payroll" | "transactions">("payroll");

  const {
    trainers,
    loading,
    refetch,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    paymentStatusFilter,
    setPaymentStatusFilter,
    employmentFilter,
    setEmploymentFilter,
    filteredTrainers,

    // Pay Modal
    payModalOpen,
    selectedTrainerForPay,
    handleOpenPayModal,
    handleClosePayModal,

    // Receipts Modal
    receiptsModalOpen,
    selectedTrainerForReceipts,
    handleOpenReceiptsModal,
    handleCloseReceiptsModal,
  } = useTrainerPayroll();

  const columns = useMemo(
    () =>
      getTrainerPayrollColumns({
        onPay: handleOpenPayModal,
        onViewReceipts: handleOpenReceiptsModal,
      }),
    [handleOpenPayModal, handleOpenReceiptsModal],
  );

  return (
    <div className="flex flex-col gap-6 w-full pb-8">
      {/* 1. Page Header */}
      <PageHeader
        title="Trainer Payroll & Disbursement"
        description="Monitor staff salaries, track monthly disbursement statuses, record payouts, and generate official invoices."
      />

      {/* 2. Elegant Primary Tabs Navigation */}
      <TrainerPayrollTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        trainersCount={trainers.length}
      />

      {activeTab === "payroll" ? (
        <>
          {/* 3. Payroll KPI Cards on top */}
          <TrainerPayrollKPI trainers={trainers} loading={loading} columns={4} />

          {/* 4. Search and Filters Toolbar */}
          <Container
            variant="secondary"
            className="w-full! max-w-full! mx-0! flex flex-col sm:flex-row justify-between items-stretch sm:items-center p-3.5! sm:p-3! rounded-2xl! shadow-xs gap-3 relative! z-30! overflow-visible!"
          >
            <div className="w-full sm:max-w-md">
              <SearchBar
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery("")}
                placeholder="Search trainers by name, ID, or specialization..."
              />
            </div>

            <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 sm:gap-4">
              {/* View Mode Toggle (Table / Grid) */}
              <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />

              {/* Payment Status Filter */}
              <SelectDropdown
                options={paymentStatusFilterOptions}
                value={paymentStatusFilter}
                onChange={setPaymentStatusFilter}
                icon={<LuFilter className="w-4 h-4" />}
              />

              {/* Employment Filter */}
              <SelectDropdown
                options={employmentFilterOptions}
                value={employmentFilter}
                onChange={setEmploymentFilter}
                icon={<LuFilter className="w-4 h-4" />}
              />
            </div>
          </Container>

          {/* 5. Payroll Records: Grid or Table View */}
          <div className="relative z-0 w-full">
            {viewMode === "grid" ? (
              <TrainerPayrollGrid
                trainers={filteredTrainers}
                loading={loading}
                onPay={handleOpenPayModal}
                onViewReceipts={handleOpenReceiptsModal}
              />
            ) : (
              <Container
                variant="secondary"
                className="w-full! max-w-full! p-0! overflow-hidden rounded-2xl! flex-col shadow-xs"
              >
                <DataTable
                  loading={loading}
                  rows={filteredTrainers}
                  columns={columns}
                  getRowId={(row) => row.userId || row._id}
                  className="border-none! rounded-none! shadow-none! bg-transparent!"
                  height={560}
                />
              </Container>
            )}
          </div>
        </>
      ) : (
        /* All Transactions & Printable Invoices Tab */
        <TrainerTransactionsTab trainers={trainers} />
      )}

      {/* 5. Modals */}
      {/* Pay Trainer Modal */}
      <PayTrainerModal
        open={payModalOpen}
        trainer={selectedTrainerForPay}
        onClose={handleClosePayModal}
        onSuccess={refetch}
      />

      {/* Payment History Receipts Modal */}
      <TrainerPaymentReceiptsModal
        open={receiptsModalOpen}
        trainer={selectedTrainerForReceipts}
        onClose={handleCloseReceiptsModal}
        onPayAgain={handleOpenPayModal}
      />
    </div>
  );
};

export default TrainerPayroll;
