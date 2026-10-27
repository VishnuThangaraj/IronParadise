import {
  LuIndianRupee,
  LuCreditCard,
  LuReceipt,
  LuCalendar,
  LuCrown,
  LuUser,
} from "react-icons/lu";

import Container from "@/shared/components/ui/containers/Container";
import Button from "@/shared/components/ui/buttons/Button";
import Chip from "@/shared/components/ui/chip/Chip";
import { getDeterministicGradient } from "@/shared/utils/gradient-colors";
import { formatDate } from "@/shared/utils/formatDate";
import type { MemberPaymentItem } from "../types/member-payment.types";

export interface MembershipPaylistGridProps {
  payments: MemberPaymentItem[];
  loading?: boolean;
  onPay?: (payment: MemberPaymentItem) => void;
  onViewReceipts?: (payment: MemberPaymentItem) => void;
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

const MembershipPaylistGrid = ({
  payments = [],
  loading = false,
  onPay,
  onViewReceipts,
}: MembershipPaylistGridProps) => {
  if (loading && payments.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-72 rounded-3xl bg-slate-100 dark:bg-slate-800/40 animate-pulse border border-slate-200/50 dark:border-white/5"
          />
        ))}
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <Container
        variant="secondary"
        className="w-full! p-12! flex flex-col items-center justify-center text-center gap-3"
      >
        <LuIndianRupee className="w-10 h-10 text-slate-400 stroke-1" />
        <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">
          No Member Payments Found
        </h4>
        <p className="text-xs text-slate-400 max-w-sm">
          No member records match the selected search query or plan filter. Try
          adjusting your filters.
        </p>
      </Container>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
      {payments.map((payment) => {
        const total = Number(payment.totalAmount) || 0;
        const paid = Number(payment.amountPaid) || 0;
        const due =
          payment.amountDue !== undefined
            ? Number(payment.amountDue)
            : Math.max(0, total - paid);
        const isPaid = (payment.paymentStatus || "").toUpperCase() === "PAID";
        const percent =
          total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 0;
        const initial = payment.fullName
          ? payment.fullName.charAt(0).toUpperCase()
          : "M";
        const isExpired = payment.assignment?.status === "EXPIRED";

        return (
          <Container
            key={payment.paymentId || payment._id}
            variant="secondary"
            className="w-full! max-w-none! mx-0! p-5! rounded-3xl! flex-col justify-between gap-4 shadow-xs hover:shadow-lg transition-all duration-300"
          >
            {/* Header: Avatar, Name, ID & Status Badge */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 min-w-[48px] max-w-[48px] h-[48px] min-h-[48px] max-h-[48px] rounded-2xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 shadow-xs relative flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                  {payment.profileImage ? (
                    <img
                      src={payment.profileImage}
                      alt={payment.fullName}
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
                      payment.userId || payment._id,
                    )} flex items-center justify-center text-white text-base font-bold ${
                      payment.profileImage ? "absolute inset-0 -z-10" : ""
                    }`}
                  >
                    {initial || <LuUser className="w-5 h-5" />}
                  </div>
                </div>

                <div className="min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                    {payment.fullName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 dark:text-slate-500">
                    <span>{payment.userId}</span>
                    <span>•</span>
                    <span className="text-[11px]">{payment.paymentId}</span>
                  </div>
                </div>
              </div>

              {getStatusChip(payment.paymentStatus)}
            </div>

            {/* Plan Badge & Validity */}
            <div className="flex items-center justify-between text-xs py-1 px-3 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center gap-1.5 truncate">
                <LuCrown className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {payment.membershipPlan?.planName || "Membership Plan"}
                </span>
              </div>
              {payment.assignment?.endDate && (
                <div className="flex items-center gap-1 font-mono text-[11px] shrink-0">
                  <LuCalendar className="w-3 h-3 text-slate-400" />
                  <span
                    className={
                      isExpired
                        ? "text-rose-500 font-semibold"
                        : "text-slate-500 dark:text-slate-400"
                    }
                  >
                    {formatDate(payment.assignment.endDate)}
                  </span>
                </div>
              )}
            </div>

            {/* Breakdown Box */}
            <div className="rounded-2xl p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  Total Subscription Fee
                </span>
                <span className="font-bold font-mono text-slate-900 dark:text-white text-sm">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isPaid
                      ? "bg-emerald-500"
                      : percent > 0
                        ? "bg-indigo-500"
                        : "bg-slate-300 dark:bg-slate-700"
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
                      due > 0
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-slate-400"
                    }`}
                  >
                    ₹{due.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Card Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Button
                variant={isPaid ? "secondary" : "primary"}
                size="sm"
                className="w-full! justify-center! text-xs! font-bold! rounded-xl!"
                onClick={() => onPay?.(payment)}
              >
                <LuCreditCard className="w-3.5 h-3.5 mr-1" />
                <span>{isPaid ? "View Paid" : "Collect Fee"}</span>
              </Button>

              <Button
                variant="secondary"
                size="sm"
                className="w-full! justify-center! text-xs! font-bold! rounded-xl!"
                onClick={() => onViewReceipts?.(payment)}
              >
                <LuReceipt className="w-3.5 h-3.5 mr-1" />
                <span>Receipts</span>
              </Button>
            </div>
          </Container>
        );
      })}
    </div>
  );
};

export default MembershipPaylistGrid;
