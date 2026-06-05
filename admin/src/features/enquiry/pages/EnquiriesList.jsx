import { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { motion } from "motion/react";
import { 
  LuSearch, 
  LuEye,
  LuReply,
  LuMessageSquare,
  LuInbox
} from "react-icons/lu";
import { FiCheckCircle, FiClock } from "react-icons/fi";

import api from "@/service/api";
import { selectToken } from "@/features/auth/redux/authSelector";
import { fadeUp } from "@/shared/animations";
import DataTable from "@/shared/components/ui/table/DataTable";
import EnquiryReplyModal from "../components/EnquiryReplyModal";

const EnquiriesList = () => {
  const token = useSelector(selectToken);
  const [enquiries, setEnquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'pending', 'replied'
  
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEnquiries = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await api.get("enquiry/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEnquiries(res.data || []);
    } catch (err) {
      console.error("Failed to load enquiries", err);
      toast.error("Failed to load enquiries data");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const filteredEnquiries = useMemo(() => {
    let result = enquiries;
    
    // Status Filter
    if (statusFilter !== "all") {
      result = result.filter(e => e.status === statusFilter);
    }

    // Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        e =>
          e.name.toLowerCase().includes(query) ||
          e.email.toLowerCase().includes(query) ||
          e.subject.toLowerCase().includes(query) ||
          (e.enquiryId && e.enquiryId.toLowerCase().includes(query))
      );
    }
    
    return result;
  }, [enquiries, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: enquiries.length,
      pending: enquiries.filter(e => e.status === "pending").length,
      replied: enquiries.filter(e => e.status === "replied").length,
    };
  }, [enquiries]);

  const openModal = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEnquiry(null);
    setIsModalOpen(false);
  };

  // Fixed Column definition to match DataTable expectations
  const columns = [
    {
      accessor: "enquiryId",
      header: "ID",
      render: (row) => (
        <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
          {row.enquiryId || "N/A"}
        </span>
      ),
    },
    {
      accessor: "name",
      header: "User Details",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800">{row.name}</span>
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-0.5">
            {row.userType}
          </span>
        </div>
      ),
    },
    {
      accessor: "subject",
      header: "Subject",
      render: (row) => (
        <span className="text-sm font-semibold text-slate-600 line-clamp-1 max-w-[200px]">
          {row.subject}
        </span>
      ),
    },
    {
      accessor: "createdAt",
      header: "Date",
      render: (row) => {
        const date = new Date(row.createdAt);
        return (
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-700">
              {date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold tracking-wider">
              {date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        );
      },
    },
    {
      accessor: "status",
      header: "Status",
      render: (row) => {
        if (row.status === "replied") {
          return (
            <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 w-max">
              <FiCheckCircle className="w-3 h-3" />
              Replied
            </span>
          );
        }
        return (
          <span className="bg-amber-100 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-max shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Pending
          </span>
        );
      },
    },
    {
      accessor: "actions",
      header: "Actions",
      render: (row) => {
        const isReplied = row.status === "replied";
        return (
          <button
            onClick={() => openModal(row)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              isReplied 
                ? "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200 hover:text-slate-700" 
                : "bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-600 hover:text-white shadow-sm"
            }`}
          >
            {isReplied ? (
              <>
                <LuEye className="w-3.5 h-3.5" />
                View
              </>
            ) : (
              <>
                <LuReply className="w-3.5 h-3.5" />
                Reply
              </>
            )}
          </button>
        );
      },
    },
  ];

  return (
    <motion.div {...fadeUp} className="max-w-7xl mx-auto space-y-6 pb-12 font-montserrat">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <LuMessageSquare className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold bg-linear-to-r from-slate-800 to-indigo-900 bg-clip-text text-transparent">
              Enquiries Manager
            </h1>
            <p className="text-xs font-medium text-slate-500">
              Review incoming enquiries and send replies seamlessly.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <LuInbox className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800">{stats.total}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Enquiries</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow relative overflow-hidden">
          {stats.pending > 0 && (
            <div className="absolute top-0 right-0 w-1.5 h-full bg-amber-500"></div>
          )}
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <FiClock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800">{stats.pending}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Reply</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FiCheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-800">{stats.replied}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Replied</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col p-6">
        
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          {/* Status Filter Tabs */}
          <div className="flex p-1 bg-slate-100/80 backdrop-blur-sm rounded-xl w-max border border-slate-200/50">
            {["all", "pending", "replied"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all duration-200 ${
                  statusFilter === status
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-sm"
            />
          </div>
        </div>

        {/* Data Table */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 text-sm font-semibold animate-pulse">Loading enquiries...</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar -mx-2 px-2">
            <DataTable
              data={filteredEnquiries}
              columns={columns}
              containerClassName="!shadow-none !border-none !rounded-none"
            />
          </div>
        )}
      </div>

      {/* Reply Modal */}
      <EnquiryReplyModal
        isOpen={isModalOpen}
        onClose={closeModal}
        enquiry={selectedEnquiry}
        onReplySuccess={fetchEnquiries}
      />
    </motion.div>
  );
};

export default EnquiriesList;
