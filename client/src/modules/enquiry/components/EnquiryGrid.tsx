import {
  LuMessageSquareQuote,
  LuEye,
  LuCornerUpLeft,
  LuTrash2,
  LuMail,
  LuPhone,
  LuClock,
  LuInbox,
} from "react-icons/lu";

import Chip from "@/shared/components/ui/chip/Chip";
import Button from "@/shared/components/ui/buttons/Button";
import Tooltip from "@/shared/components/ui/tooltip/Tooltip";
import Container from "@/shared/components/ui/containers/Container";
import { getDeterministicGradient } from "@/shared/utils/gradient-colors";
import { formatDate } from "@/shared/utils/formatDate";
import type { EnquiryData, EnquiryRoles } from "../types/enquiry.types";

export interface EnquiryGridProps {
  rows: EnquiryData[];
  loading?: boolean;
  onView: (enquiry: EnquiryData) => void;
  onReply: (enquiry: EnquiryData) => void;
  onDelete: (enquiry: EnquiryData) => void;
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

const EnquiryGrid = ({
  rows,
  loading = false,
  onView,
  onReply,
  onDelete,
}: EnquiryGridProps) => {
  if (rows.length === 0 && !loading) {
    return (
      <Container
        variant="secondary"
        className="w-full! max-w-full! py-16! flex flex-col items-center justify-center gap-3 rounded-2xl! text-center shadow-xs"
      >
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/60 shadow-xs">
          <LuInbox size={26} />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            No enquiries found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            No customer enquiries match your current search query or active filter settings.
          </p>
        </div>
      </Container>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {rows.map((row) => {
        const idKey = row._id || row.enquiryId;
        return (
          <Container
            variant="secondary"
            key={`enquiry-card-${idKey}`}
            className="flex-col justify-between p-5! gap-4 rounded-2xl! group hover:z-20 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 dark:hover:shadow-black/40 hover:-translate-y-0.5"
          >
            {/* Top Section */}
            <div className="flex flex-col gap-3.5">
              {/* Header: Avatar, Name, Role & Status */}
              <div className="flex items-start gap-3">
                <div
                  className={`w-11 h-11 rounded-2xl ${getDeterministicGradient(
                    row.enquiryId || row._id,
                  )} flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300 shrink-0`}
                >
                  <LuMessageSquareQuote size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate tracking-tight">
                      {row.fullName}
                    </span>
                    {getRoleChip(row.role)}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                    {row.enquiryId}
                  </span>
                </div>

                <div className="shrink-0">
                  {row.replied ? (
                    <Chip label="Replied" variant="active" dot size="xs" />
                  ) : (
                    <Chip label="Pending" variant="warning" dot size="xs" />
                  )}
                </div>
              </div>

              {/* Submitter Contact info & Timestamp */}
              <div className="grid grid-cols-1 gap-1 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2 truncate">
                  <LuMail className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                  <span className="truncate">{row.email}</span>
                </div>

                {row.phone && (
                  <div className="flex items-center gap-2 truncate">
                    <LuPhone className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                    <span className="truncate">{row.phone}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                  <LuClock className="w-3 h-3 shrink-0" />
                  <span>{formatDate(row.createdAt)}</span>
                </div>
              </div>

              {/* Subtle Divider */}
              <div className="h-px w-full bg-slate-200/60 dark:bg-white/10" />

              {/* Subject & Message Content */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                  {row.subject}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                  {row.message}
                </p>
              </div>

              {/* Reply Callout (if already replied) */}
              {row.replied && row.replyMessage && (
                <div className="rounded-xl p-2.5 bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-500/20 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                    <span className="flex items-center gap-1.5">
                      <LuCornerUpLeft className="w-3 h-3" />
                      <span>Replied</span>
                    </span>
                    {row.replyMessage.repliedAt && (
                      <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-normal">
                        {formatDate(row.replyMessage.repliedAt)}
                      </span>
                    )}
                  </div>
                  <p className="text-[11.5px] text-emerald-800 dark:text-emerald-300 italic line-clamp-2">
                    &ldquo;{row.replyMessage.message}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Action Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-white/5">
              <Button
                size="sm"
                className="flex-1 font-semibold"
                variant="transparent"
                onClick={() => onView(row)}
                aria-label="View Details"
              >
                <LuEye size={14} className="shrink-0" />
                <span>View</span>
              </Button>

              <Tooltip
                title={row.replied ? "Send another reply" : "Reply to enquiry"}
              >
                <Button
                  size="sm"
                  variant="green"
                  onClick={() => onReply(row)}
                  aria-label="Reply"
                >
                  <LuCornerUpLeft size={14} className="shrink-0" />
                  <span className="hidden sm:inline">
                    {row.replied ? "Reply Again" : "Reply"}
                  </span>
                </Button>
              </Tooltip>

              <Tooltip title="Delete this enquiry">
                <Button
                  size="sm"
                  variant="red"
                  onClick={() => onDelete(row)}
                  aria-label="Delete"
                >
                  <LuTrash2 size={14} className="shrink-0" />
                </Button>
              </Tooltip>
            </div>
          </Container>
        );
      })}
    </div>
  );
};

export default EnquiryGrid;
