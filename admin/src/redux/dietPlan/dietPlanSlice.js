import { createSlice } from "@reduxjs/toolkit";
import {
  addNewDietPlan,
  fetchAllDietPlans,
  fetchDietPlanCounter,
} from "./dietPlanThunks";

const initialState = {
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
      });
  },
});

export const { clearDietplans } = dietPlanSlice.actions;
export default dietPlanSlice.reducer;
