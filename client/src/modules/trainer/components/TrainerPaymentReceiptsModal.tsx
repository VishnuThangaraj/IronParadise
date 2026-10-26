import { useState } from "react";
import { Modal } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import {
  LuReceipt,
  LuX,
  LuClock,
  LuCreditCard,
  LuLoader,
  LuCalendar,
  LuPrinter,
} from "react-icons/lu";

import Button from "@/shared/components/ui/buttons/Button";
import Chip from "@/shared/components/ui/chip/Chip";
import Tooltip from "@/shared/components/ui/tooltip/Tooltip";
import { formatDate } from "@/shared/utils/formatDate";
import { getDeterministicGradient } from "@/shared/utils/gradient-colors";

import { getTrainerReceiptsByUserId } from "../api/trainer.api";
import TrainerInvoiceModal from "./TrainerInvoiceModal";
import type { Trainer } from "../types/trainer.types";
import type { TrainerPaymentReceipt } from "../types/trainer-payment-receipt.types";

export interface TrainerPaymentReceiptsModalProps {
  open: boolean;
  trainer: Trainer | null;
  onClose: () => void;
  onPayAgain?: (trainer: Trainer) => void;
}

const TrainerPaymentReceiptsModal = ({
  open,
  trainer,
  onClose,
  onPayAgain,
}: TrainerPaymentReceiptsModalProps) => {
  const userId = trainer?.userId;
  const [selectedReceiptForInvoice, setSelectedReceiptForInvoice] =
    useState<TrainerPaymentReceipt | null>(null);

  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["trainer-receipts", userId],
    queryFn: () => getTrainerReceiptsByUserId(userId!),
    enabled: Boolean(open && userId),
  });

  if (!trainer) return null;

  const receipts: TrainerPaymentReceipt[] = response?.data || [];
  const initial = trainer.fullName ? trainer.fullName.charAt(0).toUpperCase() : "T";
  const totalPaid = receipts.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  return (
    <>
      <Modal
      open={Boolean(open)}
      onClose={onClose}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(6px)",
            backgroundColor: "rgba(15, 23, 42, 0.5)",
          },
        },
      }}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-xl max-h-[85vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl outline-none text-slate-800 dark:text-slate-100 transition-colors duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 shadow-xs shrink-0">
              <LuReceipt className="w-5 h-5" />
            </div>

            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
                Payment History & Receipts
              </h3>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {trainer.fullName} • {trainer.userId}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <LuX className="w-5 h-5" />
          </button>
        </div>

        {/* Trainer & Total Disbursed Summary Bar */}
        <div className="flex items-center justify-between p-4 px-6 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 shrink-0 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 min-w-[32px] max-w-[32px] h-[32px] min-h-[32px] max-h-[32px] rounded-lg overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 shadow-2xs relative flex items-center justify-center bg-slate-100 dark:bg-slate-800">
              {trainer.profileImage ? (
                <img
                  src={trainer.profileImage}
                  alt={trainer.fullName}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover block"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = "none";
                  }}
                />
              ) : null}
              <div
                className={`w-full h-full ${getDeterministicGradient(
                  trainer.userId || trainer._id,
                )} flex items-center justify-center text-white font-bold text-xs ${
                  trainer.profileImage ? "absolute inset-0 -z-10" : ""
                }`}
              >
                {initial}
              </div>
            </div>
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
              {trainer.fullName}
            </span>
          </div>

          <div className="text-right">
            <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">
              TOTAL DISBURSED
            </span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
              ₹{totalPaid.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Scrollable Receipts List */}
        <div className="p-5 sm:p-6 space-y-3.5 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs">
              <LuLoader className="w-6 h-6 animate-spin text-indigo-500" />
              <span>Loading payment history...</span>
            </div>
          ) : isError ? (
            <div className="py-8 text-center text-rose-500 text-xs">
              Failed to load receipts. Please try again.
            </div>
          ) : receipts.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center gap-2 text-slate-400 dark:text-slate-500">
              <LuReceipt className="w-10 h-10 stroke-1" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No Payment Receipts Found
              </p>
              <p className="text-xs text-slate-400 max-w-xs">
                No salary disbursement receipts have been recorded for this
                trainer yet.
              </p>
            </div>
          ) : (
            receipts.map((receipt) => (
              <div
                key={receipt._id || receipt.receiptNumber}
                className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 space-y-2.5 shadow-xs"
              >
                {/* Top row: Receipt #, Date & Amount */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono font-bold text-xs sm:text-sm text-slate-900 dark:text-white block">
                      {receipt.receiptNumber}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <LuClock className="w-3 h-3" />
                      {formatDate(receipt.paymentDate)}
                    </span>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="font-mono font-bold text-sm sm:text-base text-emerald-600 dark:text-emerald-400 block">
                      ₹{Number(receipt.amount).toLocaleString("en-IN")}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Chip
                        variant="active"
                        size="xs"
                        label={receipt.paymentMethod}
                      />
                      <Tooltip title="View & Print Official Invoice">
                        <button
                          type="button"
                          onClick={() => setSelectedReceiptForInvoice(receipt)}
                          className="p-1 rounded-md text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 transition-colors cursor-pointer shadow-2xs"
                          aria-label="Print Invoice"
                        >
                          <LuPrinter className="w-3.5 h-3.5" />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                </div>

                {/* Details row: Salary Month & Transaction */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <LuCalendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Salary Month:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {receipt.salaryMonth}
                    </span>
                  </div>

                  {receipt.transactionId && (
                    <div className="font-mono text-[11px] text-slate-400">
                      Ref: {receipt.transactionId}
                    </div>
                  )}
                </div>

                {/* Notes if available */}
                {receipt.notes && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg">
                    &ldquo;{receipt.notes}&rdquo;
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
          <Button
            variant="secondary"
            size="sm"
            type="button"
            onClick={onClose}
          >
            Close
          </Button>

          {onPayAgain && (
            <Button
              variant="primary"
              size="sm"
              type="button"
              onClick={() => {
                onClose();
                onPayAgain(trainer);
              }}
              className="flex items-center gap-1.5"
            >
              <LuCreditCard className="w-4 h-4" />
              <span>Record New Payout</span>
            </Button>
          )}
        </div>
      </div>
    </Modal>

    {/* Official Invoice Modal */}
    <TrainerInvoiceModal
      open={Boolean(selectedReceiptForInvoice)}
      receipt={selectedReceiptForInvoice}
      trainer={trainer}
      onClose={() => setSelectedReceiptForInvoice(null)}
    />
  </>
  );
};

export default TrainerPaymentReceiptsModal;
