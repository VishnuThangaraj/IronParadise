import { LuIndianRupee, LuCreditCard, LuReceipt, LuClock } from "react-icons/lu";

import Container from "@/shared/components/ui/containers/Container";
import Button from "@/shared/components/ui/buttons/Button";
import Chip from "@/shared/components/ui/chip/Chip";
import { getDeterministicGradient } from "@/shared/utils/gradient-colors";
import type { Trainer } from "../types/trainer.types";

export interface TrainerPayrollGridProps {
  trainers: Trainer[];
  loading?: boolean;
  onPay?: (trainer: Trainer) => void;
  onViewReceipts?: (trainer: Trainer) => void;
}

const getStatusChip = (status?: string) => {
  const norm = (status || "PENDING").toUpperCase();
  switch (norm) {
    case "PAID":
      return <Chip variant="active" size="xs" dot label="PAID" />;
    case "PARTIAL":
      return <Chip variant="blue" size="xs" dot label="PARTIAL" />;
    case "OVERDUE":
      return <Chip variant="danger" size="xs" dot label="OVERDUE" />;
    case "PENDING":
    default:
      return <Chip variant="warning" size="xs" dot label="PENDING" />;
  }
};

const TrainerPayrollGrid = ({
  trainers = [],
  loading = false,
  onPay,
  onViewReceipts,
}: TrainerPayrollGridProps) => {
  if (loading && trainers.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-64 rounded-3xl bg-slate-100 dark:bg-slate-800/40 animate-pulse border border-slate-200/50 dark:border-white/5"
          />
        ))}
      </div>
    );
  }

  if (trainers.length === 0) {
    return (
      <Container
        variant="secondary"
        className="w-full! p-12! flex flex-col items-center justify-center text-center gap-3"
      >
        <LuIndianRupee className="w-10 h-10 text-slate-400 stroke-1" />
        <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">
          No Payroll Records Found
        </h4>
        <p className="text-xs text-slate-400 max-w-sm">
          No trainers match the selected filters. Try adjusting your search query
          or status filters.
        </p>
      </Container>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
      {trainers.map((trainer) => {
        const salary = Number(trainer.salary) || 0;
        const paid = Number(trainer.amountPaid) || 0;
        const due =
          trainer.amountDue !== undefined
            ? Number(trainer.amountDue)
            : Math.max(0, salary - paid);
        const isPaid = (trainer.paymentStatus || "").toUpperCase() === "PAID";
        const percent = salary > 0 ? Math.min(100, Math.round((paid / salary) * 100)) : 0;
        const initial = trainer.fullName ? trainer.fullName.charAt(0).toUpperCase() : "T";

        return (
          <Container
            key={trainer.userId || trainer._id}
            variant="secondary"
            className="w-full! max-w-none! mx-0! p-5! rounded-3xl! flex-col justify-between gap-4 shadow-xs hover:shadow-lg transition-all duration-300"
          >
            {/* Header: Avatar, Name, ID & Status Badge */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 min-w-[48px] max-w-[48px] h-[48px] min-h-[48px] max-h-[48px] rounded-2xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 shadow-xs relative flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                  {trainer.profileImage ? (
                    <img
                      src={trainer.profileImage}
                      alt={trainer.fullName}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover block"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-full h-full ${getDeterministicGradient(
                      trainer.userId || trainer._id,
                    )} flex items-center justify-center text-white text-base font-bold ${
                      trainer.profileImage ? "absolute inset-0 -z-10" : ""
                    }`}
                  >
                    {initial}
                  </div>
                </div>

                <div className="min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                    {trainer.fullName}
                  </h3>
                  <p className="text-xs font-mono text-slate-400 dark:text-slate-500 truncate">
                    {trainer.userId}
                  </p>
                </div>
              </div>

              {getStatusChip(trainer.paymentStatus)}
            </div>

            {/* Salary Breakdown Box */}
            <div className="rounded-2xl p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  Monthly Base Salary
                </span>
                <span className="font-bold font-mono text-slate-900 dark:text-white text-sm">
                  ₹{salary.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isPaid ? "bg-emerald-500" : percent > 0 ? "bg-indigo-500" : "bg-slate-300 dark:bg-slate-700"
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              {/* Paid vs Due row */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-800/80 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                    PAID
                  </span>
                  <span className="font-semibold font-mono text-emerald-600 dark:text-emerald-400 text-xs">
                    ₹{paid.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                    DUE
                  </span>
                  <span
                    className={`font-semibold font-mono text-xs ${
                      due > 0 ? "text-amber-600 dark:text-amber-400" : "text-slate-400"
                    }`}
                  >
                    ₹{due.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Shift & Specialization pills */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <LuClock className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {trainer.shiftTime
                    ? `${trainer.shiftTime.start} - ${trainer.shiftTime.end}`
                    : "09:00 - 17:00"}
                </span>
              </div>

              {trainer.specialization && trainer.specialization.length > 0 && (
                <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300 truncate max-w-35">
                  {trainer.specialization[0]}
                </span>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
              <Button
                variant={isPaid ? "secondary" : "primary"}
                size="sm"
                type="button"
                onClick={() => onPay?.(trainer)}
                className="flex-1 py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <LuCreditCard className="w-3.5 h-3.5" />
                <span>{isPaid ? "Paid" : "Pay Salary"}</span>
              </Button>

              <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={() => onViewReceipts?.(trainer)}
                className="px-3 py-2 text-xs font-semibold flex items-center justify-center gap-1.5"
                title="View Receipts"
              >
                <LuReceipt className="w-3.5 h-3.5 text-slate-500" />
                <span>Receipts</span>
              </Button>
            </div>
          </Container>
        );
      })}
    </div>
  );
};

export default TrainerPayrollGrid;
