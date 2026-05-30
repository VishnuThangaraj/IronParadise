import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { LuArrowLeft, LuCalendarDays, LuFileText, LuPencil } from "react-icons/lu";

import useDietPlanDetails from "../hooks/useDietPlanDetails";
import { days, meals } from "../constants/dietPlanFields";
import Loader from "@/shared/components/ui/Loader";

// Subcomponents
import DayTotals from "../components/DayTotals";
import DaySelector from "../components/DaySelector";

const DietPlanDetails = () => {
  const navigate = useNavigate();
  const {
    dietPlan,
    activeDay,
    setActiveDay,
    isLoading,
    getActiveDayTotals,
    dietPlanId,
  } = useDietPlanDetails();

  const activeTotals = getActiveDayTotals();
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 font-montserrat">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/plan/diet/list")}
            className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors duration-250 cursor-pointer shadow-xs"
          >
            <LuArrowLeft className="w-4 h-4 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold bg-linear-to-r from-slate-800 to-indigo-900 bg-clip-text text-transparent">
              Diet Plan Details
            </h1>
            <p className="text-xs font-medium text-slate-500">
              Overview of the customized daily meal plan and macronutrient breakdown.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate(`/plan/diet/edit/${dietPlanId}`)}
          className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-250 cursor-pointer"
        >
          <LuPencil className="w-3.5 h-3.5" />
          <span>Edit Plan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Metadata Cards */}
        <div className="lg:col-span-1 space-y-6">
          {/* Base Plan Information */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-4"
          >
            <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
              <LuFileText className="w-4 h-4 text-indigo-500" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Plan Information
              </h2>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Diet Plan Name
                </span>
                <span className="text-sm font-bold text-slate-800 block mt-0.5">
                  {dietPlan.name || "-"}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Goal Target
                </span>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50/70 border border-indigo-100 px-2 py-0.5 rounded-md inline-block mt-1 uppercase tracking-wider">
                  {dietPlan.goal || "-"}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Description
                </span>
                <p className="text-xs font-medium text-slate-600 mt-1 whitespace-pre-wrap leading-relaxed">
                  {dietPlan.description || "No description provided."}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Active Day Nutrition Summary Card */}
          <DayTotals activeDay={activeDay} totals={activeTotals} />
        </div>

        {/* Right Column: Weekly Schedule & Meal Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Days Tabs Selection */}
          <DaySelector
            days={days}
            activeDay={activeDay}
            onSelectDay={setActiveDay}
          />

          {/* Meals Configuration Container */}
          <motion.div
            key={activeDay}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2 px-1">
              <LuCalendarDays className="w-4 h-4 text-indigo-500" />
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Scheduled Meals ({capitalize(activeDay)})
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {meals.map((meal) => {
                const items = dietPlan[activeDay]?.[meal] || [];

                return (
                  <div
                    key={meal}
                    className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col h-full"
                  >
                    {/* Meal Header */}
                    <div className="flex items-center mb-4">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        {capitalize(meal)}
                      </h4>
                    </div>

                    {/* Meal Items List */}
                    <div className="flex-1 space-y-3 min-h-[80px]">
                      {items.length === 0 ? (
                        <div className="h-full min-h-[80px] border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-[10px] font-medium p-4 text-center">
                          No items scheduled for this meal.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {items.map((item, idx) => (
                            <div
                              key={idx}
                              className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-start justify-between gap-2 hover:bg-slate-100/40 transition-all duration-200"
                            >
                              <div className="space-y-1">
                                <div className="text-[11px] font-bold text-slate-800">
                                  {item.name}
                                </div>
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[9px] font-bold text-slate-500">
                                  {item.quantity && (
                                    <span className="bg-slate-200/60 px-1.5 py-0.5 rounded-md">
                                      Qty: {item.quantity}
                                    </span>
                                  )}
                                  <span className="text-orange-600">
                                    {item.calories} kcal
                                  </span>
                                  <span>•</span>
                                  <span>P: {item.protein}g</span>
                                  <span>•</span>
                                  <span>C: {item.carbs}g</span>
                                  <span>•</span>
                                  <span>F: {item.fat}g</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DietPlanDetails;
