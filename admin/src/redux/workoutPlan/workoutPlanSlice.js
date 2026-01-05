import { createSlice } from "@reduxjs/toolkit";
import {
  addNewWorkoutPlan,
  fetchAllWorkoutPlans,
  fetchWorkoutPlanCounter,
} from "./workoutPlanThunks";

const initialState = {
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
      });
  },
});

export const { clearWorkoutplans } = workoutPlanSlice.actions;
export default workoutPlanSlice.reducer;
