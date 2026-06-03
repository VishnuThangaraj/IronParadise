import { useNavigate } from "react-router-dom";
import { LuPlus, LuTrash2, LuEye, LuPencil } from "react-icons/lu";

import useMembershipPlanList from "../hooks/useMembershipPlanList";
import DataTable from "@/shared/components/ui/table/DataTable";

const MembershipPlanList = () => {
  const navigate = useNavigate();
  const { plans, isLoading, searchQuery, setSearchQuery, deletePlan } =
    useMembershipPlanList();

  const columns = [
    {
      header: "Plan Name",
      accessor: "name",
      render: (row) => (
        <span className="font-bold text-slate-800 text-xs sm:text-sm">
          {row.name}
        </span>
      ),
    },
    {
      header: "Duration",
      accessor: "duration",
      className: "hidden md:table-cell",
      render: (row) => (
        <span className="text-slate-500 font-medium text-xs">
          {row.duration}
        </span>
      ),
    },
    {
      header: "Amount",
      accessor: "amount",
      className: "hidden sm:table-cell",
      render: (row) => (
        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50/70 border border-emerald-100 px-2.5 py-0.5 rounded-md tracking-wider">
          ₹ {row.amount?.toLocaleString("en-IN") || 0}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      className: "hidden md:table-cell",
      render: (row) => (
        <span
          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
            row.status === "Active"
              ? "text-indigo-600 bg-indigo-50 border border-indigo-100"
              : "text-slate-500 bg-slate-50 border border-slate-200"
          }`}
        >
          {row.status || "Inactive"}
        </span>
      ),
    },
    {
      header: "Actions",
      className: "w-28 text-right",
      render: (row) => {
        const id = row.membershipId;
        return (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => navigate(`/membership/details/${id}`)}
              title="View Details"
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 cursor-pointer"
            >
              <LuEye className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate(`/membership/edit/${id}`)}
              title="Edit Plan"
              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200 cursor-pointer"
            >
              <LuPencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => deletePlan(id)}
              title="Delete Plan"
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer"
            >
              <LuTrash2 className="w-4 h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  const addButton = (
    <button
      onClick={() => navigate("/membership/add")}
      className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-250 cursor-pointer animate-fade-in"
    >
      <LuPlus className="w-3.5 h-3.5" />
      <span>Add Plan</span>
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 font-montserrat">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold bg-linear-to-r from-slate-800 to-indigo-900 bg-clip-text text-transparent">
          Membership Plans
        </h1>
        <p className="text-xs font-medium text-slate-500">
          Manage your gym's membership and subscription plans.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={plans}
        isLoading={isLoading}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search plans by name or duration..."
        actionButton={addButton}
        containerClassName="max-h-[460px] overflow-y-auto"
      />
    </div>
  );
};

export default MembershipPlanList;
