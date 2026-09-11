import type { GridColDef } from "@mui/x-data-grid";

import { LuUserCheck } from "react-icons/lu";
import { FiEdit2, FiTrash2, FiEye } from "react-icons/fi";

import Tooltip from "@/shared/components/ui/tooltip/Tooltip";
import { getDeterministicGradient } from "@/shared/utils/gradient-colors";

import { Trainer } from "@/modules/trainer/types/trainer.types";

export interface TrainerColumnActions {
  onView?: (userId: string) => void;
  onEdit?: (userId: string) => void;
  onDelete?: (userId: string) => void;
}

export const getTrainerColumns = (
  actions?: TrainerColumnActions,
): GridColDef<Trainer>[] => [
  {
    field: "userId",
    headerName: "Trainer ID",
    flex: 0.8,
    minWidth: 130,
    renderCell: (params) => (
      <div className="flex items-center gap-3 h-full w-full min-w-0 overflow-hidden">
        <div
          className={`w-8 h-8 rounded-xl ${getDeterministicGradient(
            params.row?.userId || params.row?._id || params.value,
          )} flex items-center justify-center text-white shadow-xs shrink-0`}
        >
          <LuUserCheck className="w-4 h-4" />
        </div>
        <span className="font-semibold text-slate-800 dark:text-slate-100 truncate min-w-0 flex-1">
          {params.value}
        </span>
      </div>
    ),
  },
  {
    field: "fullName",
    headerName: "Full Name",
    flex: 1.2,
    minWidth: 160,
    renderCell: (params) => (
      <div className="flex items-center gap-3 h-full w-full min-w-0 overflow-hidden">
        <span className="font-medium text-slate-700 dark:text-slate-300 truncate min-w-0 flex-1">
          {params.value}
        </span>
      </div>
    ),
  },
  {
    field: "email",
    headerName: "Email",
    flex: 1.5,
    minWidth: 180,
    renderCell: (params) => (
      <div className="flex items-center gap-3 h-full w-full min-w-0 overflow-hidden">
        <span className="text-slate-600 dark:text-slate-400 truncate min-w-0 flex-1">
          {params.value || "-"}
        </span>
      </div>
    ),
  },
  {
    field: "phone",
    headerName: "Phone",
    flex: 1.1,
    minWidth: 130,
    renderCell: (params) => (
      <div className="flex items-center gap-3 h-full w-full min-w-0 overflow-hidden">
        <span className="text-slate-600 dark:text-slate-400 truncate min-w-0 flex-1">
          {params.value || "-"}
        </span>
      </div>
    ),
  },
  {
    field: "salary",
    headerName: "Salary",
    flex: 1,
    minWidth: 120,
    renderCell: (params) => (
      <div className="flex items-center gap-3 h-full w-full min-w-0 overflow-hidden">
        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate min-w-0 flex-1">
          {params.value != null
            ? `₹${Number(params.value).toLocaleString()}`
            : "-"}
        </span>
      </div>
    ),
  },
  {
    field: "specialization",
    headerName: "Specialization",
    flex: 1,
    minWidth: 120,
    renderCell: (params) => (
      <div className="flex items-center gap-3 h-full w-full min-w-0 overflow-hidden">
        <span className="text-slate-600 dark:text-slate-400 truncate min-w-0 flex-1">
          {params.value || "-"}
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
      const id = params.row?.userId;
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
          <Tooltip title="Edit Trainer" position="top">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (id && actions?.onEdit) actions.onEdit(id);
              }}
              className="p-1.5 rounded-xl text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 border border-transparent hover:border-emerald-200/60 dark:hover:border-emerald-800/60 transition-all duration-200 active:scale-90 cursor-pointer"
              aria-label="Edit Trainer"
            >
              <FiEdit2 className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip title="Delete Trainer" position="top">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (id && actions?.onDelete) actions.onDelete(id);
              }}
              className="p-1.5 rounded-xl text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-transparent hover:border-rose-200/60 dark:hover:border-rose-800/60 transition-all duration-200 active:scale-90 cursor-pointer"
              aria-label="Delete Trainer"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      );
    },
  },
];

export const trainerColumns = getTrainerColumns();
