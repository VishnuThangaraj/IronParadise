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
  LuUser,
} from "react-icons/lu";

import Button from "@/shared/components/ui/buttons/Button";
import Chip from "@/shared/components/ui/chip/Chip";
import Tooltip from "@/shared/components/ui/tooltip/Tooltip";
import { formatDate } from "@/shared/utils/formatDate";
import { getDeterministicGradient } from "@/shared/utils/gradient-colors";

import { getMemberReceiptsByUserId } from "../api/member-payment.api";
import { memberKeys } from "../member.keys";
import MemberInvoiceModal from "./MemberInvoiceModal";
import type {
  MemberPaymentItem,
  MemberPaymentReceipt,
} from "../types/member-payment.types";

export interface MemberPaymentReceiptsModalProps {
  open: boolean;
  payment: MemberPaymentItem | null;
  onClose: () => void;
  onPayAgain?: (payment: MemberPaymentItem) => void;
}

export const MemberPaymentReceiptsModal = ({
  open,
  payment,
  onClose,
  onPayAgain,
}: MemberPaymentReceiptsModalProps) => {
  const userId = payment?.userId;
  const [selectedReceiptForInvoice, setSelectedReceiptForInvoice] =
    useState<MemberPaymentReceipt | null>(null);

  const { data: response, isLoading } = useQuery({
    queryKey: memberKeys.receiptsByUser(userId || ""),
    queryFn: () => getMemberReceiptsByUserId(userId!),
    enabled: Boolean(open && userId),
  });

  if (!payment) return null;

  const receipts: MemberPaymentReceipt[] = response?.data || [];
  const initial = payment.fullName
    ? payment.fullName.charAt(0).toUpperCase()
    : "M";
  const totalPaid = receipts.reduce(
    (sum, r) => sum + (Number(r.amountPaid) || 0),
    0,
  );

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
                  {payment.fullName} • {payment.userId}
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

          {/* Member Card Summary Banner */}
          <div className="p-5 sm:p-6 pb-2 shrink-0">
            <div className="rounded-2xl p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {payment.profileImage ? (
                  <img
                    src={payment.profileImage}
                    alt={payment.fullName}
                    className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                  />
                ) : (
                  <div
                    className={`w-10 h-10 rounded-xl ${getDeterministicGradient(
                      payment.userId || payment._id,
                    )} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                  >
                    {initial || <LuUser className="w-4 h-4" />}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {payment.fullName}
                  </p>
                  <p className="text-xs font-mono text-indigo-600 dark:text-indigo-400 truncate">
                    {payment.membershipPlan?.planName || "Membership"}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  TOTAL COLLECTED
                </span>
                <span className="font-bold font-mono text-sm sm:text-base text-emerald-600 dark:text-emerald-400">
                  ₹{totalPaid.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>

          {/* Receipts List */}
          <div className="p-5 sm:p-6 pt-2 overflow-y-auto flex-1 space-y-3">
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
                <LuLoader className="w-6 h-6 animate-spin text-indigo-600" />
                <span className="text-xs font-medium">
                  Loading payment receipts...
                </span>
              </div>
            ) : receipts.length === 0 ? (
              <div className="py-10 flex flex-col items-center justify-center text-center gap-3 bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-6">
                <LuClock className="w-8 h-8 text-slate-400" />
                <div>
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    No Receipts Found
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    No payment receipts have been recorded for this member yet.
                  </p>
                </div>
                {onPayAgain && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="mt-2 text-xs! font-bold! rounded-xl!"
                    onClick={() => {
                      onClose();
                      onPayAgain(payment);
                    }}
                  >
                    <LuCreditCard className="w-3.5 h-3.5 mr-1" />
                    <span>Collect Payment Now</span>
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-2.5">
                {receipts.map((rcpt) => {
                  const amount = Number(rcpt.amountPaid) || 0;
                  const method = (rcpt.paymentMethod || "OTHER").toUpperCase();

                  return (
                    <div
                      key={rcpt._id || rcpt.receiptNumber}
                      className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-indigo-200 dark:hover:border-indigo-800 transition-all flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900/40">
                          <LuReceipt className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-slate-900 dark:text-slate-100">
                              {rcpt.receiptNumber}
                            </span>
                            <Chip variant="active" size="xs" label={method} />
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                            <LuCalendar className="w-3 h-3" />
                            <span>{formatDate(rcpt.paymentDate)}</span>
                            {rcpt.referenceNumber && (
                              <>
                                <span>•</span>
                                <span className="truncate">
                                  Ref: {rcpt.referenceNumber}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span className="font-bold font-mono text-sm text-emerald-600 dark:text-emerald-400 block">
                            ₹{amount.toLocaleString("en-IN")}
                          </span>
                        </div>

                        <Tooltip title="View & Print Official Invoice">
                          <button
                            type="button"
                            onClick={() => setSelectedReceiptForInvoice(rcpt)}
                            className="p-2 rounded-xl text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/80 dark:border-indigo-800/80 transition-all cursor-pointer shadow-2xs active:scale-95"
                            aria-label="Print Invoice"
                          >
                            <LuPrinter className="w-3.5 h-3.5" />
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 px-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 shrink-0">
            <span className="text-xs text-slate-400 font-medium">
              Showing {receipts.length} total recorded receipts
            </span>

            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="rounded-xl! text-xs!"
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Invoice Modal Preview when clicked */}
      <MemberInvoiceModal
        open={Boolean(selectedReceiptForInvoice)}
        receipt={selectedReceiptForInvoice}
        onClose={() => setSelectedReceiptForInvoice(null)}
      />
    </>
  );
};

export default MemberPaymentReceiptsModal;
