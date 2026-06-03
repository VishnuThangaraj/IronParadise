import { useNavigate } from "react-router-dom";
import { LuPlus, LuTrash2, LuEye, LuPencil, LuDatabase } from "react-icons/lu";

import useMemberList from "../hooks/useMemberList";
import DataTable from "@/shared/components/ui/table/DataTable";

const MemberList = () => {
  const navigate = useNavigate();
  const {
    members,
    isLoading,
    searchQuery,
    setSearchQuery,
    deleteMember,
    populateMembers,
  } = useMemberList();

  const columns = [
    {
      header: "Member Name",
      accessor: "name",
      render: (row) => (
        <div className="flex flex-col gap-0.5 font-montserrat">
          <span className="font-bold text-slate-800 text-xs sm:text-sm">
            {row.name}
          </span>
          <span className="text-[10px] text-slate-400 font-medium sm:hidden">
            Joined: {row.joinDate ? new Date(row.joinDate).toLocaleDateString() : "N/A"}
          </span>
        </div>
      ),
    },
    {
      header: "Email",
      accessor: "email",
      className: "hidden md:table-cell font-montserrat",
      render: (row) => (
        <span className="text-slate-500 font-medium text-[11px]">
          {row.email}
        </span>
      ),
    },
    {
      header: "Mobile",
      accessor: "mobile",
      className: "hidden sm:table-cell font-montserrat",
      render: (row) => (
        <span className="text-slate-500 font-medium text-[11px]">
          {row.mobile}
        </span>
      ),
    },
    {
      header: "Gender",
      accessor: "gender",
      className: "hidden md:table-cell font-montserrat",
      render: (row) => (
        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50/70 border border-indigo-100 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
          {row.gender || "Male"}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "isActive",
      render: (row) => {
        const active = row.isActive !== false;
        return (
          <span
            className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${
              active
                ? "text-emerald-700 bg-emerald-50 border-emerald-150"
                : "text-slate-500 bg-slate-50 border-slate-150"
            }`}
          >
            {active ? "Active" : "Inactive"}
          </span>
        );
      },
    },
    {
      header: "Actions",
      className: "w-28 text-right",
      render: (row) => {
        const id = row.memberId;
        return (
          <div className="flex items-center justify-end gap-2 font-montserrat">
            <button
              onClick={() => navigate(`/member/details/${id}`)}
              title="View Details"
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 cursor-pointer"
            >
              <LuEye className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate(`/member/edit/${id}`)}
              title="Edit Member"
              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200 cursor-pointer"
            >
              <LuPencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => deleteMember(id)}
              title="Delete Member"
              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer"
            >
              <LuTrash2 className="w-4 h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  const actionButtons = (
    <div className="flex items-center gap-2 animate-fade-in font-montserrat">
      <button
        onClick={populateMembers}
        title="Populate Seed Data"
        className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all duration-250 cursor-pointer"
      >
        <LuDatabase className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Populate Members</span>
      </button>
      <button
        onClick={() => navigate("/member/add")}
        className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-250 cursor-pointer"
      >
        <LuPlus className="w-3.5 h-3.5" />
        <span>Add Member</span>
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 font-montserrat">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold bg-linear-to-r from-slate-800 to-indigo-900 bg-clip-text text-transparent">
          Members
        </h1>
        <p className="text-xs font-medium text-slate-500">
          Manage your fitness center members, profiles, plans, and measurement logs.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={members}
        isLoading={isLoading}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search members by name, email or mobile..."
        actionButton={actionButtons}
        containerClassName="max-h-[460px] overflow-y-auto"
      />
    </div>
  );
};

export default MemberList;
