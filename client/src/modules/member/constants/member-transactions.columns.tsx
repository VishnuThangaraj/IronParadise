import type { GridColDef } from "@mui/x-data-grid";
import {
  LuReceipt,
  LuPrinter,
  LuCalendar,
  LuIndianRupee,
  LuUser,
} from "react-icons/lu";

import Chip from "@/shared/components/ui/chip/Chip";
import Tooltip from "@/shared/components/ui/tooltip/Tooltip";
import { formatDate } from "@/shared/utils/formatDate";
import { getDeterministicGradient } from "@/shared/utils/gradient-colors";
import type { MemberPaymentReceipt } from "../types/member-payment.types";

export interface MemberTransactionsColumnActions {
  onPrintInvoice?: (receipt: MemberPaymentReceipt) => void;
}

export const getMemberTransactionsColumns = (
  actions?: MemberTransactionsColumnActions,
): GridColDef<MemberPaymentReceipt>[] => [
  {
    field: "receiptNumber",
    headerName: "Receipt / Invoice ID",
    flex: 1.1,
    minWidth: 175,
    renderCell: (params) => {
      const receipt = params.row;
      return (
        <div className="flex items-center gap-2.5 h-full w-full min-w-0">
          <div className="w-7 h-7 min-w-[28px] max-w-[28px] h-[28px] rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-900/40 shadow-2xs">
            <LuReceipt className="w-3.5 h-3.5" />
          </div>
          <span className="font-mono font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate">
            {receipt.receiptNumber}
          </span>
        </div>
      );
    },
  },
  {
    field: "fullName",
    headerName: "Member Name",
    flex: 1.3,
    minWidth: 190,
    renderCell: (params) => {
      const receipt = params.row;
      const memberName = receipt.fullName || `Member (${receipt.userId})`;
      const initial = memberName.charAt(0).toUpperCase();

      return (
        <div className="flex items-center gap-2.5 h-full w-full min-w-0">
          <div className="w-8 h-8 min-w-[32px] max-w-[32px] h-[32px] min-h-[32px] max-h-[32px] rounded-xl overflow-hidden shrink-0 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs relative flex items-center justify-center bg-slate-100 dark:bg-slate-800">
            {receipt.profileImage ? (
              <img
                src={receipt.profileImage}
                alt={memberName}
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
                receipt.userId,
              )} flex items-center justify-center text-white text-xs font-bold ${
                receipt.profileImage ? "absolute inset-0 -z-10" : ""
              }`}
            >
              {initial || <LuUser className="w-4 h-4" />}
            </div>
          </div>

          <div className="flex flex-col min-w-0 truncate">
            <span className="font-semibold text-slate-800 dark:text-slate-100 text-xs sm:text-sm truncate">
              {memberName}
            </span>
            <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
              {receipt.userId}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    field: "planName",
    headerName: "Plan",
    flex: 1.1,
    minWidth: 140,
    renderCell: (params) => (
      <div className="flex items-center h-full">
        <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
          {params.value || "Membership Plan"}
        </span>
      </div>
    ),
  },
  {
    field: "amountPaid",
    headerName: "Amount Paid",
    flex: 1,
    minWidth: 120,
    renderCell: (params) => {
      const amount = Number(params.value) || 0;
      return (
        <div className="flex items-center gap-1 font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm h-full">
          <LuIndianRupee className="w-3.5 h-3.5 text-emerald-500" />
          <span>{amount.toLocaleString("en-IN")}</span>
        </div>
      );
    },
  },
  {
    field: "paymentMethod",
    headerName: "Payment Mode",
    flex: 0.9,
    minWidth: 120,
    renderCell: (params) => {
      const method = String(params.value || "OTHER").toUpperCase();
      let variant: "success" | "info" | "warning" | "primary" | "gray" = "info";
      if (method === "UPI") variant = "success";
      if (method === "BANK_TRANSFER") variant = "primary";
      if (method === "CASH") variant = "warning";
      if (method === "CARD") variant = "info";

      return (
        <div className="flex items-center h-full">
          <Chip variant={variant} size="xs" label={method} />
        </div>
      );
    },
  },
  {
    field: "referenceNumber",
    headerName: "Reference / UTR",
    flex: 1,
    minWidth: 140,
    renderCell: (params) => (
      <div className="flex items-center h-full text-xs font-mono text-slate-500 dark:text-slate-400">
        {params.value ? (
          <span className="truncate">{params.value}</span>
        ) : (
          <span className="text-slate-400 dark:text-slate-600 italic">Direct / Cash</span>
        )}
      </div>
    ),
  },
  {
    field: "paymentDate",
    headerName: "Date",
    flex: 1.1,
    minWidth: 145,
    renderCell: (params) => (
      <div className="flex items-center gap-1.5 h-full text-xs text-slate-600 dark:text-slate-400 font-mono">
        <LuCalendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>{formatDate(params.value as string)}</span>
      </div>
    ),
  },
  {
    field: "actions",
    headerName: "Action",
    width: 110,
    sortable: false,
    filterable: false,
    renderCell: (params) => {
      const receipt = params.row;
      return (
        <div className="flex items-center justify-end h-full w-full pr-2">
          <Tooltip title="View & Print Official Invoice">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                actions?.onPrintInvoice?.(receipt);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/80 dark:border-indigo-800/80 transition-all cursor-pointer shadow-2xs hover:scale-102"
              aria-label="Print Invoice"
            >
              <LuPrinter className="w-3.5 h-3.5" />
              <span>Invoice</span>
            </button>
          </Tooltip>
        </div>
      );
    },
  },
];

export default getMemberTransactionsColumns;
