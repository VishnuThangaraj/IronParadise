import {createSlice} from "@reduxjs/toolkit";
import {
  addNewWorkoutPlan,
  deleteWorkoutPlanById,
  fetchAllWorkoutPlans,
  fetchWorkoutPlanById,
  updateWorkoutPlanById,
} from "./workoutPlanThunks";

const initialState = {
    currentWorkoutPlan: null,
    workoutPlans: [],
    loading: false,
};

const workoutPlanSlice = createSlice({
    name: "workoutplan",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Workout Plans
            .addCase(fetchAllWorkoutPlans.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllWorkoutPlans.fulfilled, (state, action) => {
                state.loading = false;
                state.workoutPlans = action.payload;
            })
            .addCase(fetchAllWorkoutPlans.rejected, (state) => {
                state.loading = false;
            })

            // Add New Workout Plan
            .addCase(addNewWorkoutPlan.pending, (state) => {
                state.loading = true;
            })
            .addCase(addNewWorkoutPlan.fulfilled, (state, action) => {
                state.loading = false;
                state.workoutPlans.push(action.payload);
            })
            .addCase(addNewWorkoutPlan.rejected, (state) => {
                state.loading = false;
            })

            // Fetch WorkoutPlan By ID
            .addCase(fetchWorkoutPlanById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchWorkoutPlanById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentWorkoutPlan = action.payload;
            })
            .addCase(fetchWorkoutPlanById.rejected, (state) => {
                state.loading = false;
            })

            // Update WorkoutPlan by ID
            .addCase(updateWorkoutPlanById.pending, (state) => {
                state.loading = true;
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
            .addCase(updateWorkoutPlanById.rejected, (state) => {
                state.loading = false;
            })

            // Delete Workout Plan by ID
            .addCase(deleteWorkoutPlanById.pending, (state) => {
                state.loading = true;
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
            .addCase(deleteWorkoutPlanById.rejected, (state) => {
                state.loading = false;
            });
    },
});

export default workoutPlanSlice.reducer;
