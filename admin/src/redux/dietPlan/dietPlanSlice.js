import { createSlice } from "@reduxjs/toolkit";
import {
  addNewDietPlan,
  fetchAllDietPlans,
  fetchDietPlanCounter,
  fetchDietPlanById,
  updateDietPlanById,
  deleteDietPlanById,
} from "./dietPlanThunks";

const initialState = {
  currentDietPlan: null,
  dietPlans: [],
  loading: false,
  error: null,
  counter: 0,
};

const dietPlanSlice = createSlice({
  name: "dietplan",
  initialState,
  reducers: {
    clearDietplans: (state) => {
      state.dietPlans = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Diet Plans
      .addCase(fetchAllDietPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDietPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.dietPlans = action.payload;
      })
      .addCase(fetchAllDietPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Diet Plan Counter
      .addCase(fetchDietPlanCounter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDietPlanCounter.fulfilled, (state, action) => {
        state.loading = false;
        state.counter = action.payload;
      })
      .addCase(fetchDietPlanCounter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add New Diet Plan
      .addCase(addNewDietPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewDietPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.counter += 1;
        state.dietPlans.push(action.payload);
      })
      .addCase(addNewDietPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch DietPlan By Id
      .addCase(fetchDietPlanById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDietPlanById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDietPlan = action.payload;
      })
      .addCase(fetchDietPlanById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update DietPlan by Id
      .addCase(updateDietPlanById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDietPlanById.fulfilled, (state, action) => {
        state.loading = false;

        const updatedDietPlan = action.payload;
        const index = state.dietPlans.findIndex(
          (dietPlan) => dietPlan._id === updatedDietPlan._id,
        );

        if (index !== -1) state.dietPlans[index] = updatedDietPlan;

        state.currentDietPlan = updatedDietPlan;
      })
      .addCase(updateDietPlanById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteDietPlanById.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(deleteDietPlanById.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload;

        state.dietPlans = state.dietPlans.filter(
          (dietPlan) => dietPlan._id !== id,
        );
        if (state.currentDietPlan?._id === id) {
          state.currentDietPlan = null;
        }
      })
      .addCase(deleteDietPlanById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDietplans } = dietPlanSlice.actions;
export default dietPlanSlice.reducer;
