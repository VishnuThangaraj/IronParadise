import { LuCreditCard, LuReceipt } from "react-icons/lu";

export type MembershipPaylistTabKey = "paylist" | "transactions";

export interface MembershipPaylistTabsProps {
  activeTab: MembershipPaylistTabKey;
  onTabChange: (tab: MembershipPaylistTabKey) => void;
  membersCount?: number;
  transactionsCount?: number;
}

const MembershipPaylistTabs = ({
  activeTab,
  onTabChange,
  membersCount,
  transactionsCount,
}: MembershipPaylistTabsProps) => {
  return (
    <div className="w-full flex items-center justify-between sm:justify-start -mt-1">
      <div className="flex items-center p-1.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-xs backdrop-blur-md w-full sm:w-auto gap-1.5 select-none">
        {/* Tab 1: Member Subscriptions & Dues */}
        <button
          type="button"
          onClick={() => onTabChange("paylist")}
          className={`group flex-1 sm:flex-initial flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
            activeTab === "paylist"
              ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/80 dark:border-slate-700/80 scale-[1.01]"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-800/50 border border-transparent"
          }`}
          aria-selected={activeTab === "paylist"}
          role="tab"
        >
          <div
            className={`p-1 rounded-lg transition-colors ${
              activeTab === "paylist"
                ? "bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400"
                : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
            }`}
          >
            <LuCreditCard className="w-4 h-4" />
          </div>

          <span>Member Subscriptions & Dues</span>

          {typeof membersCount === "number" && (
            <span
              className={`px-2 py-0.5 rounded-full text-xs transition-colors ${
                activeTab === "paylist"
                  ? "font-extrabold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60"
                  : "font-semibold bg-slate-200/70 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
              }`}
            >
              {membersCount}
            </span>
          )}
        </button>

        {/* Tab 2: All Payment Receipts & Invoices */}
        <button
          type="button"
          onClick={() => onTabChange("transactions")}
          className={`group flex-1 sm:flex-initial flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
            activeTab === "transactions"
              ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/80 dark:border-slate-700/80 scale-[1.01]"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-800/50 border border-transparent"
          }`}
          aria-selected={activeTab === "transactions"}
          role="tab"
        >
          <div
            className={`p-1 rounded-lg transition-colors ${
              activeTab === "transactions"
                ? "bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400"
                : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
            }`}
          >
            <LuReceipt className="w-4 h-4" />
          </div>

          <span>All Payment Receipts & Invoices</span>

          {typeof transactionsCount === "number" && (
            <span
              className={`px-2 py-0.5 rounded-full text-xs transition-colors ${
                activeTab === "transactions"
                  ? "font-extrabold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60"
                  : "font-semibold bg-slate-200/70 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
              }`}
            >
              {transactionsCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default MembershipPaylistTabs;
