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
  LuUtensils,
  LuTarget
} from "react-icons/lu";

import useDietPlanList from "../hooks/useDietPlanList";
import DataTable from "@/shared/components/ui/table/DataTable";

const DietPlanList = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid");
  const { dietPlans, isLoading, searchQuery, setSearchQuery, deletePlan } =
    useDietPlanList();

  const columns = [
    {
      header: "Plan Name",
      accessor: "name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-linear-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-xs">
            <LuUtensils className="w-4 h-4" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-slate-800 text-xs sm:text-sm">
              {row.name}
            </span>
            <span className="text-[10px] text-slate-400 font-medium sm:hidden">
              Goal: {row.goal}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Goal",
      accessor: "goal",
      className: "hidden sm:table-cell",
      render: (row) => (
        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50/70 border border-indigo-100 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
          {row.goal}
        </span>
      ),
    },
    {
      header: "Description",
      accessor: "description",
      className: "max-w-xs truncate hidden md:table-cell",
      render: (row) => (
        <span className="text-slate-500 font-medium text-[11px] truncate block max-w-xs">
          {row.description || "No description provided."}
        </span>
      ),
    },
    {
      header: "Actions",
      className: "w-28 text-right",
      render: (row) => {
        const id = row.planId;
        return (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => navigate(`/plan/diet/details/${id}`)}
              title="View Details"
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200 cursor-pointer"
            >
              <LuEye className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate(`/plan/diet/edit/${id}`)}
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

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 font-montserrat">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold bg-linear-to-r from-slate-800 to-indigo-900 bg-clip-text text-transparent">
          Diet Plans
        </h1>
        <p className="text-xs font-medium text-slate-500">
          Monitor and configure customized daily nutrition schedules and macro targets.
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
            placeholder="Search plans by name or goal..."
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

          {/* Add Plan Button */}
          <button
            onClick={() => navigate("/plan/diet/add")}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-250 cursor-pointer"
          >
            <LuPlus className="w-3.5 h-3.5" />
            <span>Add Diet Plan</span>
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
                  <div className="w-10 h-10 rounded-xl bg-slate-100 animate-pulse" />
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
        ) : dietPlans.length === 0 ? (
          // Empty State
          <div className="border border-dashed border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
              <LuInbox className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-700">No Diet Plans Found</h4>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                Try adjusting your search criteria or add new diet plans.
              </p>
            </div>
          </div>
        ) : (
          // Grid Cards Render
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {dietPlans.map((plan) => {
              const textHash = plan.name ? plan.name.charCodeAt(0) % 4 : 0;
              const gradients = [
                "from-amber-400 to-orange-500 shadow-orange-100/70",
                "from-indigo-400 to-purple-500 shadow-indigo-100/70",
                "from-emerald-400 to-teal-500 shadow-emerald-100/70",
                "from-rose-400 to-pink-500 shadow-rose-100/70"
              ];
              const activeGradient = gradients[textHash];

              return (
                <div 
                  key={plan.planId} 
                  className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-lg shadow-slate-100 hover:shadow-xl hover:shadow-indigo-100/25 hover:-translate-y-1 hover:border-indigo-100/50 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${activeGradient} flex items-center justify-center text-white shadow-md`}>
                        <LuUtensils className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                          {plan.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-0.5">
                          <LuTarget className="w-3 h-3 text-slate-400" />
                          <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">{plan.goal}</span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-slate-500 font-medium text-[11px] leading-relaxed line-clamp-2 min-h-8">
                      {plan.description || "No description provided."}
                    </p>
                  </div>

                  {/* Actions footer */}
                  <div className="flex gap-2 mt-5 pt-3 border-t border-slate-50">
                    <button
                      onClick={() => navigate(`/plan/diet/details/${plan.planId}`)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-[10px] font-bold rounded-lg border border-slate-100 hover:border-indigo-100 transition-all duration-200 cursor-pointer"
                    >
                      <LuEye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </button>
                    <button
                      onClick={() => navigate(`/plan/diet/edit/${plan.planId}`)}
                      title="Edit Plan"
                      className="p-1.5 bg-slate-50 hover:bg-amber-50 text-slate-400 hover:text-amber-600 border border-slate-100 hover:border-amber-100 rounded-lg transition-all duration-200 cursor-pointer"
                    >
                      <LuPencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deletePlan(plan.planId)}
                      title="Delete Plan"
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
          data={dietPlans}
          isLoading={isLoading}
          containerClassName="max-h-[460px] overflow-y-auto"
        />
      )}
    </div>
  );
};

export default DietPlanList;
