import { Modal } from "@mui/material";
import {
  LuMessageSquareQuote,
  LuCornerUpLeft,
  LuTrash2,
  LuMail,
  LuPhone,
  LuClock,
  LuX,
  LuUser,
  LuCircleCheck,
} from "react-icons/lu";

import Chip from "@/shared/components/ui/chip/Chip";
import Button from "@/shared/components/ui/buttons/Button";
import { getDeterministicGradient } from "@/shared/utils/gradient-colors";
import { formatDate } from "@/shared/utils/formatDate";
import type { EnquiryData, EnquiryRoles } from "../types/enquiry.types";

export interface EnquiryViewModalProps {
  open: boolean;
  enquiry: EnquiryData | null;
  onClose: () => void;
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

const EnquiryViewModal = ({
  open,
  enquiry,
  onClose,
  onReply,
  onDelete,
}: EnquiryViewModalProps) => {
  if (!enquiry) return null;

  return (
    <Modal
      open={Boolean(open)}
      onClose={onClose}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(15, 23, 42, 0.55)",
          },
        },
      }}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl shadow-2xl outline-none text-slate-800 dark:text-slate-100 transition-colors duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100 dark:border-white/10 shrink-0">
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              className={`w-12 h-12 rounded-2xl ${getDeterministicGradient(
                enquiry.enquiryId || enquiry._id,
              )} flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0`}
            >
              <LuMessageSquareQuote className="w-6 h-6" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
                  {enquiry.fullName}
                </h3>
                {getRoleChip(enquiry.role)}
                {enquiry.replied ? (
                  <Chip label="Replied" variant="active" dot size="xs" />
                ) : (
                  <Chip label="Pending" variant="warning" dot size="xs" />
                )}
              </div>
              <p className="text-xs font-mono text-slate-400 dark:text-slate-500">
                Enquiry ID: {enquiry.enquiryId}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <LuX className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Submitter Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-white/10 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700/60 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0 border border-slate-200/60 dark:border-white/10 shadow-xs">
                <LuUser className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10.5px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 block">
                  Full Name
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                  {enquiry.fullName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700/60 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0 border border-slate-200/60 dark:border-white/10 shadow-xs">
                <LuMail className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10.5px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 block">
                  Email Address
                </span>
                <a
                  href={`mailto:${enquiry.email}`}
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline truncate block"
                >
                  {enquiry.email}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700/60 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0 border border-slate-200/60 dark:border-white/10 shadow-xs">
                <LuPhone className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10.5px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 block">
                  Phone Number
                </span>
                {enquiry.phone ? (
                  <a
                    href={`tel:${enquiry.phone}`}
                    className="font-semibold text-slate-800 dark:text-slate-200 hover:underline truncate block"
                  >
                    {enquiry.phone}
                  </a>
                ) : (
                  <span className="text-slate-400 italic">Not provided</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700/60 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0 border border-slate-200/60 dark:border-white/10 shadow-xs">
                <LuClock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10.5px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 block">
                  Date Submitted
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                  {formatDate(enquiry.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Enquiry Message Box */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Customer Message
            </h4>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-white/10 shadow-xs space-y-2">
              <div className="font-bold text-sm text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-white/10">
                {enquiry.subject}
              </div>
              <div className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed pt-1">
                {enquiry.message}
              </div>
            </div>
          </div>

          {/* Reply Details Box (if replied) */}
          {enquiry.replied && enquiry.replyMessage && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <LuCircleCheck className="w-4 h-4" />
                <span>Admin Response</span>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-950/30 border border-emerald-500/20 shadow-xs space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-500/15 text-xs">
                  <span className="font-semibold text-emerald-800 dark:text-emerald-200">
                    {enquiry.replyMessage.subject || `Re: ${enquiry.subject}`}
                  </span>
                  {enquiry.replyMessage.repliedAt && (
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
                      {formatDate(enquiry.replyMessage.repliedAt)}
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed pt-1">
                  {enquiry.replyMessage.message}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 pt-3 border-t border-slate-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
          <Button
            type="button"
            variant="red"
            size="sm"
            onClick={() => onDelete(enquiry)}
            aria-label="Delete Enquiry"
          >
            <LuTrash2 className="w-4 h-4" />
            <span>Delete</span>
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onClose}
            >
              Close
            </Button>

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => onReply(enquiry)}
            >
              <LuCornerUpLeft className="w-4 h-4" />
              <span>{enquiry.replied ? "Reply Again" : "Reply to Enquiry"}</span>
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EnquiryViewModal;
