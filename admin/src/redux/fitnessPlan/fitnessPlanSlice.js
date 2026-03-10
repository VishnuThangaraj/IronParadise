import { createSlice } from "@reduxjs/toolkit";
import { addNewFitnessPlan, fetchAllFitnessPlans } from "./fitnessPlanThunks";

const initialState = {
  fitnessPlans: [],
  loading: false,
  error: null,
};

const fitnessPlanSlice = createSlice({
  name: "fitnessplan",
  initialState,
  reducers: {
    clearFitnessplans: (state) => {
      state.fitnessPlans = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Fetch Fitness Plans
      .addCase(fetchAllFitnessPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllFitnessPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.fitnessPlans = action.payload;
      })
      .addCase(fetchAllFitnessPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add New Fitness Plan
      .addCase(addNewFitnessPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewFitnessPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.fitnessPlans.push(action.payload);
      })
      .addCase(addNewFitnessPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFitnessplans } = fitnessPlanSlice.actions;
export default fitnessPlanSlice.reducer;
