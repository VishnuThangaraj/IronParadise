import { useMemo } from "react";
import {
  LuInbox,
  LuClock,
  LuCircleCheck,
  LuCalendar,
} from "react-icons/lu";

import { KPIGrid, type KPICardProps } from "@/shared/components/ui/kpi";
import type { EnquiryData } from "../types/enquiry.types";

export interface EnquiryKPIProps {
  enquiries: EnquiryData[];
  loading?: boolean;
}

const EnquiryKPI = ({ enquiries, loading = false }: EnquiryKPIProps) => {
  const total = enquiries.length;
  const pending = useMemo(
    () => enquiries.filter((e) => !e.replied).length,
    [enquiries],
  );
  const replied = useMemo(
    () => enquiries.filter((e) => e.replied).length,
    [enquiries],
  );
  const todayCount = useMemo(() => {
    const today = new Date().toDateString();
    return enquiries.filter((e) => {
      if (!e.createdAt) return false;
      return new Date(e.createdAt).toDateString() === today;
    }).length;
  }, [enquiries]);

  const replyRate = total > 0 ? Math.round((replied / total) * 100) : 0;

  const kpiData: KPICardProps[] = useMemo(() => {
    return [
      {
        id: "total-enquiries",
        title: "Total Enquiries",
        value: loading ? "..." : String(total),
        subtitle: "All-time received",
        change: `${total} total enquiries`,
        trend: "neutral",
        icon: LuInbox,
        color: "blue",
      },
      {
        id: "pending-enquiries",
        title: "Pending Enquiries",
        value: loading ? "..." : String(pending),
        subtitle: "Awaiting response",
        change: pending > 0 ? `${pending} awaiting reply` : "Inbox up to date",
        trend: pending > 0 ? "down" : "up",
        icon: LuClock,
        color: "amber",
      },
      {
        id: "replied-enquiries",
        title: "Replied Enquiries",
        value: loading ? "..." : String(replied),
        subtitle: "Successfully answered",
        change: `${replyRate}% response rate`,
        trend: replyRate >= 50 ? "up" : "neutral",
        icon: LuCircleCheck,
        color: "emerald",
      },
      {
        id: "today-enquiries",
        title: "Today's Enquiries",
        value: loading ? "..." : String(todayCount),
        subtitle: "Received today",
        change:
          todayCount > 0
            ? `+${todayCount} new today`
            : "No inquiries today",
        trend: todayCount > 0 ? "up" : "neutral",
        icon: LuCalendar,
        color: "violet",
      },
    ];
  }, [loading, total, pending, replied, todayCount, replyRate]);

  return <KPIGrid items={kpiData} columns={4} />;
};

export default EnquiryKPI;
