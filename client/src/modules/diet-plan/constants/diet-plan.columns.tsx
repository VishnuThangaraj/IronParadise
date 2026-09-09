import type { GridColDef } from "@mui/x-data-grid";

import { LuUtensils } from "react-icons/lu";
import { FiEdit2, FiTrash2, FiEye } from "react-icons/fi";

import Tooltip from "@/shared/components/ui/tooltip/Tooltip";
import { getDeterministicGradient } from "@/shared/utils/gradient-colors";

import { DietPlan } from "@/modules/diet-plan/types/diet-plan.types";

export interface DietPlanColumnActions {
  onView?: (planId: string) => void;
  onEdit?: (planId: string) => void;
  onDelete?: (planId: string) => void;
}

export const getDietPlanColumns = (
  actions?: DietPlanColumnActions,
): GridColDef<DietPlan>[] => [
  {
    field: "dietPlanId",
    headerName: "Plan ID",
    flex: 0.8,
    renderCell: (params) => (
      <div className="flex items-center gap-3 h-full w-full min-w-0 overflow-hidden">
        <div
          className={`w-8 h-8 rounded-xl ${getDeterministicGradient(
            params.row?.dietPlanId || params.row?._id || params.value,
          )} flex items-center justify-center text-white shadow-xs shrink-0`}
        >
          <LuUtensils className="w-4 h-4" />
        </div>
        <span className="font-semibold text-slate-800 dark:text-slate-100 truncate min-w-0 flex-1">
          {params.value}
        </span>
      </div>
    ),
  },
  {
    field: "planName",
    headerName: "Plan Name",
    flex: 1.5,
    minWidth: 200,
    renderCell: (params) => (
      <div className="flex items-center gap-3 h-full w-full min-w-0 overflow-hidden">
        <span className="font-medium text-slate-700 dark:text-slate-300  truncate min-w-0 flex-1">
          {params.value}
        </span>
      </div>
    ),
  },
  {
    field: "goal",
    headerName: "Goal",
    flex: 1.5,
    minWidth: 200,
    renderCell: (params) => (
      <div className="flex items-center gap-3 h-full w-full min-w-0 overflow-hidden">
        <span className="font-semibold text-slate-800 dark:text-slate-100 truncate min-w-0 flex-1">
          {params.value}
        </span>
      </div>
    ),
  },
  {
    field: "description",
    headerName: "Description",
    flex: 2,
    minWidth: 200,
    renderCell: (params) => (
      <div className="flex items-center gap-3 h-full w-full min-w-0 overflow-hidden">
        <span className="font-medium text-slate-700 dark:text-slate-300 truncate min-w-0 flex-1">
          {params.value}
        </span>
      </div>
    ),
  },
  {
    field: "actions",
    headerName: "Actions",
    sortable: false,
    filterable: false,
    width: 140,
    renderCell: (params) => {
      const id = params.row?.dietPlanId;
      return (
        <div className="flex items-center gap-1.5 h-full">
          <Tooltip title="View Details" position="top">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (id && actions?.onView) actions.onView(id);
              }}
              className="p-1.5 rounded-xl text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-transparent hover:border-indigo-200/60 dark:hover:border-indigo-800/60 transition-all duration-200 active:scale-90 cursor-pointer"
              aria-label="View Details"
            >
              <FiEye className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip title="Edit Plan" position="top">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (id && actions?.onEdit) actions.onEdit(id);
              }}
              className="p-1.5 rounded-xl text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 border border-transparent hover:border-emerald-200/60 dark:hover:border-emerald-800/60 transition-all duration-200 active:scale-90 cursor-pointer"
              aria-label="Edit Plan"
            >
              <FiEdit2 className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip title="Delete Plan" position="top">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (id && actions?.onDelete) actions.onDelete(id);
              }}
              className="p-1.5 rounded-xl text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-transparent hover:border-rose-200/60 dark:hover:border-rose-800/60 transition-all duration-200 active:scale-90 cursor-pointer"
              aria-label="Delete Plan"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      );
    },
  },
];

export const dietPlanColumns = getDietPlanColumns();
