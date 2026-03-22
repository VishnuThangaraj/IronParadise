export const selectWorkoutPlanLoading = (state) => state.workoutPlan.loading;
export const selectAllWorkoutPlans = (state) => state.workoutPlan.workoutPlans;
export const selectCurrentWorkoutPlan = (state) =>
    state.workoutPlan.currentWorkoutPlan;
