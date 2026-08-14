import { FiEdit2, FiTrash2 } from "react-icons/fi";
import type { GridColDef } from "@mui/x-data-grid";
import type { MembershipPlan } from "../types/membership-plan.types";

export const membershipPlanColumns: GridColDef<MembershipPlan>[] = [
  { field: "name", headerName: "Plan Name", flex: 1, minWidth: 150 },
  { field: "duration", headerName: "Duration", flex: 1, minWidth: 120 },
  {
    field: "price",
    headerName: "Price",
    flex: 1,
    minWidth: 100,
    renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
  },
  {
    field: "description",
    headerName: "Description",
    flex: 1.5,
    minWidth: 200,
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
