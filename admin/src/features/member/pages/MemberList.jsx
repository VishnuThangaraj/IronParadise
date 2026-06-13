import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LuPlus, 
  LuTrash2, 
  LuEye, 
  LuPencil,
  LuLayoutGrid,
  LuList,
  LuSearch,
  LuInbox,
  LuUser,
  LuMail,
  LuPhone,
  LuCalendar
} from "react-icons/lu";

import useMemberList from "../hooks/useMemberList";
import DataTable from "@/shared/components/ui/table/DataTable";

const MemberList = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid");
  const { members, isLoading, searchQuery, setSearchQuery, deleteMember } =
    useMemberList();

  const columns = [
    {
      header: "Member Name",
      accessor: "name",
      render: (row) => {
        const initials = row.name ? row.name.split(" ").map(n => n[0]).join("").toUpperCase() : "M";
        const gradientIndex = (row.name?.charCodeAt(0) || 0) % 4;
        const gradients = [
          "from-indigo-500 to-purple-600",
          "from-rose-500 to-orange-500",
          "from-emerald-500 to-teal-600",
          "from-blue-500 to-cyan-600"
        ];
        const activeGradient = gradients[gradientIndex];
        return (
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${activeGradient} flex items-center justify-center text-white text-[11px] font-bold shadow-xs`}>
              {initials}
            </div>
            <div className="flex flex-col gap-0.5 font-montserrat">
              <span className="font-bold text-slate-800 text-xs sm:text-sm">
                {row.name}
              </span>
              <span className="sm:hidden font-medium text-[10px] text-slate-400">
                Joined:{" "}
                {row.joinDate ? new Date(row.joinDate).toLocaleDateString() : "N/A"}
              </span>
            </div>
          </div>
        );
      }
    },
    {
      header: "Email",
      accessor: "email",
      className: "hidden md:table-cell font-montserrat",
      render: (row) => (
        <div className="flex items-center gap-1.5 font-medium text-[11px] text-slate-500">
          <LuMail className="w-3.5 h-3.5 text-slate-400" />
          <span>{row.email}</span>
        </div>
      ),
    },
    {
      header: "Mobile",
      accessor: "mobile",
      className: "hidden sm:table-cell font-montserrat",
      render: (row) => (
        <div className="flex items-center gap-1.5 font-medium text-[11px] text-slate-500">
          <LuPhone className="w-3.5 h-3.5 text-slate-400" />
          <span>{row.mobile}</span>
        </div>
      ),
    },
    {
      header: "Gender",
      accessor: "gender",
      className: "hidden md:table-cell font-montserrat",
      render: (row) => (
        <span className="bg-indigo-50/70 px-2.5 py-0.5 border border-indigo-100 rounded-md font-bold text-[10px] text-indigo-600 uppercase tracking-wider">
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
          <div className="flex justify-end items-center gap-2 font-montserrat">
            <button
              onClick={() => navigate(`/member/details/${id}`)}
              title="View Details"
              className="hover:bg-indigo-50 p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 transition-all duration-200 cursor-pointer"
            >
              <LuEye className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate(`/member/edit/${id}`)}
              title="Edit Member"
              className="hover:bg-amber-50 p-1.5 rounded-lg text-slate-400 hover:text-amber-600 transition-all duration-200 cursor-pointer"
            >
              <LuPencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => deleteMember(id)}
              title="Delete Member"
              className="hover:bg-red-50 p-1.5 rounded-lg text-slate-400 hover:text-red-500 transition-all duration-200 cursor-pointer"
            >
              <LuTrash2 className="w-4 h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 mx-auto pb-12 max-w-6xl font-montserrat">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="bg-clip-text bg-linear-to-r from-slate-800 to-indigo-900 font-bold text-transparent text-2xl">
          Members
        </h1>
        <p className="font-medium text-slate-500 text-xs">
          Manage your fitness center members, profiles, plans, and measurement logs.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in font-montserrat">
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <LuSearch className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search members by name, email or mobile..."
            className="w-full pl-10 pr-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-3 ml-auto sm:ml-0">
          {/* View Mode Toggle */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/80">
            <button
              onClick={() => setViewMode("grid")}
              title="Grid View"
              className={`p-1.5 rounded-md transition-all duration-200 cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white text-indigo-600 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <LuLayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              title="List View"
              className={`p-1.5 rounded-md transition-all duration-200 cursor-pointer ${
                viewMode === "list"
                  ? "bg-white text-indigo-600 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <LuList className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add Member Button */}
          <button
            onClick={() => navigate("/member/add")}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg px-4 py-2 rounded-xl font-bold text-white text-xs transition-all duration-250 cursor-pointer"
          >
            <LuPlus className="w-3.5 h-3.5" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === "grid" ? (
        isLoading ? (
          // Grid Loading Skeleton State
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 animate-pulse" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3.5 bg-slate-100 rounded-md w-3/4 animate-pulse" />
                    <div className="h-2.5 bg-slate-100 rounded-md w-1/2 animate-pulse" />
                  </div>
                </div>
                <div className="h-3 bg-slate-100 rounded-md w-full animate-pulse" />
                <div className="h-3 bg-slate-100 rounded-md w-5/6 animate-pulse" />
                <div className="flex gap-2 pt-3 border-t border-slate-50">
                  <div className="h-8 bg-slate-100 rounded-lg flex-1 animate-pulse" />
                  <div className="h-8 bg-slate-100 rounded-lg w-10 animate-pulse" />
                  <div className="h-8 bg-slate-100 rounded-lg w-10 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : members.length === 0 ? (
          // Empty State
          <div className="border border-dashed border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
              <LuInbox className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-700">No Members Found</h4>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                Try adjusting your search criteria or add new members.
              </p>
            </div>
          </div>
        ) : (
          // Grid Cards Render
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {members.map((member) => {
              const initials = member.name ? member.name.split(" ").map(n => n[0]).join("").toUpperCase() : "M";
              const gradientIndex = (member.name?.charCodeAt(0) || 0) % 4;
              const gradients = [
                "from-indigo-500 to-purple-600 shadow-indigo-100/70",
                "from-rose-500 to-orange-500 shadow-rose-100/70",
                "from-emerald-500 to-teal-600 shadow-emerald-100/70",
                "from-blue-500 to-cyan-600 shadow-blue-100/70"
              ];
              const activeGradient = gradients[gradientIndex];
              const active = member.isActive !== false;

              return (
                <div 
                  key={member.memberId} 
                  className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-lg shadow-slate-100 hover:shadow-xl hover:shadow-indigo-100/20 hover:-translate-y-1 hover:border-indigo-100/50 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Top block */}
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${activeGradient} flex items-center justify-center text-white font-bold text-base shadow-md`}>
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                          {member.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-0.5">
                          <LuCalendar className="w-3 h-3 text-slate-400" />
                          <span className="text-[10px] text-slate-400 font-semibold">Joined: {member.joinDate ? new Date(member.joinDate).toLocaleDateString() : "N/A"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      <span
                        className={`text-[9px] font-bold px-2.5 py-0.5 rounded-md border uppercase tracking-wider ${
                          active
                            ? "text-emerald-700 bg-emerald-50 border-emerald-150"
                            : "text-slate-500 bg-slate-50 border-slate-150"
                        }`}
                      >
                        {active ? "Active" : "Inactive"}
                      </span>
                      <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                        {member.gender || "Male"}
                      </span>
                    </div>

                    {/* Detailed info */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-50">
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold">
                        <LuMail className="w-3.5 h-3.5 text-slate-400 animate-pulse" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold">
                        <LuPhone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{member.mobile}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="flex gap-2 mt-5 pt-3 border-t border-slate-50">
                    <button
                      onClick={() => navigate(`/member/details/${member.memberId}`)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-[10px] font-bold rounded-lg border border-slate-100 hover:border-indigo-100 transition-all duration-200 cursor-pointer"
                    >
                      <LuEye className="w-3.5 h-3.5" />
                      <span>View Profile</span>
                    </button>
                    <button
                      onClick={() => navigate(`/member/edit/${member.memberId}`)}
                      title="Edit Member"
                      className="p-1.5 bg-slate-50 hover:bg-amber-50 text-slate-400 hover:text-amber-600 border border-slate-100 hover:border-amber-100 rounded-lg transition-all duration-200 cursor-pointer"
                    >
                      <LuPencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteMember(member.memberId)}
                      title="Delete Member"
                      className="p-1.5 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-500 border border-slate-100 hover:border-red-155 rounded-lg transition-all duration-200 cursor-pointer"
                    >
                      <LuTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        // List Mode View using custom styled DataTable
        <DataTable
          columns={columns}
          data={members}
          isLoading={isLoading}
          containerClassName="max-h-[460px] overflow-y-auto"
        />
      )}
    </div>
  );
};

export default MemberList;

