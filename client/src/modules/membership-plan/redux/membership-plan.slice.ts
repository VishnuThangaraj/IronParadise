import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  fetchMembershipPlans,
  fetchMembershipPlanById,
  createMembershipPlan,
  updateMembershipPlan,
  deleteMembershipPlan,
  deleteMembershipPlanPermanently,
} from "@/modules/membership-plan/redux/membership-plan.thunks";
import {
  type MembershipPlan,
  type MembershipPlanResponse,
  type SingleMembershipPlanResponse,
} from "../types/membership-plan.types";

export interface MembershipPlanState {
  plans: MembershipPlan[];
  currentPlan: MembershipPlan | null;
  loading: boolean;
  error: string | null;
}

const initialState: MembershipPlanState = {
  plans: [],
  currentPlan: null,
  loading: false,
  error: null,
};

const membershipPlanSlice = createSlice({
  name: "membershipPlan",
  initialState,
  reducers: {
    setCurrentPlan: (state, action: PayloadAction<MembershipPlan | null>) => {
      state.currentPlan = action.payload;
    },
    clearMembershipPlanError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Plans
      .addCase(fetchMembershipPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMembershipPlans.fulfilled,
        (state, action: PayloadAction<MembershipPlanResponse>) => {
          state.loading = false;
          state.plans = action.payload.data;
        },
      )
      .addCase(fetchMembershipPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch membership plans";
      })

      // Fetch Plan By ID
      .addCase(fetchMembershipPlanById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMembershipPlanById.fulfilled,
        (state, action: PayloadAction<SingleMembershipPlanResponse>) => {
          state.loading = false;
          state.currentPlan = action.payload.data;
        },
      )
      .addCase(fetchMembershipPlanById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch membership plan";
      })

      // Create Plan
      .addCase(createMembershipPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createMembershipPlan.fulfilled,
        (state, action: PayloadAction<SingleMembershipPlanResponse>) => {
          state.loading = false;
          state.plans.unshift(action.payload.data);
        },
      )
      .addCase(createMembershipPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create membership plan";
      })

      // Update Plan
      .addCase(updateMembershipPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateMembershipPlan.fulfilled,
        (state, action: PayloadAction<SingleMembershipPlanResponse>) => {
          state.loading = false;
          const updatedPlan = action.payload.data;
          state.plans = state.plans.map((plan) =>
            plan._id === updatedPlan._id ||
            plan.membershipPlanId === updatedPlan.membershipPlanId
              ? updatedPlan
              : plan,
          );
          if (
            state.currentPlan &&
            (state.currentPlan._id === updatedPlan._id ||
              state.currentPlan.membershipPlanId ===
                updatedPlan.membershipPlanId)
          ) {
            state.currentPlan = updatedPlan;
          }
        },
      )
      .addCase(updateMembershipPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update membership plan";
      })

      // Delete Plan (Soft Delete)
      .addCase(deleteMembershipPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteMembershipPlan.fulfilled,
        (state, action: PayloadAction<SingleMembershipPlanResponse>) => {
          state.loading = false;
          const deletedPlan = action.payload.data;
          state.plans = state.plans.map((plan) =>
            plan._id === deletedPlan._id ||
            plan.membershipPlanId === deletedPlan.membershipPlanId
              ? deletedPlan
              : plan,
          );
          if (
            state.currentPlan &&
            (state.currentPlan._id === deletedPlan._id ||
              state.currentPlan.membershipPlanId ===
                deletedPlan.membershipPlanId)
          ) {
            state.currentPlan = deletedPlan;
          }
        },
      )
      .addCase(deleteMembershipPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete membership plan";
      })

      // Permanent Delete Plan
      .addCase(deleteMembershipPlanPermanently.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteMembershipPlanPermanently.fulfilled,
        (state, action: PayloadAction<SingleMembershipPlanResponse>) => {
          state.loading = false;
          const deletedPlan = action.payload.data;
          state.plans = state.plans.filter(
            (plan) =>
              plan._id !== deletedPlan._id &&
              plan.membershipPlanId !== deletedPlan.membershipPlanId,
          );
          if (
            state.currentPlan &&
            (state.currentPlan._id === deletedPlan._id ||
              state.currentPlan.membershipPlanId ===
                deletedPlan.membershipPlanId)
          ) {
            state.currentPlan = null;
          }
        },
      )
      .addCase(deleteMembershipPlanPermanently.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to permanently delete membership plan";
      });
  },
});

export const { setCurrentPlan, clearMembershipPlanError } =
  membershipPlanSlice.actions;
export default membershipPlanSlice.reducer;

