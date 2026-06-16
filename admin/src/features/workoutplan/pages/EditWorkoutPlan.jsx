import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { LuArrowLeft, LuCalendarDays } from "react-icons/lu";

import useEditWorkoutPlan from "../hooks/useEditWorkoutPlan";
import { workoutPlanFields, days } from "../constants/workoutPlanFields";
import ButtonPrimary from "@/shared/components/ui/form/button/ButtonPrimary";

import ExerciseCard from "../components/ExerciseCard";
import DaySelector from "../components/DaySelector";
import WorkoutPlanInfo from "../components/WorkoutPlanInfo";
import DayFocus from "../components/DayFocus";
import Loader from "@/shared/components/ui/Loader";

const EditWorkoutPlan = () => {
  const navigate = useNavigate();
  const {
    workoutPlan,
    activeDay,
    setActiveDay,
    isLoading,
    isSubmitting,
    handleMetadataChange,
    handleDayFocusChange,
    addExercise,
    removeExercise,
    handleSubmit,
  } = useEditWorkoutPlan();

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 mx-auto pb-12 max-w-6xl font-montserrat">
      <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/plan/workout/list")}
            className="bg-white hover:bg-slate-50 shadow-xs p-2 border border-slate-200 rounded-xl transition-colors duration-250 cursor-pointer"
          >
            <LuArrowLeft className="w-4 h-4 text-slate-600" />
          </button>
          <div>
            <h1 className="bg-clip-text bg-linear-to-r from-slate-800 to-indigo-900 font-bold text-transparent text-2xl">
              Edit Workout Plan
            </h1>
            <p className="font-medium text-slate-500 text-xs">
              Update your customized weekly workout routine.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/plan/workout/list")}
            className="bg-white hover:bg-slate-50 px-5 py-2 border border-slate-200 rounded-xl font-bold text-slate-700 text-xs transition-all duration-250 cursor-pointer"
          >
            Cancel
          </button>
          <ButtonPrimary
            onClick={handleSubmit}
            loading={isSubmitting}
            loadingText="Updating Plan..."
            className="shadow-md px-5 py-2 rounded-xl font-bold text-xs cursor-pointer"
          >
            Update Plan
          </ButtonPrimary>
        </div>
      </div>

      <div className="gap-6 grid grid-cols-1 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <WorkoutPlanInfo
            workoutPlan={workoutPlan}
            onChange={handleMetadataChange}
            fields={workoutPlanFields}
          />
          <DayFocus
            focus={workoutPlan[activeDay]?.focus}
            onChange={(value) => handleDayFocusChange(activeDay, value)}
          />
        </div>

        <div className="space-y-6 lg:col-span-2">
          <DaySelector
            days={days}
            activeDay={activeDay}
            onSelectDay={setActiveDay}
          />

          <motion.div
            key={activeDay}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2 px-1">
              <LuCalendarDays className="w-4 h-4 text-indigo-500" />
              <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider">
                Exercises for {capitalize(activeDay)}
              </h3>
            </div>

            <div className="gap-6 grid grid-cols-1">
              <ExerciseCard
                exercises={workoutPlan[activeDay]?.exercises || []}
                onAddExercise={(item) => addExercise(activeDay, item)}
                onRemoveExercise={(idx) => removeExercise(activeDay, idx)}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EditWorkoutPlan;
