import { useNavigate } from "react-router-dom";
import { LuPlus, LuTrash2, LuEye, LuPencil } from "react-icons/lu";

import useDietPlanList from "../hooks/useDietPlanList";
import DataTable from "@/shared/components/ui/table/DataTable";

const DietPlanList = () => {
  const navigate = useNavigate();
  const { dietPlans, isLoading, searchQuery, setSearchQuery, deletePlan } =
    useDietPlanList();

  const columns = [
    {
      header: "Plan Name",
      accessor: "name",
      render: (row) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-slate-800 text-xs sm:text-sm">
            {row.name}
          </span>
          <span className="text-[10px] text-slate-400 font-medium sm:hidden">
            Goal: {row.goal}
          </span>
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

  const addButton = (
    <button
      onClick={() => navigate("/plan/diet/add")}
      className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-250 cursor-pointer animate-fade-in"
    >
      <LuPlus className="w-3.5 h-3.5" />
      <span>Add Diet Plan</span>
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 font-montserrat">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold bg-linear-to-r from-slate-800 to-indigo-900 bg-clip-text text-transparent">
          Diet Plans
        </h1>
        <p className="text-xs font-medium text-slate-500">
          Monitor and configure customized daily nutrition schedules and macro
          targets.
        </p>
      </div>

      {/* Shared Data Table Component */}
      <DataTable
        columns={columns}
        data={dietPlans}
        isLoading={isLoading}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search plans by name or goal..."
        actionButton={addButton}
        containerClassName="max-h-[460px] overflow-y-auto"
      />
    </div>
  );
};

export default DietPlanList;
