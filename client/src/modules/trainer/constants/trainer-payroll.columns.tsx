import type { GridColDef } from "@mui/x-data-grid";
import { LuIndianRupee, LuCreditCard, LuReceipt } from "react-icons/lu";

import Chip from "@/shared/components/ui/chip/Chip";
import Tooltip from "@/shared/components/ui/tooltip/Tooltip";
import { getDeterministicGradient } from "@/shared/utils/gradient-colors";
import type { Trainer } from "../types/trainer.types";

export interface TrainerPayrollColumnActions {
  onPay?: (trainer: Trainer) => void;
  onViewReceipts?: (trainer: Trainer) => void;
}

export const getTrainerPayrollColumns = (
  actions?: TrainerPayrollColumnActions,
): GridColDef<Trainer>[] => [
  {
    field: "userId",
    headerName: "Trainer",
    flex: 1.4,
    minWidth: 200,
    renderCell: (params) => {
      const trainer = params.row;
      const initial = trainer.fullName ? trainer.fullName.charAt(0).toUpperCase() : "T";

      return (
        <div className="flex items-center gap-3 h-full w-full min-w-0 overflow-hidden">
          {trainer.profileImage ? (
            <img
              src={trainer.profileImage}
              alt={trainer.fullName}
              className="w-8 h-8 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
            />
          ) : (
            <div
              className={`w-8 h-8 rounded-xl ${getDeterministicGradient(
                trainer.userId || trainer._id,
              )} flex items-center justify-center text-white text-xs font-bold shadow-xs shrink-0`}
            >
              {initial}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-100 truncate">
              {trainer.fullName}
            </p>
            <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 truncate">
              {trainer.userId}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    field: "shiftTime",
    headerName: "Shift",
    flex: 0.9,
    minWidth: 120,
    renderCell: (params) => {
      const shift = params.value as { start: string; end: string } | undefined;
      return (
        <div className="flex items-center h-full">
          <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {shift ? `${shift.start} - ${shift.end}` : "09:00 - 17:00"}
          </span>
        </div>
      );
    },
  },
  {
    field: "salary",
    headerName: "Base Salary",
    flex: 1,
    minWidth: 120,
    renderCell: (params) => {
      const salary = Number(params.value) || 0;
      return (
        <div className="flex items-center gap-1 font-mono font-semibold text-slate-800 dark:text-slate-200 text-xs sm:text-sm h-full">
          <LuIndianRupee className="w-3.5 h-3.5 text-slate-400" />
          <span>{salary.toLocaleString("en-IN")}</span>
        </div>
      );
    },
  },
  {
    field: "amountPaid",
    headerName: "Paid",
    flex: 1,
    minWidth: 110,
    renderCell: (params) => {
      const paid = Number(params.value) || 0;
      return (
        <div className="flex items-center gap-1 font-mono font-semibold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm h-full">
          <span>₹{paid.toLocaleString("en-IN")}</span>
        </div>
      );
    },
  },
  {
    field: "amountDue",
    headerName: "Due",
    flex: 1,
    minWidth: 110,
    renderCell: (params) => {
      const due = Number(params.value) || 0;
      return (
        <div className="flex items-center gap-1 font-mono font-semibold text-xs sm:text-sm h-full">
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
      const status = (String(params.value || "PENDING")).toUpperCase();
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
      const trainer = params.row;
      const isPaid = (trainer.paymentStatus || "").toUpperCase() === "PAID";

      return (
        <div className="flex items-center gap-1.5 h-full">
          <Tooltip title={isPaid ? "Paid in Full" : "Record Payout"} position="top">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                actions?.onPay?.(trainer);
              }}
              className={`p-1.5 rounded-xl border transition-all duration-200 active:scale-90 cursor-pointer ${
                isPaid
                  ? "text-slate-400 hover:text-slate-600 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800"
                  : "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200/80 dark:border-indigo-800/80 hover:bg-indigo-100"
              }`}
              aria-label="Process Payment"
            >
              <LuCreditCard className="w-4 h-4" />
            </button>
          </Tooltip>

          <Tooltip title="Payment History" position="top">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                actions?.onViewReceipts?.(trainer);
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
