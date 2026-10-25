import { useState } from "react";
import { Modal } from "@mui/material";
import {
  LuCreditCard,
  LuX,
  LuIndianRupee,
  LuCalendar,
  LuFileText,
  LuCheck,
} from "react-icons/lu";

import Button from "@/shared/components/ui/buttons/Button";
import { useToast } from "@/shared/components/ui/toast";
import { getErrorMessage } from "@/shared/utils/error-handler";
import { getDeterministicGradient } from "@/shared/utils/gradient-colors";

import { recordTrainerPayment } from "../api/trainer.api";
import type { Trainer } from "../types/trainer.types";
import type { PaymentMethods } from "../types/trainer-payment-receipt.types";

export interface PayTrainerModalProps {
  open: boolean;
  trainer: Trainer | null;
  onClose: () => void;
  onSuccess: () => void;
}

const PAYMENT_METHODS: { value: PaymentMethods; label: string }[] = [
  { value: "UPI", label: "UPI / QR Code" },
  { value: "BANK_TRANSFER", label: "Bank Transfer (NEFT/IMPS)" },
  { value: "CASH", label: "Cash" },
  { value: "CHEQUE", label: "Cheque" },
  { value: "OTHER", label: "Other" },
];

const getCurrentSalaryMonth = () => {
  const d = new Date();
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

interface PayTrainerFormProps {
  trainer: Trainer;
  onClose: () => void;
  onSuccess: () => void;
}

const PayTrainerForm = ({ trainer, onClose, onSuccess }: PayTrainerFormProps) => {
  const { addToast } = useToast();

  const salary = Number(trainer.salary) || 0;
  const due =
    trainer.amountDue !== undefined ? Number(trainer.amountDue) : salary;

  const [amount, setAmount] = useState<number>(due > 0 ? due : salary);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethods>("BANK_TRANSFER");
  const [salaryMonth, setSalaryMonth] = useState<string>(getCurrentSalaryMonth());
  const [transactionId, setTransactionId] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const initial = trainer.fullName ? trainer.fullName.charAt(0).toUpperCase() : "T";

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
      await recordTrainerPayment({
        userId: trainer.userId,
        amount,
        paymentMethod,
        salaryMonth: salaryMonth.trim() || getCurrentSalaryMonth(),
        transactionId: transactionId.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      addToast({
        type: "success",
        message: `₹${amount.toLocaleString("en-IN")} successfully paid to ${trainer.fullName}!`,
      });
      onSuccess();
      onClose();
    } catch (err) {
      addToast({
        type: "error",
        message: getErrorMessage(err, "Failed to record payment"),
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
              Disburse Trainer Salary
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">
              Record payroll payout for {trainer.fullName}
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
      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
        {/* Trainer summary card */}
        <div className="rounded-2xl p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {trainer.profileImage ? (
              <img
                src={trainer.profileImage}
                alt={trainer.fullName}
                className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
              />
            ) : (
              <div
                className={`w-10 h-10 rounded-xl ${getDeterministicGradient(
                  trainer.userId || trainer._id,
                )} flex items-center justify-center text-white text-xs font-bold shrink-0`}
              >
                {initial}
              </div>
            )}
            <div className="min-w-0">
              <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                {trainer.fullName}
              </p>
              <p className="text-xs font-mono text-slate-400">
                {trainer.userId}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              AMOUNT DUE
            </span>
            <span className="font-bold font-mono text-sm text-amber-600 dark:text-amber-400">
              ₹{due.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Amount input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Payout Amount (₹) <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 shadow-2xs">
            <LuIndianRupee className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
            <input
              type="number"
              min="1"
              max={salary * 2}
              value={amount || ""}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
              className="w-full bg-transparent text-sm font-mono font-bold text-slate-900 dark:text-white outline-none"
              placeholder="Enter amount"
            />
          </div>
        </div>

        {/* Payment Method selector */}
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
                  className={`p-2.5 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500/30"
                      : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                  }`}
                >
                  <span>{method.label}</span>
                  {isSelected && <LuCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Salary Month input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Salary Month <span className="text-rose-500">*</span>
          </label>
          <div className="relative flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 shadow-2xs">
            <LuCalendar className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
            <input
              type="text"
              value={salaryMonth}
              onChange={(e) => setSalaryMonth(e.target.value)}
              required
              className="w-full bg-transparent text-sm text-slate-900 dark:text-white outline-none"
              placeholder="e.g. October 2026"
            />
          </div>
        </div>

        {/* Transaction ID input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Transaction / Reference ID (Optional)
          </label>
          <div className="relative flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 shadow-2xs">
            <LuFileText className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-900 dark:text-white outline-none font-mono"
              placeholder="e.g. UPI-394829104 / NEFT-0941"
            />
          </div>
        </div>

        {/* Notes input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Notes / Remarks (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-2xs resize-none"
            placeholder="e.g. Monthly salary disbursed via company account"
          />
        </div>

        {/* Footer buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="secondary"
            size="sm"
            type="button"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            loading={isSubmitting}
            className="px-6"
          >
            Confirm Payout
          </Button>
        </div>
      </form>
    </div>
  );
};

const PayTrainerModal = ({
  open,
  trainer,
  onClose,
  onSuccess,
}: PayTrainerModalProps) => {
  if (!trainer) return null;

  return (
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
      <PayTrainerForm
        key={trainer.userId}
        trainer={trainer}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    </Modal>
  );
};

export default PayTrainerModal;
