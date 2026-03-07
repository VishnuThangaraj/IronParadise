import { createAsyncThunk } from "@reduxjs/toolkit";

import { updateMemberById } from "../member/memberThunks";
// import { updateMembership } from "../membership/membershipThunks";
// import { updateFitnessPlan } from "../fitnessPlan/fitnessPlanThunks";

export const updateMemberFlow = createAsyncThunk(
  "flows/updateMember",
  async (
    { memberId, member, membership, fitnessPlan },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const memberResponse = await dispatch(
        updateMemberById({ memberId, updatedData: member }),
      );

      return memberResponse.member;
    } catch (error) {
      return rejectWithValue(error?.message || "Update Member flow failed");
    }
  },
);
