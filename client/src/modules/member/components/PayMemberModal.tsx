import { useState, useEffect } from "react";
import { Modal } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import {
  LuCreditCard,
  LuX,
  LuIndianRupee,
  LuCheck,
  LuFileText,
  LuHash,
  LuUser,
} from "react-icons/lu";

import Button from "@/shared/components/ui/buttons/Button";
import { useToast } from "@/shared/components/ui/toast";
import { getErrorMessage } from "@/shared/utils/error-handler";
import { getDeterministicGradient } from "@/shared/utils/gradient-colors";
import { recordMemberPayment } from "../api/member-payment.api";
import { memberKeys } from "../member.keys";
import type {
  MemberPaymentItem,
  MemberPaymentMethod,
} from "../types/member-payment.types";

export interface PayMemberModalProps {
  open: boolean;
  payment: MemberPaymentItem | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const PAYMENT_METHODS: { value: MemberPaymentMethod; label: string }[] = [
  { value: "UPI", label: "UPI / QR Code" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "CASH", label: "Cash" },
  { value: "CARD", label: "Card / POS" },
  { value: "OTHER", label: "Other" },
];

interface PayMemberFormProps {
  payment: MemberPaymentItem;
  onClose: () => void;
  onSuccess?: () => void;
}

const PayMemberForm = ({ payment, onClose, onSuccess }: PayMemberFormProps) => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const total = Number(payment.totalAmount) || 0;
  const due =
    payment.amountDue !== undefined
      ? Number(payment.amountDue)
      : Math.max(0, total - (Number(payment.amountPaid) || 0));

  const [amount, setAmount] = useState<number>(due > 0 ? due : total);
  const [paymentMethod, setPaymentMethod] = useState<MemberPaymentMethod>("UPI");
  const [referenceNumber, setReferenceNumber] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    setAmount(due > 0 ? due : total);
  }, [due, total]);

  const initial = payment.fullName
    ? payment.fullName.charAt(0).toUpperCase()
    : "M";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      addToast({
        type: "error",
        message: "Payment amount must be greater than zero.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await recordMemberPayment({
        paymentId: payment.paymentId,
        userId: payment.userId,
        amountPaid: amount,
        paymentMethod,
        referenceNumber: referenceNumber.trim() || undefined,
        remarks: remarks.trim() || undefined,
        paymentDate: new Date().toISOString(),
      });

      // Invalidate relevant queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: memberKeys.payments() }),
        queryClient.invalidateQueries({ queryKey: memberKeys.receipts() }),
        queryClient.invalidateQueries({
          queryKey: memberKeys.receiptsByUser(payment.userId),
        }),
      ]);

      addToast({
        type: "success",
        message: `₹${amount.toLocaleString("en-IN")} collected successfully for ${payment.fullName}!`,
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      addToast({
        type: "error",
        message: getErrorMessage(err, "Failed to record member payment"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-lg max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl outline-none text-slate-800 dark:text-slate-100 transition-colors duration-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-5 sm:p-6 pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 shadow-xs shrink-0">
            <LuCreditCard className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
              Collect Member Payment
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">
              Record fee collection for {payment.fullName}
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

      {/* Content Form */}
      <form
        onSubmit={handleSubmit}
        className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1"
      >
        {/* Member summary card */}
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
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <span>{payment.userId}</span>
                <span>•</span>
                <span className="text-indigo-600 dark:text-indigo-400 truncate">
                  {payment.membershipPlan?.planName || "Subscription"}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              AMOUNT DUE
            </span>
            <span className="font-bold font-mono text-sm sm:text-base text-amber-600 dark:text-amber-400">
              ₹{due.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Amount Input with Quick Buttons */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Amount to Pay (₹) <span className="text-rose-500">*</span>
            </label>
            {due > 0 && (
              <button
                type="button"
                onClick={() => setAmount(due)}
                className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Fill Full Due (₹{due.toLocaleString("en-IN")})
              </button>
            )}
          </div>
          <div className="relative flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 shadow-2xs">
            <LuIndianRupee className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
            <input
              type="number"
              min="1"
              max={total * 2}
              value={amount || ""}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
              className="w-full bg-transparent text-sm font-mono font-bold text-slate-900 dark:text-white outline-none"
              placeholder="Enter payment amount"
            />
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Payment Method <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PAYMENT_METHODS.map((method) => {
              const isSelected = paymentMethod === method.value;
              return (
                <button
                  key={method.value}
                  type="button"
                  onClick={() => setPaymentMethod(method.value)}
                  className={`flex items-center justify-between p-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-2xs"
                      : "bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="truncate">{method.label}</span>
                  {isSelected && <LuCheck className="w-3.5 h-3.5 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reference / UTR Number */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Transaction Reference / UTR / Cheque No.
          </label>
          <div className="relative flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 shadow-2xs">
            <LuHash className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
            <input
              type="text"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              className="w-full bg-transparent text-xs font-mono text-slate-900 dark:text-white outline-none"
              placeholder="e.g. UPI-928174 or NEFT-104928"
            />
          </div>
        </div>

        {/* Remarks */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Remarks & Notes
          </label>
          <div className="relative flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 shadow-2xs">
            <LuFileText className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-900 dark:text-white outline-none"
              placeholder="Optional remarks or receipt note"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl! text-xs!"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSubmitting}
            className="rounded-xl! text-xs! font-bold!"
          >
            {isSubmitting ? "Processing..." : "Confirm & Record Payment"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export const PayMemberModal = ({
  open,
  payment,
  onClose,
  onSuccess,
}: PayMemberModalProps) => {
  if (!payment) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="pay-member-modal-title"
      className="backdrop-blur-xs"
    >
      <div>
        <PayMemberForm
          payment={payment}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      </div>
    </Modal>
  );
};

export default PayMemberModal;
