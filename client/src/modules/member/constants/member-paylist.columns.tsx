import type { GridColDef } from "@mui/x-data-grid";
import {
  LuIndianRupee,
  LuCreditCard,
  LuReceipt,
  LuUser,
  LuCalendar,
} from "react-icons/lu";

import Chip from "@/shared/components/ui/chip/Chip";
import Tooltip from "@/shared/components/ui/tooltip/Tooltip";
import { getDeterministicGradient } from "@/shared/utils/gradient-colors";
import { formatDate } from "@/shared/utils/formatDate";
import type { MemberPaymentItem } from "../types/member-payment.types";

export interface MemberPaylistColumnActions {
  onPay?: (payment: MemberPaymentItem) => void;
  onViewReceipts?: (payment: MemberPaymentItem) => void;
}

export const getMemberPaylistColumns = (
  actions?: MemberPaylistColumnActions,
): GridColDef<MemberPaymentItem>[] => [
  {
    field: "userId",
    headerName: "Member ID",
    flex: 1,
    minWidth: 170,
    renderCell: (params) => {
      const payment = params.row;
      const initial = payment.fullName
        ? payment.fullName.charAt(0).toUpperCase()
        : "M";

      return (
        <div className="flex items-center gap-2.5 h-full w-full min-w-0 overflow-hidden">
          <div className="w-8 h-8 min-w-[32px] max-w-[32px] h-[32px] min-h-[32px] max-h-[32px] rounded-xl overflow-hidden shrink-0 border border-slate-200/80 dark:border-slate-700/80 shadow-xs relative flex items-center justify-center bg-slate-100 dark:bg-slate-800">
            {payment.profileImage ? (
              <img
                src={payment.profileImage}
                alt={payment.fullName}
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
                payment.userId || payment._id,
              )} flex items-center justify-center text-white text-xs font-bold ${
                payment.profileImage ? "absolute inset-0 -z-10" : ""
              }`}
            >
              {initial || <LuUser className="w-4 h-4" />}
            </div>
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-semibold text-slate-800 dark:text-slate-100 truncate min-w-0 font-mono text-xs">
              {params.value}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
              {payment.paymentId}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    field: "fullName",
    headerName: "Member Name",
    flex: 1.2,
    minWidth: 160,
    renderCell: (params) => {
      const payment = params.row;
      return (
        <div className="flex flex-col justify-center h-full min-w-0 overflow-hidden">
          <span className="font-semibold text-slate-700 dark:text-slate-200 truncate min-w-0 text-xs sm:text-sm">
            {payment.fullName}
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate min-w-0">
            {payment.email || payment.phoneNumber || "No contact"}
          </span>
        </div>
      );
    },
  },
  {
    field: "membershipPlan",
    headerName: "Enrolled Plan",
    flex: 1.2,
    minWidth: 155,
    renderCell: (params) => {
      const plan = params.row.membershipPlan;
      return (
        <div className="flex items-center h-full min-w-0">
          {plan ? (
            <div className="flex flex-col min-w-0">
              <span className="font-medium text-slate-800 dark:text-slate-200 text-xs truncate">
                {plan.planName}
              </span>
              <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-mono">
                {plan.durationMonths} {plan.durationMonths === 1 ? "Month" : "Months"}
              </span>
            </div>
          ) : (
            <span className="text-xs text-slate-400 italic">No plan</span>
          )}
        </div>
      );
    },
  },
  {
    field: "assignment",
    headerName: "Plan Validity",
    flex: 1.2,
    minWidth: 165,
    renderCell: (params) => {
      const asgn = params.row.assignment;
      if (!asgn) return <span className="text-xs text-slate-400 italic">-</span>;

      const isExpired = asgn.status === "EXPIRED";
      return (
        <div className="flex items-center gap-1.5 text-xs font-mono h-full">
          <LuCalendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-slate-700 dark:text-slate-300">
              {formatDate(asgn.endDate)}
            </span>
            <span
              className={`text-[10px] font-semibold ${
                isExpired ? "text-rose-500" : "text-emerald-500"
              }`}
            >
              {isExpired ? "Expired" : "Active"}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    field: "totalAmount",
    headerName: "Total Fee",
    flex: 0.9,
    minWidth: 105,
    renderCell: (params) => {
      const total = Number(params.value) || 0;
      return (
        <div className="flex items-center gap-0.5 font-mono font-semibold text-slate-800 dark:text-slate-200 text-xs sm:text-sm h-full">
          <LuIndianRupee className="w-3.5 h-3.5 text-slate-400" />
          <span>{total.toLocaleString("en-IN")}</span>
        </div>
      );
    },
  },
  {
    field: "amountPaid",
    headerName: "Paid",
    flex: 0.9,
    minWidth: 105,
    renderCell: (params) => {
      const paid = Number(params.value) || 0;
      return (
        <div className="flex items-center gap-0.5 font-mono font-semibold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm h-full">
          <span>₹{paid.toLocaleString("en-IN")}</span>
        </div>
      );
    },
  },
  {
    field: "amountDue",
    headerName: "Due",
    flex: 0.9,
    minWidth: 105,
    renderCell: (params) => {
      const due = Number(params.value) || 0;
      return (
        <div className="flex items-center gap-0.5 font-mono font-semibold text-xs sm:text-sm h-full">
          <span
            className={
              due > 0
                ? "text-amber-600 dark:text-amber-400"
                : "text-slate-400 dark:text-slate-500"
            }
          >
            ₹{due.toLocaleString("en-IN")}
          </span>
        </div>
      );
    },
  },
  {
    field: "paymentStatus",
    headerName: "Status",
    flex: 1,
    minWidth: 120,
    renderCell: (params) => {
      const status = String(params.value || "PENDING").toUpperCase();
      switch (status) {
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
    },
  },
  {
    field: "actions",
    headerName: "Actions",
    sortable: false,
    filterable: false,
    width: 140,
    renderCell: (params) => {
      const payment = params.row;
      const isPaid = (payment.paymentStatus || "").toUpperCase() === "PAID";

      return (
        <div className="flex items-center gap-1.5 h-full">
          <Tooltip title={isPaid ? "Paid in Full" : "Collect Payment"} position="top">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                actions?.onPay?.(payment);
              }}
              className={`p-1.5 rounded-xl border transition-all duration-200 active:scale-90 cursor-pointer ${
                isPaid
                  ? "text-slate-400 hover:text-slate-600 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800"
                  : "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200/80 dark:border-indigo-800/80 hover:bg-indigo-100"
              }`}
              aria-label="Collect Fee"
            >
              <LuCreditCard className="w-4 h-4" />
            </button>
          </Tooltip>

          <Tooltip title="Payment History" position="top">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                actions?.onViewReceipts?.(payment);
              }}
              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent transition-all duration-200 active:scale-90 cursor-pointer"
              aria-label="View Receipts"
            >
              <LuReceipt className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      );
    },
  },
];

export default getMemberPaylistColumns;
