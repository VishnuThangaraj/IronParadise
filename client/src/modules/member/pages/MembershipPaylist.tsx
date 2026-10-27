import { useMemo, useState } from "react";
import { LuFilter, LuCrown } from "react-icons/lu";

import PageHeader from "@/shared/components/ui/page/PageHeader";
import Container from "@/shared/components/ui/containers/Container";
import SearchBar from "@/shared/components/ui/search/SearchBar";
import SelectDropdown from "@/shared/components/ui/dropdown/SelectDropdown";
import ViewModeToggle from "@/shared/components/ui/view-mode-toggle/ViewModeToggle";
import DataTable from "@/shared/components/ui/table/DataTable";

import useMemberPayments from "../hooks/use-member-payments";
import MembershipPaylistKPI from "../components/MembershipPaylistKPI";
import MembershipPaylistGrid from "../components/MembershipPaylistGrid";
import PayMemberModal from "../components/PayMemberModal";
import MemberPaymentReceiptsModal from "../components/MemberPaymentReceiptsModal";
import MemberTransactionsTab from "../components/MemberTransactionsTab";
import MembershipPaylistTabs from "../components/MembershipPaylistTabs";
import { getMemberPaylistColumns } from "../constants/member-paylist.columns";

const paymentStatusFilterOptions = [
  { value: "all", label: "All Payment Statuses" },
  { value: "PAID", label: "Fully Paid" },
  { value: "PENDING", label: "Pending" },
  { value: "PARTIAL", label: "Partially Paid" },
  { value: "OVERDUE", label: "Overdue" },
];

const MembershipPaylist = () => {
  const [activeTab, setActiveTab] = useState<"paylist" | "transactions">("paylist");

  const {
    payments,
    filteredPayments,
    plans,
    loading,
    refetch,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    paymentStatusFilter,
    setPaymentStatusFilter,
    planFilter,
    setPlanFilter,

    // Pay Modal
    payModalOpen,
    selectedPaymentForPay,
    handleOpenPayModal,
    handleClosePayModal,

    // Receipts Modal
    receiptsModalOpen,
    selectedPaymentForReceipts,
    handleOpenReceiptsModal,
    handleCloseReceiptsModal,
  } = useMemberPayments();

  // Dynamic plan filter options
  const planOptions = useMemo(() => {
    return [
      { value: "all", label: "All Membership Plans" },
      ...plans.map((p) => ({
        value: p.membershipPlanId,
        label: p.planName,
      })),
    ];
  }, [plans]);

  const columns = useMemo(
    () =>
      getMemberPaylistColumns({
        onPay: handleOpenPayModal,
        onViewReceipts: handleOpenReceiptsModal,
      }),
    [handleOpenPayModal, handleOpenReceiptsModal],
  );

  return (
    <div className="flex flex-col gap-6 w-full pb-8">
      {/* 1. Page Header */}
      <PageHeader
        title="Membership Paylist & Subscriptions"
        description="Monitor member plan dues, track subscription validity, record fee collections, and issue official invoices."
      />

      {/* 2. Primary Tabs Navigation */}
      <MembershipPaylistTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        membersCount={payments.length}
      />

      {activeTab === "paylist" ? (
        <>
          {/* 3. Membership Paylist KPI Cards */}
          <MembershipPaylistKPI payments={payments} loading={loading} columns={4} />

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
                placeholder="Search member, ID, phone, email, or plan..."
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

              {/* Plan Filter */}
              <SelectDropdown
                options={planOptions}
                value={planFilter}
                onChange={setPlanFilter}
                icon={<LuCrown className="w-4 h-4" />}
              />
            </div>
          </Container>

          {/* 5. Main Content: Grid or DataTable */}
          <div className="relative z-0 w-full">
            {viewMode === "grid" ? (
              <MembershipPaylistGrid
                payments={filteredPayments}
                loading={loading}
                onPay={handleOpenPayModal}
                onViewReceipts={handleOpenReceiptsModal}
              />
            ) : (
              <Container
                variant="secondary"
                className="w-full! max-w-full! p-0! overflow-hidden rounded-2xl! flex-col shadow-xs"
              >
                <DataTable<any>
                  rows={filteredPayments}
                  columns={columns}
                  loading={loading}
                  getRowId={(row) => row.paymentId || row._id}
                  className="border-none! rounded-none! shadow-none! bg-transparent!"
                  height={560}
                  disableRowSelectionOnClick
                />
              </Container>
            )}
          </div>

          {/* 6. Pay Dues Modal */}
          <PayMemberModal
            open={payModalOpen}
            payment={selectedPaymentForPay}
            onClose={handleClosePayModal}
            onSuccess={refetch}
          />

          {/* 7. Member Receipts History Modal */}
          <MemberPaymentReceiptsModal
            open={receiptsModalOpen}
            payment={selectedPaymentForReceipts}
            onClose={handleCloseReceiptsModal}
            onPayAgain={handleOpenPayModal}
          />
        </>
      ) : (
        /* Tab 2: All Payment Receipts & Invoices */
        <MemberTransactionsTab />
      )}
    </div>
  );
};

export default MembershipPaylist;
