import type { GridColDef } from "@mui/x-data-grid";
import { LuMessageSquareQuote, LuCornerUpLeft, LuEye, LuTrash2 } from "react-icons/lu";

import Tooltip from "@/shared/components/ui/tooltip/Tooltip";
import Chip from "@/shared/components/ui/chip/Chip";
import { getDeterministicGradient } from "@/shared/utils/gradient-colors";
import { formatDate } from "@/shared/utils/formatDate";
import type { EnquiryData, EnquiryRoles } from "../types/enquiry.types";

export interface EnquiryColumnActions {
  onView?: (enquiry: EnquiryData) => void;
  onReply?: (enquiry: EnquiryData) => void;
  onDelete?: (enquiry: EnquiryData) => void;
}

const getRoleChip = (role?: EnquiryRoles) => {
  switch (role) {
    case "trainer":
      return <Chip label="Trainer" variant="blue" size="xs" />;
    case "member":
      return <Chip label="Member" variant="green" size="xs" />;
    case "visitor":
      return <Chip label="Visitor" variant="orange" size="xs" />;
    default:
      return <Chip label={role || "Other"} variant="gray" size="xs" />;
  }
};

export const getEnquiryColumns = (
  actions?: EnquiryColumnActions,
): GridColDef<EnquiryData>[] => [
  {
    field: "enquiryId",
    headerName: "Enquiry ID",
    flex: 0.9,
    minWidth: 140,
    renderCell: (params) => (
      <div className="flex items-center gap-3 h-full w-full min-w-0 overflow-hidden">
        <div
          className={`w-8 h-8 rounded-xl ${getDeterministicGradient(
            params.row?.enquiryId || params.row?._id || params.value,
          )} flex items-center justify-center text-white shadow-xs shrink-0`}
        >
          <LuMessageSquareQuote className="w-4 h-4" />
        </div>
        <span className="font-bold text-slate-800 dark:text-slate-100 truncate min-w-0 flex-1">
          {params.value}
        </span>
      </div>
    ),
  },
  {
    field: "fullName",
    headerName: "Full Name",
    flex: 1.1,
    minWidth: 150,
    renderCell: (params) => (
      <div className="flex items-center h-full w-full min-w-0 overflow-hidden">
        <span className="font-semibold text-slate-700 dark:text-slate-200 truncate min-w-0 flex-1">
          {params.value}
        </span>
      </div>
    ),
  },
  {
    field: "email",
    headerName: "Email",
    flex: 1.3,
    minWidth: 170,
    renderCell: (params) => (
      <div className="flex items-center h-full w-full min-w-0 overflow-hidden">
        <span className="text-slate-600 dark:text-slate-400 truncate min-w-0 flex-1">
          {params.value || "-"}
        </span>
      </div>
    ),
  },
  {
    field: "phone",
    headerName: "Phone",
    flex: 1,
    minWidth: 130,
    renderCell: (params) => (
      <div className="flex items-center h-full w-full min-w-0 overflow-hidden">
        <span className="text-slate-600 dark:text-slate-400 truncate min-w-0 flex-1">
          {params.value || "—"}
        </span>
      </div>
    ),
  },
  {
    field: "role",
    headerName: "Role",
    flex: 0.8,
    minWidth: 110,
    renderCell: (params) => (
      <div className="flex items-center h-full">
        {getRoleChip(params.value)}
      </div>
    ),
  },
  {
    field: "subject",
    headerName: "Subject",
    flex: 1.4,
    minWidth: 180,
    renderCell: (params) => (
      <div className="flex items-center h-full w-full min-w-0 overflow-hidden">
        <span className="font-medium text-slate-800 dark:text-slate-200 truncate min-w-0 flex-1">
          {params.value}
        </span>
      </div>
    ),
  },
  {
    field: "replied",
    headerName: "Status",
    flex: 0.9,
    minWidth: 120,
    renderCell: (params) => (
      <div className="flex items-center h-full">
        {params.value ? (
          <Chip label="Replied" variant="active" dot size="xs" />
        ) : (
          <Chip label="Pending" variant="warning" dot size="xs" />
        )}
      </div>
    ),
  },
  {
    field: "createdAt",
    headerName: "Date",
    flex: 1,
    minWidth: 140,
    renderCell: (params) => (
      <div className="flex items-center h-full w-full min-w-0 overflow-hidden">
        <span className="text-xs text-slate-500 dark:text-slate-400 truncate min-w-0 flex-1">
          {formatDate(params.value)}
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
      const enquiry = params.row;
      return (
        <div className="flex items-center gap-1.5 h-full">
          <Tooltip title="View Details" position="top">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (actions?.onView) actions.onView(enquiry);
              }}
              className="p-1.5 rounded-xl text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-transparent hover:border-indigo-200/60 dark:hover:border-indigo-800/60 transition-all duration-200 active:scale-90 cursor-pointer"
              aria-label="View Details"
            >
              <LuEye className="w-4 h-4" />
            </button>
          </Tooltip>

          <Tooltip
            title={enquiry.replied ? "Send Another Reply" : "Reply to Enquiry"}
            position="top"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (actions?.onReply) actions.onReply(enquiry);
              }}
              className="p-1.5 rounded-xl text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 border border-transparent hover:border-emerald-200/60 dark:hover:border-emerald-800/60 transition-all duration-200 active:scale-90 cursor-pointer"
              aria-label="Reply"
            >
              <LuCornerUpLeft className="w-4 h-4" />
            </button>
          </Tooltip>

          <Tooltip title="Delete Enquiry" position="top">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (actions?.onDelete) actions.onDelete(enquiry);
              }}
              className="p-1.5 rounded-xl text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-transparent hover:border-rose-200/60 dark:hover:border-rose-800/60 transition-all duration-200 active:scale-90 cursor-pointer"
              aria-label="Delete"
            >
              <LuTrash2 className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      );
    },
  },
];
