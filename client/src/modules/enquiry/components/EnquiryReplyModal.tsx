import { useState, useEffect } from "react";
import { Modal } from "@mui/material";
import {
  LuCornerUpLeft,
  LuSend,
  LuX,
  LuMail,
  LuQuote,
} from "react-icons/lu";

import Button from "@/shared/components/ui/buttons/Button";
import Input from "@/shared/components/ui/forms/Input";
import type { EnquiryData } from "../types/enquiry.types";

export interface EnquiryReplyModalProps {
  open: boolean;
  enquiry: EnquiryData | null;
  onClose: () => void;
  isPending?: boolean;
  onSubmit: (replyData: { subject: string; message: string }) => void;
}

const EnquiryReplyModal = ({
  open,
  enquiry,
  onClose,
  isPending = false,
  onSubmit,
}: EnquiryReplyModalProps) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  // Sync state whenever open or enquiry changes
  useEffect(() => {
    if (enquiry && open) {
      setSubject(
        enquiry.subject.startsWith("Re:")
          ? enquiry.subject
          : `Re: ${enquiry.subject}`,
      );
      setMessage("");
    }
  }, [enquiry, open]);

  if (!enquiry) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isPending) return;

    onSubmit({
      subject: subject.trim() || `Re: ${enquiry.subject}`,
      message: message.trim(),
    });
  };

  return (
    <Modal
      open={Boolean(open)}
      onClose={isPending ? undefined : onClose}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(15, 23, 42, 0.55)",
          },
        },
      }}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl shadow-2xl outline-none text-slate-800 dark:text-slate-100 transition-colors duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100 dark:border-white/10 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/60 shadow-xs shrink-0">
              <LuCornerUpLeft className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">
                Reply to Enquiry
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                Recipient: <span className="font-semibold text-slate-700 dark:text-slate-300">{enquiry.fullName}</span> ({enquiry.email})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Close modal"
          >
            <LuX className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            {/* Original message reference block */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-white/10 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-500 dark:text-slate-400">
                <LuQuote className="w-3.5 h-3.5 text-indigo-500" />
                <span>Original Message:</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 italic line-clamp-2 pl-4 border-l-2 border-indigo-400/60 dark:border-indigo-500/60">
                &ldquo;{enquiry.message}&rdquo;
              </p>
            </div>

            {/* Subject Input */}
            <div>
              <Input
                label="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Reply subject..."
                required
                disabled={isPending}
              />
            </div>

            {/* Message Textarea */}
            <div>
              <Input
                label="Reply Message"
                multiline
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your official reply to this customer..."
                required
                disabled={isPending}
              />
            </div>

            {/* Email Dispatch Notice */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-[11.5px] text-indigo-700 dark:text-indigo-300">
              <LuMail className="w-4 h-4 shrink-0 text-indigo-500" />
              <span>
                Sending this reply will automatically email <span className="font-semibold">{enquiry.email}</span> and mark this enquiry as resolved.
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 sm:p-6 pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-3 shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={isPending}
              disabled={!message.trim() || isPending}
            >
              <LuSend className="w-4 h-4" />
              <span>Send Reply</span>
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EnquiryReplyModal;
