import { useNavigate } from "react-router-dom";
import { LuMessageSquare, LuArrowRight, LuMail, LuCheck, LuClock } from "react-icons/lu";
import Container from "@/shared/components/ui/containers/Container";
import type { DashboardEnquiry } from "../../types/dashboard.types";

interface RecentEnquiriesWidgetProps {
  enquiries: DashboardEnquiry[];
  className?: string;
}

export const RecentEnquiriesWidget = ({
  enquiries = [],
  className = "",
}: RecentEnquiriesWidgetProps) => {
  const navigate = useNavigate();

  const formatDate = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Container
      variant="secondary"
      className={`w-full! max-w-none! mx-0! p-4! sm:p-5! rounded-2xl! flex-col justify-between ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400 border border-cyan-500/20">
            <LuMessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Inbound Leads & Enquiries
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              Questions & feedback from prospective and existing members
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/enquiry")}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer group"
        >
          <span>All Enquiries</span>
          <LuArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Enquiries list */}
      <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800/60 flex-1">
        {enquiries.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
            No inquiries received yet
          </div>
        ) : (
          enquiries.slice(0, 5).map((enq) => (
            <div
              key={enq.enquiryId}
              onClick={() => navigate("/enquiry")}
              className="py-2.5 flex items-center justify-between gap-3 px-2 rounded-xl hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {enq.fullName}
                  </p>
                  <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    {enq.role}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium truncate mt-0.5">
                  {enq.subject}
                </p>
                <div className="flex items-center gap-2 text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5">
                  <span className="flex items-center gap-1">
                    <LuMail className="w-3 h-3" />
                    {enq.email}
                  </span>
                  <span>•</span>
                  <span>{formatDate(enq.createdAt)}</span>
                </div>
              </div>

              <div className="shrink-0 text-right">
                {enq.replied ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 border border-emerald-500/20">
                    <LuCheck className="w-3 h-3" />
                    Replied
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300 border border-amber-500/20">
                    <LuClock className="w-3 h-3" />
                    Pending
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer link */}
      <div className="pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
        <span>Lead capture from Contact form</span>
        <button
          onClick={() => navigate("/enquiry")}
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
        >
          View Messages Inbox
        </button>
      </div>
    </Container>
  );
};

export default RecentEnquiriesWidget;
