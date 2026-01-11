import { createAsyncThunk } from "@reduxjs/toolkit";

import { addNewMember } from "../member/memberThunks";
import { addNewMembership } from "../membership/membershipThunks";
import { addNewFitnessPlan } from "../fitnessPlan/fitnessPlanThunks";

export const addMemberFlow = createAsyncThunk(
  "flows/addMember",
  async (
    { newMember, newMembership, newFitnessPlan },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const member = await dispatch(addNewMember({ newMember })).unwrap();
      const memberId = member._id;

      if (newMembership) {
        await dispatch(
          addNewMembership({
            newMembership: { ...newMembership, member: memberId },
          })
        ).unwrap();
      }

      if (newFitnessPlan) {
        await dispatch(
          addNewFitnessPlan({
            newFitnessPlan: {
              ...newFitnessPlan,
              member: memberId,
            },
          })
        );
      }

      return member;
    } catch (error) {
      return rejectWithValue(error?.message || "Add member flow failed");
    }
  }
);
