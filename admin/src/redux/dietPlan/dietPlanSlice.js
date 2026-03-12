import {createSlice} from "@reduxjs/toolkit";
import {
  addNewDietPlan,
  deleteDietPlanById,
  fetchAllDietPlans,
  fetchDietPlanById,
  updateDietPlanById,
} from "./dietPlanThunks";

const initialState = {
    currentDietPlan: null,
    dietPlans: [],
    loading: false,
};

const dietPlanSlice = createSlice({
    name: "dietplan",
    initialState,
    reducers: {
        clearDietplans: (state) => {
            state.dietPlans = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Diet Plans
            .addCase(fetchAllDietPlans.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllDietPlans.fulfilled, (state, action) => {
                state.loading = false;
                state.dietPlans = action.payload;
            })
            .addCase(fetchAllDietPlans.rejected, (state) => {
                state.loading = false;
            })

            // Add New Diet Plan
            .addCase(addNewDietPlan.pending, (state) => {
                state.loading = true;
            })
            .addCase(addNewDietPlan.fulfilled, (state, action) => {
                state.loading = false;
                state.dietPlans.push(action?.payload);
            })
            .addCase(addNewDietPlan.rejected, (state) => {
                state.loading = false;
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

export const {clearDietplans} = dietPlanSlice.actions;
export default dietPlanSlice.reducer;
