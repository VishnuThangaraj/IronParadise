import { createSlice } from "@reduxjs/toolkit";
import {
  addNewWorkoutPlan,
  fetchAllWorkoutPlans,
  fetchWorkoutPlanCounter,
  fetchWorkoutPlanById,
  updateWorkoutPlanById,
  deleteWorkoutPlanById,
} from "./workoutPlanThunks";

const initialState = {
  currentWorkoutPlan: null,
  workoutPlans: [],
  loading: false,
  error: null,
  counter: 0,
};

const workoutPlanSlice = createSlice({
  name: "workoutplan",
  initialState,
  reducers: {
    clearWorkoutplans: (state) => {
      state.workoutPlans = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Workout Plans
      .addCase(fetchAllWorkoutPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllWorkoutPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.workoutPlans = action.payload;
      })
      .addCase(fetchAllWorkoutPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Workout Plan Counter
      .addCase(fetchWorkoutPlanCounter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkoutPlanCounter.fulfilled, (state, action) => {
        state.loading = false;
        state.counter = action.payload;
      })
      .addCase(fetchWorkoutPlanCounter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add New Workout Plan
      .addCase(addNewWorkoutPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewWorkoutPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.counter += 1;
        state.workoutPlans.push(action.payload);
      })
      .addCase(addNewWorkoutPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch WorkoutPlan By Id
      .addCase(fetchWorkoutPlanById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkoutPlanById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWorkoutPlan = action.payload;
      })
      .addCase(fetchWorkoutPlanById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update WorkoutPlan by Id
      .addCase(updateWorkoutPlanById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWorkoutPlanById.fulfilled, (state, action) => {
        state.loading = false;

        const updatedWorkoutPlan = action.payload;
        const index = state.workoutPlans.findIndex(
          (workoutPlan) => workoutPlan._id === updatedWorkoutPlan._id,
        );

        if (index !== -1) state.workoutPlans[index] = updatedWorkoutPlan;

        state.currentWorkoutPlan = updatedWorkoutPlan;
      })
      .addCase(updateWorkoutPlanById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteWorkoutPlanById.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(deleteWorkoutPlanById.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload;

        state.workoutPlans = state.workoutPlans.filter(
          (workoutPlan) => workoutPlan._id !== id,
        );
        if (state.currentWorkoutPlan?._id === id) {
          state.currentWorkoutPlan = null;
        }
      })
      .addCase(deleteWorkoutPlanById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearWorkoutplans } = workoutPlanSlice.actions;
export default workoutPlanSlice.reducer;
