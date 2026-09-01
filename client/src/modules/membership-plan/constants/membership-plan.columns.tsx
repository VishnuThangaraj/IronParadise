import type { GridColDef } from "@mui/x-data-grid";

import { LuCrown } from "react-icons/lu";
import { FiEdit2, FiTrash2, FiEye } from "react-icons/fi";

import Tooltip from "@/shared/components/ui/tooltip/Tooltip";
import { getDeterministicGradient } from "@/shared/utils/gradient-colors";
import type { MembershipPlan } from "@/modules/membership-plan/types/membership-plan.types";

export interface MembershipPlanColumnActions {
  onView?: (planId: string) => void;
  onEdit?: (planId: string) => void;
  onDelete?: (planId: string) => void;
}

export const getMembershipPlanColumns = (
  actions?: MembershipPlanColumnActions,
): GridColDef<MembershipPlan>[] => [
  {
    field: "membershipPlanId",
    headerName: "Plan ID",
    flex: 1,
    renderCell: (params) => (
      <div className="flex items-center gap-3 h-full w-full min-w-0 overflow-hidden">
        <div
          className={`w-8 h-8 rounded-xl ${getDeterministicGradient(
            params.row?._id || params.row?.membershipPlanId || params.value,
          )} flex items-center justify-center text-white shadow-xs shrink-0`}
        >
          <LuCrown className="w-4 h-4" />
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
        <span className="font-semibold text-slate-800 dark:text-slate-100 truncate min-w-0 flex-1">
          {params.value}
        </span>
      </div>
    ),
  },
  {
    field: "durationMonths",
    headerName: "Duration",
    flex: 1,
    minWidth: 120,
    renderCell: (params) => (
      <span className="font-medium text-slate-700 dark:text-slate-300">
        {params.value} {params.value === 1 ? "Month" : "Months"}
      </span>
    ),
  },
  {
    field: "price",
    headerName: "Price",
    flex: 1,
    minWidth: 120,
    renderCell: (params) => (
      <span className="font-bold text-slate-900 dark:text-slate-100">
        ₹
        {Number(params.value).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    ),
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
          <span className="text-slate-400 dark:text-slate-500 italic text-xs">
            Standard privileges
          </span>
        );
      }

      return (
        <div className="flex items-center gap-1.5 h-full w-full min-w-0 overflow-hidden">
          <span className="text-slate-700 dark:text-slate-200 truncate min-w-0 text-xs font-medium">
            {features[0]}
          </span>
          {features.length > 1 && (
            <Tooltip
              title={
                <div className="flex flex-col gap-1 py-0.5 text-left">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Plan Features
                  </span>
                  {features.map((feature: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-200"
                    >
                      <span className="text-emerald-500 font-bold">✓</span>{" "}
                      {feature}
                    </div>
                  ))}
                </div>
              }
              position="top"
            >
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/15 cursor-help shrink-0 leading-none">
                +{features.length - 1} more
              </span>
            </Tooltip>
          )}
        </div>
      );
    },
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    minWidth: 120,
    renderCell: (params) => {
      const isActive = params.row?.isActive ?? params.value === "Active";
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
            isActive
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
              : "bg-slate-500/10 text-slate-500 dark:text-slate-400 border border-slate-500/20"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isActive ? "bg-emerald-500" : "bg-slate-400"
            }`}
          />
          {isActive ? "Active" : "Inactive"}
        </span>
      );
    },
  },
  {
    field: "actions",
    headerName: "Actions",
    sortable: false,
    filterable: false,
    width: 140,
    renderCell: (params) => {
      const id = params.row?.membershipPlanId;
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

export const membershipPlanColumns = getMembershipPlanColumns();
