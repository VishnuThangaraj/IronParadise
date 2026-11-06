import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { GridColDef } from "@mui/x-data-grid";
import {
  LuCreditCard,
  LuCalendar,
  LuShieldCheck,
  LuArrowLeft,
  LuDollarSign,
  LuReceipt,
} from "react-icons/lu";

import PageHeader from "@/shared/components/ui/page/PageHeader";
import Container from "@/shared/components/ui/containers/Container";
import DataTable from "@/shared/components/ui/table/DataTable";
import Button from "@/shared/components/ui/buttons/Button";

import { useMemberSelfDetails } from "../hooks/use-member-self-details";
import { useMemberSelfPayments } from "../hooks/use-member-self-payments";
import type { MemberSelfReceiptItem } from "../types/member.types";

export const MemberMembershipView = () => {
  const navigate = useNavigate();

  const { data: detailsRes, isLoading: detailsLoading } = useMemberSelfDetails();
  const { data: paymentsRes, isLoading: paymentsLoading } = useMemberSelfPayments();

  const details = detailsRes?.data;
  const membershipPlan = details?.membershipPlan;
  const assignment = details?.assignment;

  const payments = useMemo(() => paymentsRes?.data?.payments ?? [], [paymentsRes?.data?.payments]);
  const receipts = useMemo(() => paymentsRes?.data?.receipts ?? [], [paymentsRes?.data?.receipts]);

  // Aggregate Payment Summary
  const summary = useMemo(() => {
    let totalPaid = 0;
    let totalDue = 0;
    let status = "PAID";

    if (payments.length > 0) {
      totalPaid = payments.reduce((acc, p) => acc + (p.amountPaid || 0), 0);
      totalDue = payments.reduce((acc, p) => acc + (p.amountDue || 0), 0);
      status = payments[0]?.paymentStatus || (totalDue > 0 ? "PARTIAL" : "PAID");
    }

    return { totalPaid, totalDue, status };
  }, [payments]);

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  };

  const getDaysRemaining = (endDate?: string | null) => {
    if (!endDate) return 0;
    const end = new Date(endDate);
    const now = new Date();
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  const daysRemaining = getDaysRemaining(assignment?.endDate);

  const columns: GridColDef<MemberSelfReceiptItem>[] = useMemo(
    () => [
      {
        field: "receiptNumber",
        headerName: "Receipt #",
        flex: 1.1,
        minWidth: 150,
        renderCell: (params) => (
          <span className="font-mono font-semibold text-xs text-indigo-600 dark:text-indigo-400">
            {params.row.receiptNumber || params.row._id?.slice(-8).toUpperCase()}
          </span>
        ),
      },
      {
        field: "paymentDate",
        headerName: "Payment Date",
        flex: 1.2,
        minWidth: 160,
        renderCell: (params) => (
          <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
            <LuCalendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatDate(params.row.paymentDate)}</span>
          </div>
        ),
      },
      {
        field: "amountPaid",
        headerName: "Amount Paid",
        flex: 1,
        minWidth: 130,
        renderCell: (params) => (
          <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400">
            ₹{params.row.amountPaid?.toLocaleString() || 0}
          </span>
        ),
      },
      {
        field: "paymentMethod",
        headerName: "Payment Method",
        flex: 1,
        minWidth: 130,
        renderCell: (params) => (
          <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {params.row.paymentMethod || "CASH"}
          </span>
        ),
      },
      {
        field: "transactionReference",
        headerName: "Reference / Note",
        flex: 1.3,
        minWidth: 160,
        renderCell: (params) => (
          <span className="text-xs text-slate-500 truncate">
            {params.row.transactionReference || params.row.notes || "Official Receipt"}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-6 w-full pb-10 animate-fadeIn">
      {/* Page Header */}
      <PageHeader
        title="My Membership & Payments"
        description="Review your active gym membership subscription, renewal dates, and payment receipts."
      >
        <Button
          onClick={() => navigate("/dashboard")}
          variant="secondary"
          size="sm"
          className="rounded-xl! font-semibold!"
        >
          <LuArrowLeft className="w-4 h-4 mr-1 text-slate-500" />
          Dashboard
        </Button>
      </PageHeader>

      {/* Active Membership Banner Card */}
      <Container
        variant="secondary"
        className="p-6! sm:p-8! rounded-3xl! border-indigo-200/60 dark:border-indigo-900/40 bg-linear-to-br from-indigo-50/20 to-transparent flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl shadow-md shrink-0">
            <LuShieldCheck />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
                {assignment?.status || "ACTIVE"}
              </span>
              <span className="text-xs text-slate-400">
                Plan ID: {membershipPlan?.planId || "MEM-001"}
              </span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {membershipPlan?.planName || membershipPlan?.name || "Standard Gym Membership"}
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Valid from {formatDate(assignment?.startDate)} through {formatDate(assignment?.endDate)}
            </p>
          </div>
        </div>

        {/* Days Remaining Pill */}
        <div className="flex flex-col items-start md:items-end gap-1 shrink-0 bg-white/70 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-400">Subscription Status</span>
          <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
            {daysRemaining} Days Left
          </span>
          <span className="text-[11px] text-slate-500">
            {daysRemaining <= 7 ? "⚠️ Renewal Due Soon" : "Active Subscription"}
          </span>
        </div>
      </Container>

      {/* Financial Status KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Container
          variant="secondary"
          className="p-5! rounded-2xl! border-emerald-100 dark:border-emerald-900/30 bg-linear-to-br from-emerald-500/5 to-transparent flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Amount Paid
            </p>
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              ₹{summary.totalPaid.toLocaleString()}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl">
            <LuDollarSign />
          </div>
        </Container>

        <Container
          variant="secondary"
          className="p-5! rounded-2xl! border-amber-100 dark:border-amber-900/30 bg-linear-to-br from-amber-500/5 to-transparent flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Outstanding Balance
            </p>
            <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
              ₹{summary.totalDue.toLocaleString()}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl">
            <LuCreditCard />
          </div>
        </Container>

        <Container
          variant="secondary"
          className="p-5! rounded-2xl! border-blue-100 dark:border-blue-900/30 bg-linear-to-br from-blue-500/5 to-transparent flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Payment Status
            </p>
            <h3 className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1 uppercase">
              {summary.status}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl">
            <LuReceipt />
          </div>
        </Container>
      </div>

      {/* Receipts Table */}
      <div className="flex flex-col gap-4">
        <h4 className="font-bold text-base text-slate-800 dark:text-white flex items-center gap-2">
          <LuReceipt className="w-5 h-5 text-indigo-500" />
          Payment Receipts & Invoices
        </h4>

        {paymentsLoading || detailsLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 rounded-full border-3 border-indigo-600 border-t-transparent animate-spin" />
            <span className="text-sm font-semibold text-slate-500">Loading payment receipts...</span>
          </div>
        ) : receipts.length === 0 ? (
          <Container
            variant="secondary"
            className="p-12 text-center rounded-3xl border-dashed border-2 border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-3"
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center text-2xl">
              <LuReceipt />
            </div>
            <h4 className="text-lg font-bold text-slate-800 dark:text-white">
              No Payment Receipts Found
            </h4>
            <p className="text-xs text-slate-500 max-w-sm">
              Your payment receipts will appear here once membership fees are recorded.
            </p>
          </Container>
        ) : (
          <Container variant="secondary" className="p-0! rounded-3xl! overflow-hidden shadow-sm">
            <DataTable
              rows={receipts}
              columns={columns}
              getRowId={(row) => row._id || row.receiptNumber}
              pageSize={10}
              height={450}
            />
          </Container>
        )}
      </div>
    </div>
  );
};

export default MemberMembershipView;
