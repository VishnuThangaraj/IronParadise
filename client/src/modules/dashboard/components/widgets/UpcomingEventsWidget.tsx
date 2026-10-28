import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuCalendar,
  LuCake,
  LuArrowRight,
  LuClock,
  LuUsers,
} from "react-icons/lu";
import Container from "@/shared/components/ui/containers/Container";
import type { DashboardEvent, DashboardBirthday } from "../../types/dashboard.types";

interface UpcomingEventsWidgetProps {
  events: DashboardEvent[];
  birthdays: DashboardBirthday[];
  className?: string;
}

export const UpcomingEventsWidget = ({
  events = [],
  birthdays = [],
  className = "",
}: UpcomingEventsWidgetProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"events" | "birthdays">("events");

  const formatDateBadge = (dateStr: string) => {
    if (!dateStr) return { month: "", day: "" };
    const date = new Date(dateStr);
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const day = date.getDate();
    return { month, day };
  };

  return (
    <Container
      variant="secondary"
      className={`w-full! max-w-none! mx-0! p-4! sm:p-5! rounded-2xl! flex-col justify-between ${className}`}
    >
      {/* Header with Switcher Tabs */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/50">
          <button
            onClick={() => setActiveTab("events")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "events"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            <LuCalendar className="w-3.5 h-3.5" />
            <span>Events ({events.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("birthdays")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "birthdays"
                ? "bg-white dark:bg-slate-900 text-rose-500 dark:text-rose-400 shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            <LuCake className="w-3.5 h-3.5" />
            <span>Birthdays ({birthdays.length})</span>
          </button>
        </div>

        <button
          onClick={() => navigate("/events")}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer group"
        >
          <span>Calendar</span>
          <LuArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* Content Area */}
      <div className="mt-3 flex-1">
        {activeTab === "events" ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {events.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                No upcoming events scheduled
              </div>
            ) : (
              events.slice(0, 5).map((ev) => {
                const { month, day } = formatDateBadge(ev.date);
                return (
                  <div
                    key={ev.eventId}
                    onClick={() => navigate("/events")}
                    className="py-2.5 flex items-center justify-between gap-3 group hover:bg-slate-50/60 dark:hover:bg-slate-800/30 px-2 rounded-xl transition-colors cursor-pointer"
                  >
                    {/* Date Badge & Title */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/70 dark:border-indigo-800/60 flex flex-col items-center justify-center shrink-0 shadow-xs">
                        <span className="text-[9px] uppercase font-bold text-indigo-600 dark:text-indigo-400 leading-none">
                          {month}
                        </span>
                        <span className="text-sm font-black text-slate-900 dark:text-slate-100 font-mono leading-none mt-0.5">
                          {day}
                        </span>
                      </div>

                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {ev.title}
                        </p>
                        <div className="flex items-center gap-2 text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5">
                          <span className="flex items-center gap-1">
                            <LuClock className="w-3 h-3 text-slate-400" />
                            {ev.time}
                          </span>
                          <span>•</span>
                          <span className="capitalize text-[10px] text-slate-500 dark:text-slate-400">
                            {ev.visibility}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/50">
                      {ev.visibility === "all" ? "Open for All" : ev.visibility}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {birthdays.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                No member or trainer birthdays this month
              </div>
            ) : (
              birthdays.slice(0, 5).map((b) => (
                <div
                  key={b.userId}
                  className="py-2.5 flex items-center justify-between gap-3 px-2 rounded-xl hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {b.profileImage ? (
                      <img
                        src={b.profileImage}
                        alt={b.fullName}
                        className="w-9 h-9 rounded-full object-cover shrink-0 border border-rose-200 dark:border-rose-900/60 shadow-xs"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-linear-to-br from-rose-500 to-pink-600 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-xs">
                        {b.fullName.slice(0, 2).toUpperCase()}
                      </div>
                    )}

                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                          {b.fullName}
                        </p>
                        <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          {b.role}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-rose-500 dark:text-rose-400 font-medium mt-0.5 flex items-center gap-1">
                        <LuCake className="w-3 h-3" />
                        Celebrating on day {b.day} of this month
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 text-xs font-bold text-rose-600 dark:text-rose-400 font-mono px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200/70 dark:border-rose-800/60">
                    Day {b.day}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Widget Footer */}
      <div className="pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
        <span className="flex items-center gap-1.5">
          <LuUsers className="w-3.5 h-3.5 text-indigo-500" />
          Community highlights
        </span>
        <button
          onClick={() => navigate("/events")}
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
        >
          Manage All Events
        </button>
      </div>
    </Container>
  );
};

export default UpcomingEventsWidget;
