import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  LuPlus,
  LuBadgeDollarSign,
  LuUser,
  LuCoins,
  LuTrash2,
  LuPencil,
  LuInfo,
  LuCheck,
  LuShieldAlert,
  LuX,
  LuHistory,
  LuUsers,
  LuArrowLeft
} from "react-icons/lu";
import useTrainerPayroll from "../hooks/useTrainerPayroll";
import Loader from "@/shared/components/ui/Loader";
import DataTable from "@/shared/components/ui/table/DataTable";
import TrainerPayoutModal from "../components/TrainerPayoutModal";

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

const initialFormState = (baseSalary = 0) => ({
  trainerID: "",
  month: "",
  totalAmount: baseSalary,
  paidAmount: baseSalary,
  pendingAmount: 0,
  paymentDate: new Date().toISOString().split("T")[0],
  paymentMethod: "Bank Transfer",
  status: "Paid",
  remarks: "",
});

const TrainerPayroll = () => {
  const navigate = useNavigate();
  const {
    trainers,
    isLoading,
    isSubmitting,
    addSalaryRecord,
    updateSalaryRecord,
    deleteSalaryRecord,
  } = useTrainerPayroll();

  const [activeTab, setActiveTab] = useState("instructors"); // "instructors" or "ledgers"
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null); // null means adding
  const [formData, setFormData] = useState(initialFormState(0));
  const [filterTrainerID, setFilterTrainerID] = useState(""); // filter ledgers for specific trainer

  const monthOptions = useMemo(() => getMonthOptions(), []);

  // Handle deep link via query parameters on load
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const trainerIDParam = queryParams.get("trainerID");
    if (trainerIDParam) {
      setFilterTrainerID(trainerIDParam);
      setActiveTab("ledgers");
      // Clean up URL parameters to keep it clean
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Flat list of all payouts across all trainers
  const allPayouts = useMemo(() => {
    return trainers.flatMap((t) =>
      (t.salaryHistory || []).map((record) => ({
        ...record,
        trainerName: t.name,
        trainerSpecialization: t.specialization,
      }))
    );
  }, [trainers]);

  // Aggregate KPI summary stats
  const summaryStats = useMemo(() => {
    const totalTrainers = trainers.length;
    let totalPaid = 0;
    let totalPending = 0;

    trainers.forEach((t) => {
      const tPending = (t.salaryHistory || []).reduce((sum, r) => sum + (r.pendingAmount || 0), 0);
      totalPending += tPending;
      (t.salaryHistory || []).forEach((record) => {
        totalPaid += record.paidAmount || 0;
      });
    });

    return { totalTrainers, totalPaid, totalPending };
  }, [trainers]);

  // Filtered trainers for Tab 1 search
  const filteredTrainers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return trainers;
    return trainers.filter(
      (t) =>
        t.name?.toLowerCase().includes(query) ||
        t.email?.toLowerCase().includes(query) ||
        t.specialization?.toLowerCase().includes(query)
    );
  }, [trainers, searchQuery]);

  // Filtered global ledger payouts for Tab 2 search/filter
  const filteredLedgers = useMemo(() => {
    let list = allPayouts;

    // Filter by trainer selection first
    if (filterTrainerID) {
      list = list.filter((item) => item.trainerID === filterTrainerID);
    }

    // Filter by search query
    const query = searchQuery.trim().toLowerCase();
    if (!query) return list;

    return list.filter(
      (item) =>
        item.trainerName?.toLowerCase().includes(query) ||
        item.month?.toLowerCase().includes(query) ||
        item.status?.toLowerCase().includes(query) ||
        item.paymentMethod?.toLowerCase().includes(query)
    );
  }, [allPayouts, searchQuery, filterTrainerID]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  // Open modal for Adding a new record
  const handleOpenAddModal = (rowTrainer = null) => {
    setEditingRecord(null);
    const targetTrainer = rowTrainer || trainers[0];
    const defaultMonth = monthOptions[12]; // current month
    setFormData({
      trainerID: targetTrainer ? targetTrainer.trainerID : "",
      month: defaultMonth,
      totalAmount: targetTrainer ? targetTrainer.salary : 0,
      paidAmount: targetTrainer ? targetTrainer.salary : 0,
      pendingAmount: 0,
      paymentDate: new Date().toISOString().split("T")[0],
      paymentMethod: "Bank Transfer",
      status: "Paid",
      remarks: "",
    });
    setIsModalOpen(true);
  };

  // Open modal for Editing an existing record
  const handleOpenEditModal = (record) => {
    setEditingRecord(record);
    setFormData({
      trainerID: record.trainerID,
      month: record.month || "",
      totalAmount: record.totalAmount ?? 0,
      paidAmount: record.paidAmount ?? 0,
      pendingAmount: record.pendingAmount ?? 0,
      paymentDate: record.paymentDate
        ? new Date(record.paymentDate).toISOString().split("T")[0]
        : "",
      paymentMethod: record.paymentMethod || "Bank Transfer",
      status: record.status || "Paid",
      remarks: record.remarks || "",
    });
    setIsModalOpen(true);
  };

  // Handle inputs dynamically inside modal
  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // If user selected a new trainer, auto-fill their base salary
      if (field === "trainerID") {
        const found = trainers.find((t) => t.trainerID === value);
        if (found) {
          updated.totalAmount = found.salary || 0;
          updated.paidAmount = found.salary || 0;
        }
      }

      // Auto-calculate pending balance & status
      if (field === "totalAmount" || field === "paidAmount" || field === "trainerID") {
        const total = parseFloat(updated.totalAmount) || 0;
        const paid = parseFloat(updated.paidAmount) || 0;
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

    const payload = {
      month: formData.month,
      totalAmount: parseFloat(formData.totalAmount) || 0,
      paidAmount: parseFloat(formData.paidAmount) || 0,
      pendingAmount: parseFloat(formData.pendingAmount) || 0,
      paymentDate: formData.paymentDate ? new Date(formData.paymentDate).toISOString() : null,
      paymentMethod: formData.paymentMethod,
      status: formData.status,
      remarks: formData.remarks,
    };

    let success = false;
    if (editingRecord) {
      success = await updateSalaryRecord(
        formData.trainerID,
        editingRecord.salaryID,
        payload
      );
    } else {
      success = await addSalaryRecord(formData.trainerID, payload);
    }

    if (success) {
      setIsModalOpen(false);
    }
  };

  // Tab 1 (Instructors Summary) Column Configuration
  const summaryColumns = [
    {
      header: "Trainer Name",
      accessor: "name",
      render: (row) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-slate-800 text-xs sm:text-sm">
            {row.name}
          </span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            {row.specialization || "General Coaching"}
          </span>
        </div>
      ),
    },
    {
      header: "Base Salary",
      accessor: "salary",
      render: (row) => (
        <span className="text-slate-600 font-semibold">
          ${row.salary?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      header: "Total Paid",
      render: (row) => {
        const total = (row.salaryHistory || []).reduce(
          (sum, r) => sum + (r.paidAmount || 0),
          0
        );
        return (
          <span className="text-emerald-600 font-bold">
            ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        );
      },
    },
    {
      header: "Outstanding Balance",
      render: (row) => {
        const pending = (row.salaryHistory || []).reduce((sum, r) => sum + (r.pendingAmount || 0), 0);
        return (
        <span
          className={`font-bold ${
            pending > 0 ? "text-rose-500" : "text-slate-400 font-semibold"
          }`}
        >
          ${pending.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </span>
      )},
    },
    {
      header: "Status",
      render: (row) => {
        const pending = (row.salaryHistory || []).reduce((sum, r) => sum + (r.pendingAmount || 0), 0);
        const paidCount = (row.salaryHistory || []).length;
        let label = "Fully Paid";
        let styles = "bg-green-50 text-green-700 border-green-200";

        if (pending > 0) {
          if (paidCount === 0) {
            label = "Unpaid";
            styles = "bg-red-50 text-red-700 border-red-200";
          } else {
            label = "Pending Dues";
            styles = "bg-amber-50 text-amber-700 border-amber-200";
          }
        } else if (paidCount === 0) {
          label = "No Records";
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
            title="Pay Trainer"
            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 cursor-pointer border border-emerald-100/50 hover:border-emerald-200"
          >
            <LuCoins className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setFilterTrainerID(row.trainerID);
              setActiveTab("ledgers");
            }}
            title="View History Ledger"
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
      header: "Trainer",
      accessor: "trainerName",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800 text-xs sm:text-sm">
            {row.trainerName}
          </span>
          <span className="text-[9px] text-slate-400 font-semibold block uppercase">
            {row.trainerSpecialization || "Coach"}
          </span>
        </div>
      ),
    },
    {
      header: "Month",
      accessor: "month",
      render: (row) => <span className="font-bold text-slate-700">{row.month}</span>,
    },
    {
      header: "Total",
      accessor: "totalAmount",
      render: (row) => (
        <span className="text-slate-600 font-semibold">
          ${row.totalAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      header: "Paid",
      accessor: "paidAmount",
      render: (row) => (
        <span className="text-emerald-600 font-bold">
          ${row.paidAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      header: "Pending",
      accessor: "pendingAmount",
      render: (row) => (
        <span
          className={`font-semibold ${
            row.pendingAmount > 0 ? "text-rose-500 font-bold" : "text-slate-400"
          }`}
        >
          ${row.pendingAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
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
        <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
          {row.paymentMethod || "Bank Transfer"}
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
            onClick={() => deleteSalaryRecord(row.trainerID, row.salaryID)}
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
    <button
      onClick={() => handleOpenAddModal(null)}
      className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-250 cursor-pointer"
    >
      <LuPlus className="w-3.5 h-3.5" />
      <span>Record Payout</span>
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 font-montserrat">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/trainer/list")}
          className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors duration-250 cursor-pointer shadow-xs"
        >
          <LuArrowLeft className="w-4 h-4 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold bg-linear-to-r from-slate-800 to-indigo-900 bg-clip-text text-transparent">
            Payroll Dashboard
          </h1>
          <p className="text-xs font-medium text-slate-500">
            Gym instructor payroll, transactions history, and accounts settlement logs.
          </p>
        </div>
      </div>

      {/* Aggregated Payout Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Total Trainers */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
            <LuUsers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Total Instructors
            </span>
            <h3 className="text-xl font-bold text-slate-800 mt-0.5">
              {summaryStats.totalTrainers}
            </h3>
            <span className="text-[11px] font-semibold text-indigo-500 flex items-center gap-0.5 mt-1">
              Active gym personnel
            </span>
          </div>
        </div>

        {/* Aggregate Paid */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
            <LuCoins className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Total Paid Out
            </span>
            <h3 className="text-xl font-bold text-slate-800 mt-0.5">
              ${summaryStats.totalPaid?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </h3>
            <span className="text-[11px] font-semibold text-emerald-500 flex items-center gap-0.5 mt-1">
              <LuCheck className="w-3.5 h-3.5" />
              Aggregated expenditures
            </span>
          </div>
        </div>

        {/* Aggregate Pending */}
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
              Total Outstanding Balance
            </span>
            <h3
              className={`text-xl font-bold mt-0.5 ${
                summaryStats.totalPending > 0 ? "text-rose-500 font-extrabold animate-pulse" : "text-slate-800"
              }`}
            >
              ${summaryStats.totalPending?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </h3>
            <span
              className={`text-[11px] font-semibold flex items-center gap-0.5 mt-1 ${
                summaryStats.totalPending > 0 ? "text-rose-500" : "text-slate-400"
              }`}
            >
              {summaryStats.totalPending > 0 ? (
                <>
                  <LuShieldAlert className="w-3.5 h-3.5" />
                  Payments due
                </>
              ) : (
                <>
                  <LuCheck className="w-3.5 h-3.5" />
                  All accounts settled
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
              setActiveTab("instructors");
              setSearchQuery("");
            }}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all duration-200 cursor-pointer ${
              activeTab === "instructors"
                ? "text-indigo-600 bg-white border-t-2 border-indigo-600 shadow-xs"
                : "text-slate-400 hover:text-slate-700 hover:bg-slate-100/50"
            }`}
          >
            Instructors Summary
          </button>
          <button
            onClick={() => {
              setActiveTab("ledgers");
              setSearchQuery("");
            }}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all duration-200 cursor-pointer ${
              activeTab === "ledgers"
                ? "text-indigo-600 bg-white border-t-2 border-indigo-600 shadow-xs"
                : "text-slate-400 hover:text-slate-700 hover:bg-slate-100/50"
            }`}
          >
            Payout Transactions Log
          </button>
        </div>

        {/* Ledger Filter Selector (Tab 2 only) */}
        {activeTab === "ledgers" && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              Filter Trainer:
            </span>
            <select
              value={filterTrainerID}
              onChange={(e) => setFilterTrainerID(e.target.value)}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-hidden focus:border-indigo-500 transition-colors cursor-pointer shadow-xs"
            >
              <option value="">All Trainers</option>
              {trainers.map((t) => (
                <option key={t.trainerID} value={t.trainerID}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Table Views */}
      {activeTab === "instructors" ? (
        <DataTable
          columns={summaryColumns}
          data={filteredTrainers}
          isLoading={isLoading}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search instructors by name, email or specialization..."
          actionButton={globalAddButton}
          containerClassName="max-h-[500px] overflow-y-auto"
        />
      ) : (
        <DataTable
          columns={ledgerColumns}
          data={filteredLedgers}
          isLoading={isLoading}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search payouts by month, status, payment method..."
          actionButton={globalAddButton}
          containerClassName="max-h-[500px] overflow-y-auto"
        />
      )}

      {/* Add / Edit Payout Modal */}
      <TrainerPayoutModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        isSubmitting={isSubmitting}
        editingRecord={editingRecord}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        trainers={trainers}
        monthOptions={monthOptions}
      />
    </div>
  );
};

export default TrainerPayroll;
