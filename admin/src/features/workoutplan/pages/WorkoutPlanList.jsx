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
  LuDumbbell,
  LuTarget,
} from "react-icons/lu";

import useWorkoutPlanList from "../hooks/useWorkoutPlanList";
import DataTable from "@/shared/components/ui/table/DataTable";

const WorkoutPlanList = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid");
  const { workoutPlans, isLoading, searchQuery, setSearchQuery, deletePlan } =
    useWorkoutPlanList();

  const columns = [
    {
      header: "Plan Name",
      accessor: "name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="flex justify-center items-center bg-linear-to-tr from-indigo-500 to-purple-600 shadow-xs rounded-full w-8 h-8 text-white">
            <LuDumbbell className="w-4 h-4" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-slate-800 text-xs sm:text-sm">
              {row.name}
            </span>
            <span className="sm:hidden font-medium text-[10px] text-slate-400">
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
        <span className="bg-indigo-50/70 px-2.5 py-0.5 border border-indigo-100 rounded-md font-bold text-[10px] text-indigo-600 uppercase tracking-wider">
          {row.goal}
        </span>
      ),
    },
    {
      header: "Description",
      accessor: "description",
      className: "max-w-xs truncate hidden md:table-cell",
      render: (row) => (
        <span className="block max-w-xs font-medium text-[11px] text-slate-500 truncate">
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
          <div className="flex justify-end items-center gap-2">
            <button
              onClick={() => navigate(`/plan/workout/details/${id}`)}
              title="View Details"
              className="hover:bg-indigo-50 p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 transition-all duration-200 cursor-pointer"
            >
              <LuEye className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate(`/plan/workout/edit/${id}`)}
              title="Edit Plan"
              className="hover:bg-amber-50 p-1.5 rounded-lg text-slate-400 hover:text-amber-600 transition-all duration-200 cursor-pointer"
            >
              <LuPencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => deletePlan(id)}
              title="Delete Plan"
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
          Workout Plans
        </h1>
        <p className="font-medium text-slate-500 text-xs">
          Monitor and configure customized weekly workout routines and
          exercises.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4 font-montserrat animate-fade-in">
        <div className="relative w-full sm:max-w-xs">
          <span className="left-0 absolute inset-y-0 flex items-center pl-3.5 text-slate-400 pointer-events-none">
            <LuSearch className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plans by name or goal..."
            className="bg-white shadow-xs py-2 pr-4 pl-10 border border-slate-200 focus:border-indigo-500 rounded-xl outline-hidden focus:ring-4 focus:ring-indigo-500/10 w-full font-semibold text-slate-700 text-xs transition-all duration-200"
          />
        </div>

        <div className="flex items-center gap-3 ml-auto sm:ml-0">
          {/* View Mode Toggle */}
          <div className="flex bg-slate-100 p-0.5 border border-slate-200/80 rounded-lg">
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
            onClick={() => navigate("/plan/workout/add")}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg px-4 py-2 rounded-xl font-bold text-white text-xs transition-all duration-250 cursor-pointer"
          >
            <LuPlus className="w-3.5 h-3.5" />
            <span>Add Workout Plan</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === "grid" ? (
        isLoading ? (
          // Grid Loading Skeleton State
          <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="space-y-4 bg-white p-5 border border-slate-200 rounded-2xl animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 rounded-xl w-10 h-10 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="bg-slate-100 rounded-md w-3/4 h-3.5 animate-pulse" />
                    <div className="bg-slate-100 rounded-md w-1/2 h-2.5 animate-pulse" />
                  </div>
                </div>
                <div className="bg-slate-100 rounded-md w-full h-3 animate-pulse" />
                <div className="bg-slate-100 rounded-md w-5/6 h-3 animate-pulse" />
                <div className="flex gap-2 pt-3 border-slate-50 border-t">
                  <div className="flex-1 bg-slate-100 rounded-lg h-8 animate-pulse" />
                  <div className="bg-slate-100 rounded-lg w-10 h-8 animate-pulse" />
                  <div className="bg-slate-100 rounded-lg w-10 h-8 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : workoutPlans.length === 0 ? (
          // Empty State
          <div className="flex flex-col justify-center items-center gap-2 p-12 border border-slate-200 border-dashed rounded-2xl text-center">
            <div className="flex justify-center items-center bg-slate-50 rounded-xl w-10 h-10 text-slate-400">
              <LuInbox className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-700 text-xs">
                No Workout Plans Found
              </h4>
              <p className="mt-0.5 font-medium text-[10px] text-slate-400">
                Try adjusting your search criteria or add new workout plans.
              </p>
            </div>
          </div>
        ) : (
          // Grid Cards Render
          <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in">
            {workoutPlans.map((plan) => {
              const textHash = plan.name ? plan.name.charCodeAt(0) % 4 : 0;
              const gradients = [
                "from-indigo-500 to-purple-600 shadow-indigo-100/70",
                "from-emerald-500 to-teal-600 shadow-emerald-100/70",
                "from-rose-500 to-pink-600 shadow-rose-100/70",
                "from-blue-500 to-cyan-600 shadow-blue-100/70",
              ];
              const activeGradient = gradients[textHash];

              return (
                <div
                  key={plan.planId}
                  className="group flex flex-col justify-between bg-white shadow-lg shadow-slate-100 hover:shadow-indigo-100/25 hover:shadow-xl p-5 border border-slate-200/80 hover:border-indigo-100/50 rounded-2xl transition-all hover:-translate-y-1 duration-300"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl bg-linear-to-tr ${activeGradient} flex items-center justify-center text-white shadow-md`}
                      >
                        <LuDumbbell className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 text-sm truncate transition-colors">
                          {plan.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-0.5">
                          <LuTarget className="w-3 h-3 text-slate-400" />
                          <span className="font-bold text-[10px] text-indigo-600 uppercase tracking-wider">
                            {plan.goal}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="min-h-8 font-medium text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {plan.description || "No description provided."}
                    </p>
                  </div>

                  {/* Actions footer */}
                  <div className="flex gap-2 mt-5 pt-3 border-slate-50 border-t">
                    <button
                      onClick={() =>
                        navigate(`/plan/workout/details/${plan.planId}`)
                      }
                      className="flex flex-1 justify-center items-center gap-1 bg-slate-50 hover:bg-indigo-50 py-1.5 border border-slate-100 hover:border-indigo-100 rounded-lg font-bold text-[10px] text-slate-600 hover:text-indigo-600 transition-all duration-200 cursor-pointer"
                    >
                      <LuEye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/plan/workout/edit/${plan.planId}`)
                      }
                      title="Edit Plan"
                      className="bg-slate-50 hover:bg-amber-50 p-1.5 border border-slate-100 hover:border-amber-100 rounded-lg text-slate-400 hover:text-amber-600 transition-all duration-200 cursor-pointer"
                    >
                      <LuPencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deletePlan(plan.planId)}
                      title="Delete Plan"
                      className="bg-slate-50 hover:bg-red-50 p-1.5 border border-slate-100 hover:border-red-155 rounded-lg text-slate-400 hover:text-red-500 transition-all duration-200 cursor-pointer"
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
          data={workoutPlans}
          isLoading={isLoading}
          containerClassName="max-h-[460px] overflow-y-auto"
        />
      )}
    </div>
  );
};

export default WorkoutPlanList;
