import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuDumbbell,
  LuSalad,
  LuArrowLeft,
  LuCalendar,
  LuLayers,
} from "react-icons/lu";

import PageHeader from "@/shared/components/ui/page/PageHeader";
import Container from "@/shared/components/ui/containers/Container";
import Button from "@/shared/components/ui/buttons/Button";

import { useMemberSelfPlans } from "../hooks/use-member-self-plans";

export const MemberFitnessPlansView = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"workout" | "diet">("workout");

  const { data: response, isLoading, isError, error, refetch } = useMemberSelfPlans();

  const plansData = response?.data;
  const workoutPlan = plansData?.workoutPlan;
  const dietPlan = plansData?.dietPlan;

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return "Active Plan";
    const date = new Date(isoString);
    return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-10 animate-fadeIn">
      {/* Page Header */}
      <PageHeader
        title="My Fitness & Diet Programs"
        description="Access and follow your personalized training regimen and customized meal strategy."
      >
        <Button
          onClick={() => navigate("/dashboard")}
          variant="secondary"
          size="sm"
          className="rounded-xl! font-semibold!"
        >
          <LuArrowLeft className="w-4 h-4 mr-1 text-slate-500" />
          Dashboard
        </Button>
      </PageHeader>

      {/* Program Validity Banner */}
      {plansData?.startDate && plansData?.endDate && (
        <Container
          variant="secondary"
          className="p-4! rounded-2xl! bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200/50 dark:border-indigo-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
            <LuCalendar className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>
              Active Plan Cycle: <strong className="font-semibold">{formatDate(plansData.startDate)}</strong> to{" "}
              <strong className="font-semibold">{formatDate(plansData.endDate)}</strong>
            </span>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
            {plansData.assignmentStatus || "ACTIVE"}
          </span>
        </Container>
      )}

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("workout")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            activeTab === "workout"
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <LuDumbbell className="w-4 h-4" />
          <span>Workout Routine</span>
        </button>

        <button
          onClick={() => setActiveTab("diet")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
            activeTab === "diet"
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <LuSalad className="w-4 h-4" />
          <span>Diet & Nutrition</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 rounded-full border-3 border-indigo-600 border-t-transparent animate-spin" />
          <span className="text-sm font-semibold text-slate-500">Loading your plans...</span>
        </div>
      ) : isError ? (
        <Container variant="secondary" className="p-8 text-center rounded-2xl border-rose-200">
          <p className="text-sm font-semibold text-rose-600">
            {error instanceof Error ? error.message : "Failed to load fitness plans."}
          </p>
          <Button onClick={() => refetch()} variant="secondary" size="sm" className="mt-4">
            Try Again
          </Button>
        </Container>
      ) : activeTab === "workout" ? (
        /* Workout Plan Tab */
        workoutPlan ? (
          <div className="flex flex-col gap-6">
            <Container
              variant="secondary"
              className="p-6! sm:p-8! rounded-3xl! border-indigo-200/60 dark:border-indigo-900/40 bg-linear-to-br from-indigo-50/20 to-transparent flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {workoutPlan.difficulty || "Intermediate"} Level
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-3">
                  {workoutPlan.planName || workoutPlan.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                  {workoutPlan.description || "Structured workout plan designed to optimize strength and muscle tone."}
                </p>
              </div>

              <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 w-full md:w-auto">
                <span className="text-xs text-slate-400 font-medium">Program Target:</span>
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  🎯 {workoutPlan.goal || workoutPlan.fitnessGoal || "General Fitness"}
                </span>
                {workoutPlan.durationWeeks && (
                  <span className="text-xs text-slate-500">
                    Duration: {workoutPlan.durationWeeks} Weeks
                  </span>
                )}
              </div>
            </Container>

            {/* Routines / Daily Splits */}
            {workoutPlan.routines && workoutPlan.routines.length > 0 ? (
              <div className="flex flex-col gap-4">
                <h4 className="font-bold text-base text-slate-800 dark:text-white flex items-center gap-2">
                  <LuLayers className="w-5 h-5 text-indigo-500" />
                  Weekly Training Split
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {workoutPlan.routines.map((routine: any, idx: number) => (
                    <Container
                      key={idx}
                      variant="secondary"
                      className="p-5! rounded-2xl! border-slate-200/80 dark:border-slate-800 flex flex-col gap-3"
                    >
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                          {routine.day || `Day ${idx + 1}`}: {routine.title || routine.muscleGroup || "Workout"}
                        </h5>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {routine.exercises?.length || 0} Exercises
                        </span>
                      </div>

                      {routine.exercises && routine.exercises.length > 0 && (
                        <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-800/80 text-xs pt-1">
                          {routine.exercises.map((ex: any, exIdx: number) => (
                            <div key={exIdx} className="py-2 flex items-center justify-between">
                              <span className="font-medium text-slate-700 dark:text-slate-300">
                                {ex.name || ex.exerciseName}
                              </span>
                              <span className="text-slate-400 font-mono text-[11px]">
                                {ex.sets || 3} sets × {ex.reps || "10-12 reps"}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </Container>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <Container
            variant="secondary"
            className="p-12 text-center rounded-3xl border-dashed border-2 border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-3"
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center text-2xl">
              <LuDumbbell />
            </div>
            <h4 className="text-lg font-bold text-slate-800 dark:text-white">
              No Workout Plan Assigned
            </h4>
            <p className="text-xs text-slate-500 max-w-sm">
              Your trainer has not assigned a specific workout routine yet. Speak with your coach to create a custom workout plan.
            </p>
          </Container>
        )
      ) : (
        /* Diet Plan Tab */
        dietPlan ? (
          <div className="flex flex-col gap-6">
            <Container
              variant="secondary"
              className="p-6! sm:p-8! rounded-3xl! border-emerald-200/60 dark:border-emerald-900/40 bg-linear-to-br from-emerald-50/20 to-transparent flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Nutritional Strategy
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-3">
                  {dietPlan.planName || dietPlan.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                  {dietPlan.description || "Tailored nutrition program balanced for optimal workout performance and recovery."}
                </p>
              </div>

              <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 w-full md:w-auto">
                <span className="text-xs text-slate-400 font-medium">Daily Calorie Target:</span>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  🔥 {dietPlan.caloriesPerDay || 2200} kcal
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Goal: {dietPlan.goal || "Healthy Nutrition"}
                </span>
              </div>
            </Container>

            {/* Meals Schedule */}
            {dietPlan.meals && dietPlan.meals.length > 0 ? (
              <div className="flex flex-col gap-4">
                <h4 className="font-bold text-base text-slate-800 dark:text-white flex items-center gap-2">
                  <LuSalad className="w-5 h-5 text-emerald-500" />
                  Daily Meal Guidance
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dietPlan.meals.map((meal: any, idx: number) => (
                    <Container
                      key={idx}
                      variant="secondary"
                      className="p-5! rounded-2xl! border-slate-200/80 dark:border-slate-800 flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                          {meal.name || `Meal ${idx + 1}`}
                        </h5>
                        {meal.time && (
                          <span className="text-xs text-slate-400 font-mono">
                            {meal.time}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {meal.items || meal.description || "Nutritious balanced foods."}
                      </p>
                    </Container>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <Container
            variant="secondary"
            className="p-12 text-center rounded-3xl border-dashed border-2 border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-3"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center text-2xl">
              <LuSalad />
            </div>
            <h4 className="text-lg font-bold text-slate-800 dark:text-white">
              No Diet Plan Assigned
            </h4>
            <p className="text-xs text-slate-500 max-w-sm">
              You currently do not have a diet or nutrition protocol linked to your account.
            </p>
          </Container>
        )
      )}
    </div>
  );
};

export default MemberFitnessPlansView;
