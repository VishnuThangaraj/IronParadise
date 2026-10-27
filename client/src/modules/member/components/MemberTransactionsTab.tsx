import { useMemo } from "react";
import {
  LuReceipt,
  LuIndianRupee,
  LuCreditCard,
  LuFilter,
  LuRefreshCw,
  LuCalendar,
} from "react-icons/lu";

import Container from "@/shared/components/ui/containers/Container";
import SearchBar from "@/shared/components/ui/search/SearchBar";
import SelectDropdown from "@/shared/components/ui/dropdown/SelectDropdown";
import DataTable from "@/shared/components/ui/table/DataTable";
import { KPICard } from "@/shared/components/ui/kpi/KPICard";

import useMemberTransactions from "../hooks/use-member-transactions";
import getMemberTransactionsColumns from "../constants/member-transactions.columns";
import MemberInvoiceModal from "./MemberInvoiceModal";

const paymentMethodOptions = [
  { value: "all", label: "All Payment Modes" },
  { value: "UPI", label: "UPI / QR Code" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "CASH", label: "Cash" },
  { value: "CARD", label: "Card / POS" },
  { value: "OTHER", label: "Other" },
];

export const MemberTransactionsTab = () => {
  const {
    receipts,
    isLoading,
    refetch,
    searchQuery,
    setSearchQuery,
    paymentMethodFilter,
    setPaymentMethodFilter,
    monthFilter,
    setMonthFilter,
    paymentMonths,
    metrics,
    selectedReceipt,
    invoiceModalOpen,
    handleOpenInvoice,
    handleCloseInvoice,
  } = useMemberTransactions();

  const monthOptions = useMemo(() => {
    return [
      { value: "all", label: "All Payment Cycles" },
      ...paymentMonths.map((m) => ({ value: m, label: m })),
    ];
  }, [paymentMonths]);

  const columns = useMemo(
    () =>
      getMemberTransactionsColumns({
        onPrintInvoice: handleOpenInvoice,
      }),
    [handleOpenInvoice],
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Transaction Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {/* Total Collected */}
        <KPICard
          title="Total Fee Receipts"
          value={`₹${metrics.totalCollected.toLocaleString("en-IN")}`}
          subtitle={`${metrics.count} total invoices`}
          change="Lifetime collections"
          icon={<LuIndianRupee className="w-4 h-4" />}
          color="emerald"
        />

        {/* UPI Payments */}
        <KPICard
          title="UPI / Digital Mode"
          value={`₹${metrics.upiTotal.toLocaleString("en-IN")}`}
          subtitle="QR & virtual handles"
          change="Instant settlement"
          icon={<LuCreditCard className="w-4 h-4" />}
          color="indigo"
        />

        {/* Bank Transfers */}
        <KPICard
          title="Bank / NEFT / IMPS"
          value={`₹${metrics.bankTransferTotal.toLocaleString("en-IN")}`}
          subtitle="Account transfers"
          change="Verified credits"
          icon={<LuReceipt className="w-4 h-4" />}
          color="amber"
        />

        {/* Cash / POS Cards */}
        <KPICard
          title="Cash & POS Payments"
          value={`₹${metrics.cashCardTotal.toLocaleString("en-IN")}`}
          subtitle="Front desk desk collection"
          change="Counter settlements"
          icon={<LuCalendar className="w-4 h-4" />}
          color="blue"
        />
      </div>

      {/* 2. Search and Filter Toolbar */}
      <Container
        variant="secondary"
        className="w-full! max-w-full! mx-0! flex flex-col sm:flex-row justify-between items-stretch sm:items-center p-3.5! sm:p-3! rounded-2xl! shadow-xs gap-3 relative! z-30! overflow-visible!"
      >
        <div className="w-full sm:max-w-md">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            placeholder="Search by receipt ID, member name, ref, or plan..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Payment Method filter */}
          <div className="w-full sm:w-44">
            <SelectDropdown
              value={paymentMethodFilter}
              onChange={setPaymentMethodFilter}
              options={paymentMethodOptions}
              icon={<LuFilter className="w-4 h-4" />}
              placeholder="Payment Mode"
            />
          </div>

          {/* Payment Month filter */}
          {paymentMonths.length > 0 && (
            <div className="w-full sm:w-44">
              <SelectDropdown
                value={monthFilter}
                onChange={setMonthFilter}
                options={monthOptions}
                icon={<LuCalendar className="w-4 h-4" />}
                placeholder="Billing Cycle"
              />
            </div>
          )}

          {/* Refresh button */}
          <button
            type="button"
            onClick={() => refetch()}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-2xs active:scale-95 shrink-0"
            aria-label="Refresh receipts"
            title="Refresh receipts"
          >
            <LuRefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin text-indigo-600" : ""}`}
            />
          </button>
        </div>
      </Container>

      {/* 3. Data Table */}
      <Container
        variant="secondary"
        className="w-full! max-w-full! mx-0! p-0! rounded-3xl! overflow-hidden shadow-xs border border-slate-200/80 dark:border-slate-800"
      >
        <DataTable<any>
          rows={receipts}
          columns={columns}
          loading={isLoading}
          getRowId={(row) => row._id || row.receiptNumber}
          disableRowSelectionOnClick
        />
      </Container>

      {/* 4. Invoice Print Preview Modal */}
      <MemberInvoiceModal
        open={invoiceModalOpen}
        receipt={selectedReceipt}
        onClose={handleCloseInvoice}
      />
    </div>
  );
};

export default MemberTransactionsTab;
