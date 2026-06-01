import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { LuArrowLeft, LuCalendarDays, LuPencil } from "react-icons/lu";

import useWorkoutPlanDetails from "../hooks/useWorkoutPlanDetails";
import { workoutPlanFields, days } from "../constants/workoutPlanFields";

import ExerciseCard from "../components/ExerciseCard";
import DaySelector from "../components/DaySelector";
import WorkoutPlanInfo from "../components/WorkoutPlanInfo";
import DayFocus from "../components/DayFocus";
import Loader from "@/shared/components/ui/Loader";

const WorkoutPlanDetails = () => {
  const navigate = useNavigate();
  const {
    workoutPlan,
    activeDay,
    setActiveDay,
    isLoading,
    workoutPlanId,
  } = useWorkoutPlanDetails();

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 font-montserrat">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/plan/workout/list")}
            className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors duration-250 cursor-pointer shadow-xs"
          >
            <LuArrowLeft className="w-4 h-4 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold bg-linear-to-r from-slate-800 to-indigo-900 bg-clip-text text-transparent">
              Workout Plan Details
            </h1>
            <p className="text-xs font-medium text-slate-500">
              Viewing details for {workoutPlan.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(`/plan/workout/edit/${workoutPlanId}`)}
            className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-250 cursor-pointer"
          >
            <LuPencil className="w-3.5 h-3.5" />
            <span>Edit Plan</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="pointer-events-none opacity-90">
            <WorkoutPlanInfo
              workoutPlan={workoutPlan}
              onChange={() => {}}
              fields={workoutPlanFields}
            />
          </div>
          <DayFocus
            focus={workoutPlan[activeDay]?.focus}
            disabled={true}
          />
        </div>

        <div className="lg:col-span-2 space-y-6">
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
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Exercises for {capitalize(activeDay)}
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <ExerciseCard
                exercises={workoutPlan[activeDay]?.exercises || []}
                onAddExercise={() => {}}
                onRemoveExercise={() => {}}
                disabled={true}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlanDetails;
