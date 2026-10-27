import { useMemo, useState } from "react";
import { LuFilter, LuCrown, LuRefreshCw } from "react-icons/lu";

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

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              {/* Payment Status Filter */}
              <div className="w-full sm:w-44">
                <SelectDropdown
                  value={paymentStatusFilter}
                  onChange={setPaymentStatusFilter}
                  options={paymentStatusFilterOptions}
                  icon={<LuFilter className="w-4 h-4" />}
                  placeholder="Payment Status"
                />
              </div>

              {/* Plan Filter */}
              <div className="w-full sm:w-48">
                <SelectDropdown
                  value={planFilter}
                  onChange={setPlanFilter}
                  options={planOptions}
                  icon={<LuCrown className="w-4 h-4" />}
                  placeholder="Plan Filter"
                />
              </div>

              {/* View Mode Toggle (Grid vs List/Table) */}
              <ViewModeToggle
                viewMode={viewMode}
                setViewMode={setViewMode}
              />

              {/* Manual Refresh */}
              <button
                type="button"
                onClick={() => refetch()}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0"
                aria-label="Refresh payments"
                title="Refresh payments"
              >
                <LuRefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin text-indigo-600" : ""}`}
                />
              </button>
            </div>
          </Container>

          {/* 5. Main Content: Grid or DataTable */}
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
              className="w-full! max-w-full! mx-0! p-0! rounded-3xl! overflow-hidden shadow-xs border border-slate-200/80 dark:border-slate-800"
            >
              <DataTable<any>
                rows={filteredPayments}
                columns={columns}
                loading={loading}
                getRowId={(row) => row.paymentId || row._id}
                disableRowSelectionOnClick
              />
            </Container>
          )}

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
