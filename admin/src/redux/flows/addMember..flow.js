import { createAsyncThunk } from "@reduxjs/toolkit";

import { addNewMember } from "../member/memberThunks";
import { addNewMembership } from "../membership/membershipThunks";
import { addNewFitnessPlan } from "../fitnessPlan/fitnessPlanThunks";

export const addMemberFlow = createAsyncThunk(
  "flows/addMember",
  async (
    { memberPayload, newMembership, newFitnessPlan },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const member = await dispatch(addNewMember(memberPayload)).unwrap();
      const memberId = member._id;

      if (newMembership) {
        await dispatch(
          addNewMembership({
            ...newMembership,
            member: memberId,
          })
        ).unwrap();
      }

      if (newFitnessPlan) {
        await dispatch(
          addNewFitnessPlan({
            ...newFitnessPlan,
            member: memberId,
          })
        );
      }

      return member;
    } catch (error) {
      return rejectWithValue(error?.message || "Add member flow failed");
    }
  }
);
