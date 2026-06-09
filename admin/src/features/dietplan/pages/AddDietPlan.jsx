import { useNavigate } from "react-router-dom";

import { motion } from "motion/react";
import { LuArrowLeft, LuCalendarDays } from "react-icons/lu";

import useAddDietPlan from "../hooks/useAddDietPlan";
import { dietPlanFields, days, meals } from "../constants/dietPlanFields";
import ButtonPrimary from "@/shared/components/ui/form/button/ButtonPrimary";

// Subcomponents
import MealCard from "../components/MealCard";
import DayTotals from "../components/DayTotals";
import DaySelector from "../components/DaySelector";
import DietPlanInfo from "../components/DietPlanInfo";

const AddDietPlan = () => {
  const navigate = useNavigate();
  const {
    dietPlan,
    activeDay,
    setActiveDay,
    isSubmitting,
    handleMetadataChange,
    addMealItem,
    removeMealItem,
    handleSubmit,
    getActiveDayTotals,
  } = useAddDietPlan();

  const activeTotals = getActiveDayTotals();
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

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
              Create Diet Plan
            </h1>
            <p className="text-xs font-medium text-slate-500">
              Design a custom daily schedule of meals and macronutrient targets.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/plan/diet/list")}
            className="px-5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all duration-250 cursor-pointer bg-white"
          >
            Cancel
          </button>
          <ButtonPrimary
            onClick={handleSubmit}
            loading={isSubmitting}
            loadingText="Saving Plan..."
            className="px-5 py-2 text-xs font-bold rounded-xl shadow-md cursor-pointer"
          >
            Create Plan
          </ButtonPrimary>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Metadata Forms */}
        <div className="lg:col-span-1 space-y-6">
          {/* Base Plan Information */}
          <DietPlanInfo
            dietPlan={dietPlan}
            onChange={handleMetadataChange}
            fields={dietPlanFields}
          />

          {/* Active Day Nutrition Summary Card */}
          <DayTotals activeDay={activeDay} totals={activeTotals} />
        </div>

        {/* Right Column: Weekly Schedule & Days Form */}
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
                Meals Schedule for {capitalize(activeDay)}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {meals.map((meal) => (
                <MealCard
                  key={meal}
                  meal={meal}
                  items={dietPlan[activeDay]?.[meal] || []}
                  onAddItem={(item) => addMealItem(activeDay, meal, item)}
                  onRemoveItem={(idx) => removeMealItem(activeDay, meal, idx)}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AddDietPlan;
