import { FiEdit2, FiTrash2 } from "react-icons/fi";
import type { GridColDef } from "@mui/x-data-grid";
import type { MembershipPlan } from "../types/membership-plan.types";
import { LuCrown } from "react-icons/lu";
import { getDeterministicGradient } from "@/shared/utils/gradient-colors";

export const membershipPlanColumns: GridColDef<MembershipPlan>[] = [
  {
    field: "planName",
    headerName: "Plan Name",
    flex: 1.5,
    minWidth: 200,
    renderCell: (params) => (
      <div className="flex justify-between align-middle items-center gap-3">
        <div
          className={`w-8 h-8 rounded-full ${getDeterministicGradient(
            params.row?._id || params.row?.membershipPlanId || params.value,
          )} flex items-center justify-center text-white shadow-xs`}
        >
          <LuCrown className="w-4 h-4" />
        </div>
        <span>{params.value}</span>
      </div>
    ),
  },
  {
    field: "durationMonths",
    headerName: "Duration",
    flex: 1,
    minWidth: 120,
    renderCell: (params) => <span>{`${params.value} Months`}</span>,
  },
  {
    field: "price",
    headerName: "Price",
    flex: 1,
    minWidth: 100,
    renderCell: (params) => `₹ ${Number(params.value).toFixed(2)}`,
  },
  {
    field: "features",
    headerName: "Features",
    flex: 2,
    minWidth: 250,
    renderCell: (params) => {
      const features = params.value;

      if (!features?.length) {
        return (
          <span className="text-slate-400 dark:text-slate-500 italic text-sm">
            None
          </span>
        );
      }

      return (
        <span className="flex items-center gap-1.5 truncate">
          <span className="text-slate-700 dark:text-slate-200">
            {features[0]}
          </span>
          {features.length > 1 && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700/80">
              +{features.length - 1} more
            </span>
          )}
        </span>
      );
    },
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    minWidth: 120,
    renderCell: (params) => (
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
          params.value === "Active"
            ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
        }`}
      >
        {params.value}
      </span>
    ),
  },
  {
    field: "actions",
    headerName: "Actions",
    sortable: false,
    filterable: false,
    width: 120,
    renderCell: () => (
      <div className="flex items-center gap-2 h-full">
        <button
          type="button"
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors cursor-pointer"
        >
          <FiEdit2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors cursor-pointer"
        >
          <FiTrash2 className="w-4 h-4" />
        </button>
      </div>
    ),
  },
];
