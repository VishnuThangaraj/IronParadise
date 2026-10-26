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

import useTrainerTransactions from "../hooks/use-trainer-transactions";
import getTrainerTransactionsColumns from "../constants/trainer-transactions.columns";
import TrainerInvoiceModal from "./TrainerInvoiceModal";
import type { Trainer } from "../types/trainer.types";

export interface TrainerTransactionsTabProps {
  trainers: Trainer[];
}

const paymentMethodOptions = [
  { value: "all", label: "All Payment Modes" },
  { value: "UPI", label: "UPI / QR Code" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "CASH", label: "Cash" },
  { value: "CHEQUE", label: "Cheque" },
  { value: "OTHER", label: "Other" },
];

const TrainerTransactionsTab = ({ trainers }: TrainerTransactionsTabProps) => {
  const {
    receipts,
    isLoading,
    refetch,
    searchQuery,
    setSearchQuery,
    paymentMethodFilter,
    setPaymentMethodFilter,
    salaryMonthFilter,
    setSalaryMonthFilter,
    salaryMonths,
    metrics,
    selectedReceipt,
    invoiceModalOpen,
    handleOpenInvoice,
    handleCloseInvoice,
  } = useTrainerTransactions({ trainers });

  const monthOptions = useMemo(() => {
    return [
      { value: "all", label: "All Salary Cycles" },
      ...salaryMonths.map((m) => ({ value: m, label: m })),
    ];
  }, [salaryMonths]);

  const columns = useMemo(
    () =>
      getTrainerTransactionsColumns({
        onPrintInvoice: handleOpenInvoice,
      }),
    [handleOpenInvoice],
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Transaction Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        <KPICard
          title="Total Disbursed"
          value={`₹${metrics.totalDisbursed.toLocaleString("en-IN")}`}
          subtitle={`${metrics.totalCount} completed payout${metrics.totalCount === 1 ? "" : "s"}`}
          icon={<LuIndianRupee className="w-4 h-4" />}
          color="emerald"
        />

        <KPICard
          title="Total Transactions"
          value={metrics.totalCount}
          subtitle="All-time salary vouchers"
          icon={<LuReceipt className="w-4 h-4" />}
          color="indigo"
        />

        <KPICard
          title="Average Payout"
          value={`₹${metrics.averagePayout.toLocaleString("en-IN")}`}
          subtitle="Mean per transaction"
          icon={<LuCreditCard className="w-4 h-4" />}
          color="blue"
        />
      </div>

      {/* 2. Search & Filters Toolbar */}
      <Container
        variant="secondary"
        className="w-full! max-w-full! mx-0! flex flex-col sm:flex-row justify-between items-stretch sm:items-center p-3.5! sm:p-3! rounded-2xl! shadow-xs gap-3 relative! z-30! overflow-visible!"
      >
        <div className="w-full sm:max-w-md">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            placeholder="Search by receipt #, trainer name, staff ID, or txn ref..."
          />
        </div>

        <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 sm:gap-4">
          {/* Salary Month Filter */}
          <SelectDropdown
            options={monthOptions}
            value={salaryMonthFilter}
            onChange={setSalaryMonthFilter}
            icon={<LuCalendar className="w-4 h-4" />}
          />

          {/* Payment Method Filter */}
          <SelectDropdown
            options={paymentMethodOptions}
            value={paymentMethodFilter}
            onChange={setPaymentMethodFilter}
            icon={<LuFilter className="w-4 h-4" />}
          />

          {/* Refetch Button */}
          <button
            type="button"
            onClick={() => refetch()}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-slate-200/80 dark:border-slate-700/80 shadow-2xs"
            title="Refresh transactions"
            aria-label="Refresh transactions"
          >
            <LuRefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin text-indigo-500" : ""}`}
            />
          </button>
        </div>
      </Container>

      {/* 3. Transactions Data Table */}
      <Container
        variant="secondary"
        className="w-full! max-w-full! p-0! overflow-hidden rounded-2xl! flex-col shadow-xs"
      >
        <DataTable
          loading={isLoading}
          rows={receipts}
          columns={columns}
          getRowId={(row) => row._id || row.receiptNumber}
          className="border-none! rounded-none! shadow-none! bg-transparent!"
          height={560}
        />
      </Container>

      {/* 4. Official Printable Invoice Modal */}
      <TrainerInvoiceModal
        open={invoiceModalOpen}
        receipt={selectedReceipt}
        onClose={handleCloseInvoice}
      />
    </div>
  );
};

export default TrainerTransactionsTab;
