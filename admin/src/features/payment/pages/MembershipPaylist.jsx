import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  LuPlus,
  LuBadgeDollarSign,
  LuCoins,
  LuTrash2,
  LuPencil,
  LuCheck,
  LuShieldAlert,
  LuHistory,
  LuUsers,
  LuArrowLeft,
} from "react-icons/lu";

import useMembershipPaylist from "../hooks/useMembershipPaylist";
import Loader from "@/shared/components/ui/Loader";
import DataTable from "@/shared/components/ui/table/DataTable";
import PaymentModal from "../components/PaymentModal";
import BulkInvoiceModal from "../components/BulkInvoiceModal";

// Generate month options (e.g. "June 2026")
const getMonthOptions = () => {
  const options = [];
  const currentDate = new Date();
  for (let i = -12; i <= 6; i++) {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
    const label = d.toLocaleString("en-US", { month: "long", year: "numeric" });
    options.push(label);
  }
  return options;
};

const initialFormState = () => ({
  memberId: "",
  membershipPlanId: "",
  month: "",
  totalAmount: 0,
  paidAmount: 0,
  pendingAmount: 0,
  paymentDate: new Date().toISOString().split("T")[0],
  paymentMethod: "UPI",
  status: "Paid",
  remarks: "",
});

const MembershipPaylist = () => {
  const navigate = useNavigate();
  const {
    members,
    membershipPlans,
    isLoading,
    isSubmitting,
    addPaymentRecord,
    updatePaymentRecord,
    deletePaymentRecord,
    bulkInvoiceMembers,
  } = useMembershipPaylist();

  const [activeTab, setActiveTab] = useState("membersSummary"); // "membersSummary" or "ledgers"
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null); // null means adding new
  const [formData, setFormData] = useState(initialFormState());
  const [filterMemberId, setFilterMemberId] = useState("");

  const monthOptions = useMemo(() => getMonthOptions(), []);

  // Flat list of all payment records across all members
  const allLedgers = useMemo(() => {
    return members.flatMap((m) =>
      (m.paymentHistory || []).map((record) => ({
        ...record,
        memberName: m.name,
        memberEmail: m.email,
        memberId: m.memberId,
      }))
    );
  }, [members]);

  // Aggregate KPI stats
  const summaryStats = useMemo(() => {
    const totalMembers = members.length;
    let totalPaid = 0;
    let totalPending = 0;

    members.forEach((m) => {
      totalPending += m.totalPendingAmount || 0;
      (m.paymentHistory || []).forEach((record) => {
        totalPaid += Number(record.paidAmount) || 0;
      });
    });

    return { totalMembers, totalPaid, totalPending };
  }, [members]);

  // Filtered members for Tab 1
  const filteredMembers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return members;
    return members.filter(
      (m) =>
        m.name?.toLowerCase().includes(query) ||
        m.email?.toLowerCase().includes(query) ||
        m.mobile?.toLowerCase().includes(query)
    );
  }, [members, searchQuery]);

  // Filtered global ledger for Tab 2
  const filteredLedgers = useMemo(() => {
    let list = allLedgers;

    if (filterMemberId) {
      list = list.filter((item) => item.memberId === filterMemberId);
    }

    const query = searchQuery.trim().toLowerCase();
    if (!query) return list;

    return list.filter(
      (item) =>
        item.memberName?.toLowerCase().includes(query) ||
        item.planName?.toLowerCase().includes(query) ||
        item.status?.toLowerCase().includes(query) ||
        item.paymentMethod?.toLowerCase().includes(query)
    );
  }, [allLedgers, searchQuery, filterMemberId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  // Open modal to add a record
  const handleOpenAddModal = (rowMember = null) => {
    setEditingRecord(null);
    const defaultMonth = monthOptions[12]; // current month

    setFormData({
      memberId: rowMember ? rowMember.memberId : "",
      membershipPlanId: "",
      month: defaultMonth,
      totalAmount: 0,
      paidAmount: 0,
      pendingAmount: 0,
      paymentDate: new Date().toISOString().split("T")[0],
      paymentMethod: "UPI",
      status: "Paid",
      remarks: "",
    });
    setIsModalOpen(true);
  };

  // Open modal to edit a record
  const handleOpenEditModal = (record) => {
    setEditingRecord(record);
    
    // Try to extract membership plan ID from plan name
    // e.g. "Gold Annual - June 2026"
    let planId = "";
    if (record.planName) {
      const parts = record.planName.split(" - ");
      const foundPlan = membershipPlans.find((p) => p.name === parts[0]);
      if (foundPlan) planId = foundPlan.membershipId;
    }

    // Try to parse month
    let monthVal = monthOptions[12];
    if (record.planName && record.planName.includes(" - ")) {
      monthVal = record.planName.split(" - ")[1] || monthVal;
    }

    setFormData({
      memberId: record.memberId,
      membershipPlanId: planId,
      month: monthVal,
      totalAmount: record.totalAmount ?? 0,
      paidAmount: record.paidAmount ?? 0,
      pendingAmount: record.pendingAmount ?? 0,
      paymentDate: record.paymentDate
        ? new Date(record.paymentDate).toISOString().split("T")[0]
        : "",
      paymentMethod: record.paymentMethod || "UPI",
      status: record.status || "Paid",
      remarks: record.remarks || "",
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Autofill price if membership plan selected
      if (field === "membershipPlanId") {
        const found = membershipPlans.find((p) => p.membershipId === value);
        if (found) {
          updated.totalAmount = found.amount || 0;
          updated.paidAmount = found.amount || 0;
        }
      }

      // Recalculate pending & status
      if (field === "totalAmount" || field === "paidAmount" || field === "membershipPlanId") {
        const total = parseFloat(updated.totalAmount) || 0;
        let paid = parseFloat(updated.paidAmount) || 0;

        if (paid > total) {
          paid = total;
          updated.paidAmount = paid;
        }

        const pending = Math.max(0, total - paid);
        updated.pendingAmount = pending;

        if (paid >= total) {
          updated.status = "Paid";
        } else if (paid === 0) {
          updated.status = "Unpaid";
        } else {
          updated.status = "Partially Paid";
        }
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const planObj = membershipPlans.find((p) => p.membershipId === formData.membershipPlanId);
    const planTitle = planObj
      ? `${planObj.name} - ${formData.month}`
      : `Membership billing - ${formData.month}`;

    const payload = {
      planName: planTitle,
      totalAmount: parseFloat(formData.totalAmount) || 0,
      paidAmount: parseFloat(formData.paidAmount) || 0,
      pendingAmount: parseFloat(formData.pendingAmount) || 0,
      paymentDate: formData.paymentDate
        ? new Date(formData.paymentDate).toISOString()
        : null,
      paymentMethod: formData.paymentMethod,
      status: formData.status,
      remarks: formData.remarks,
    };

    const success = editingRecord
      ? await updatePaymentRecord(formData.memberId, editingRecord.paymentID, payload)
      : await addPaymentRecord(formData.memberId, payload);

    if (success) {
      setIsModalOpen(false);
    }
  };

  const handleSubmitBulk = async (bulkFormData) => {
    const payload = {
      month: bulkFormData.month,
      paymentDate: bulkFormData.paymentDate
        ? new Date(bulkFormData.paymentDate).toISOString()
        : null,
      paymentMethod: bulkFormData.paymentMethod,
      remarks: bulkFormData.remarks,
    };
    const success = await bulkInvoiceMembers(payload);
    if (success) {
      setIsBulkModalOpen(false);
    }
  };

  // Tab 1 (Members Summary) Column Configuration
  const summaryColumns = [
    {
      header: "Member Name",
      accessor: "name",
      render: (row) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-slate-800 text-xs sm:text-sm">
            {row.name}
          </span>
          <span className="text-[10px] text-slate-400 font-medium leading-none">
            {row.email}
          </span>
        </div>
      ),
    },
    {
      header: "Total Paid",
      render: (row) => {
        const total = (row.paymentHistory || []).reduce(
          (sum, r) => sum + (r.paidAmount || 0),
          0
        );
        return (
          <span className="text-emerald-600 font-bold">
            ₹{total.toLocaleString()}
          </span>
        );
      },
    },
    {
      header: "Outstanding Dues",
      render: (row) => {
        const pending = row.totalPendingAmount || 0;
        return (
          <span
            className={`font-bold ${
              pending > 0 ? "text-rose-500 font-bold animate-pulse-subtle" : "text-slate-400 font-semibold"
            }`}
          >
            ₹{pending.toLocaleString()}
          </span>
        );
      },
    },
    {
      header: "Status",
      render: (row) => {
        const pending = row.totalPendingAmount || 0;
        const payments = (row.paymentHistory || []).length;
        let label = "Paid & Settled";
        let styles = "bg-green-50 text-green-700 border-green-200";

        if (pending > 0) {
          if (payments === 0) {
            label = "Unpaid";
            styles = "bg-red-50 text-red-700 border-red-200";
          } else {
            label = "Pending Balance";
            styles = "bg-amber-50 text-amber-700 border-amber-200";
          }
        } else if (payments === 0) {
          label = "No invoices";
          styles = "bg-slate-50 text-slate-500 border-slate-200";
        }

        return (
          <span
            className={`text-[9px] font-bold border px-2.5 py-0.5 rounded-full uppercase tracking-wider ${styles}`}
          >
            {label}
          </span>
        );
      },
    },
    {
      header: "Actions",
      className: "w-28 text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleOpenAddModal(row)}
            title="Record Payment"
            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 cursor-pointer border border-emerald-100/50 hover:border-emerald-200"
          >
            <LuCoins className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setFilterMemberId(row.memberId);
              setActiveTab("ledgers");
            }}
            title="View Payment History Ledger"
            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 cursor-pointer border border-indigo-100/50 hover:border-indigo-200"
          >
            <LuHistory className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  // Tab 2 (Global Payout Ledgers) Column Configuration
  const ledgerColumns = [
    {
      header: "Member",
      accessor: "memberName",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800 text-xs sm:text-sm">
            {row.memberName}
          </span>
          <span className="text-[9px] text-slate-400 font-semibold block leading-none">
            {row.memberEmail}
          </span>
        </div>
      ),
    },
    {
      header: "Billing plan / month",
      accessor: "planName",
      render: (row) => (
        <span className="font-bold text-slate-700">{row.planName}</span>
      ),
    },
    {
      header: "Bill (₹)",
      accessor: "totalAmount",
      render: (row) => (
        <span className="text-slate-600 font-semibold">
          ₹{row.totalAmount?.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Paid (₹)",
      accessor: "paidAmount",
      render: (row) => (
        <span className="text-emerald-600 font-bold">
          ₹{row.paidAmount?.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Pending (₹)",
      render: (row) => {
        const pending = Math.max(0, (row.totalAmount || 0) - (row.paidAmount || 0));
        return (
          <span
            className={`font-semibold ${
              pending > 0 ? "text-rose-500 font-bold" : "text-slate-400"
            }`}
          >
            ₹{pending.toLocaleString()}
          </span>
        );
      },
    },
    {
      header: "Payment Date",
      accessor: "paymentDate",
      render: (row) => (
        <span className="text-slate-500 font-medium text-[11px]">
          {row.paymentDate ? format(new Date(row.paymentDate), "MMM dd, yyyy") : "N/A"}
        </span>
      ),
    },
    {
      header: "Method",
      accessor: "paymentMethod",
      render: (row) => (
        <span className="text-[10px] font-semibold text-slate-600 bg-slate-105 border border-slate-200 px-2 py-0.5 rounded-md">
          {row.paymentMethod || "UPI"}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => {
        let styles = "bg-green-50 text-green-700 border-green-200";
        if (row.status === "Partially Paid") {
          styles = "bg-amber-50 text-amber-700 border-amber-200";
        } else if (row.status === "Unpaid") {
          styles = "bg-red-50 text-red-700 border-red-200";
        }
        return (
          <span
            className={`text-[9px] font-bold border px-2 py-0.5 rounded-full uppercase tracking-wider ${styles}`}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      header: "Actions",
      className: "w-24 text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleOpenEditModal(row)}
            title="Edit Record"
            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200 cursor-pointer"
          >
            <LuPencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => deletePaymentRecord(row.memberId, row.paymentID)}
            title="Delete Record"
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer"
          >
            <LuTrash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const globalAddButton = (
    <div className="flex items-center gap-2 font-montserrat">
      <button
        onClick={() => setIsBulkModalOpen(true)}
        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-250 cursor-pointer"
      >
        <LuCoins className="w-3.5 h-3.5" />
        <span>Bulk Invoice</span>
      </button>
      <button
        onClick={() => handleOpenAddModal(null)}
        className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-250 cursor-pointer"
      >
        <LuPlus className="w-3.5 h-3.5" />
        <span>Record payment</span>
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 font-montserrat">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/member/list")}
          className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors duration-250 cursor-pointer shadow-xs"
        >
          <LuArrowLeft className="w-4 h-4 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold bg-linear-to-r from-slate-800 to-indigo-900 bg-clip-text text-transparent">
            Membership Payments Dashboard
          </h1>
          <p className="text-xs font-medium text-slate-500">
            Track member invoicing, dues tracking, payment processing, and billing ledgers.
          </p>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Total Members */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
            <LuUsers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Total Members
            </span>
            <h3 className="text-xl font-bold text-slate-800 mt-0.5">
              {summaryStats.totalMembers}
            </h3>
            <span className="text-[11px] font-semibold text-indigo-500 flex items-center gap-0.5 mt-1">
              Registered center accounts
            </span>
          </div>
        </div>

        {/* Total Paid / Collected */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
            <LuCoins className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Total Revenue Collected
            </span>
            <h3 className="text-xl font-bold text-slate-800 mt-0.5">
              ₹{summaryStats.totalPaid?.toLocaleString()}
            </h3>
            <span className="text-[11px] font-semibold text-emerald-500 flex items-center gap-0.5 mt-1">
              <LuCheck className="w-3.5 h-3.5" />
              Aggregated member deposits
            </span>
          </div>
        </div>

        {/* Total Pending / Dues */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
              summaryStats.totalPending > 0
                ? "bg-rose-50 border-rose-100 text-rose-600"
                : "bg-slate-50 border-slate-100 text-slate-400"
            }`}
          >
            <LuBadgeDollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Total Dues / Outstanding
            </span>
            <h3
              className={`text-xl font-bold mt-0.5 ${
                summaryStats.totalPending > 0
                  ? "text-rose-500 font-extrabold animate-pulse-subtle"
                  : "text-slate-800"
              }`}
            >
              ₹{summaryStats.totalPending?.toLocaleString()}
            </h3>
            <span
              className={`text-[11px] font-semibold flex items-center gap-0.5 mt-1 ${
                summaryStats.totalPending > 0 ? "text-rose-500" : "text-slate-400"
              }`}
            >
              {summaryStats.totalPending > 0 ? (
                <>
                  <LuShieldAlert className="w-3.5 h-3.5" />
                  Payments outstanding
                </>
              ) : (
                <>
                  <LuCheck className="w-3.5 h-3.5" />
                  All dues fully cleared
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Tab Control Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-250 pb-px gap-4">
        {/* Navigation Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              setActiveTab("membersSummary");
              setSearchQuery("");
              setFilterMemberId("");
            }}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all duration-200 cursor-pointer ${
              activeTab === "membersSummary" && !filterMemberId
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-505 hover:text-slate-700"
            }`}
          >
            Members Billing
          </button>
          <button
            onClick={() => {
              setActiveTab("ledgers");
              setSearchQuery("");
            }}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all duration-200 cursor-pointer ${
              activeTab === "ledgers"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-505 hover:text-slate-700"
            }`}
          >
            Transactions Ledger {filterMemberId ? "(Filtered)" : ""}
          </button>
        </div>

        {/* Clear filter helper button */}
        {filterMemberId && (
          <button
            onClick={() => setFilterMemberId("")}
            className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded-lg ml-2 cursor-pointer hover:bg-indigo-100"
          >
            Show All Members History
          </button>
        )}
      </div>

      {/* Main Table rendering */}
      {activeTab === "membersSummary" ? (
        <DataTable
          columns={summaryColumns}
          data={filteredMembers}
          isLoading={false}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search active billing by member name or email..."
          actionButton={globalAddButton}
          containerClassName="max-h-[460px] overflow-y-auto bg-white rounded-2xl border border-slate-200"
        />
      ) : (
        <DataTable
          columns={ledgerColumns}
          data={filteredLedgers}
          isLoading={false}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search transaction Ref, member name, plan, or method..."
          actionButton={globalAddButton}
          containerClassName="max-h-[460px] overflow-y-auto bg-white rounded-2xl border border-slate-200"
        />
      )}

      {/* PAYMENT MODAL */}
      <PaymentModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        isSubmitting={isSubmitting}
        editingRecord={editingRecord}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        members={members}
        membershipPlans={membershipPlans}
        monthOptions={monthOptions}
      />

      {/* BULK INVOICE MODAL */}
      <BulkInvoiceModal
        isModalOpen={isBulkModalOpen}
        setIsModalOpen={setIsBulkModalOpen}
        isSubmitting={isSubmitting}
        handleSubmitBulk={handleSubmitBulk}
        monthOptions={monthOptions}
      />
    </div>
  );
};

export default MembershipPaylist;
