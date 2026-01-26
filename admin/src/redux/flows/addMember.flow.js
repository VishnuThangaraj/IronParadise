import { createAsyncThunk } from "@reduxjs/toolkit";

import { addNewMember } from "../member/memberThunks";
import { addNewMembership } from "../membership/membershipThunks";
import { addNewFitnessPlan } from "../fitnessPlan/fitnessPlanThunks";

export const addMemberFlow = createAsyncThunk(
  "flows/addMember",
  async (
    { newMember, newMembership, newFitnessPlan },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const memberResponse = await dispatch(
        addNewMember({ newMember }),
      ).unwrap();
      const memberId = memberResponse.member._id;

      console.log(newMembership);
      if (newMembership && memberId) {
        await dispatch(
          addNewMembership({
            newMembership: { ...newMembership, memberId: memberId },
          }),
        ).unwrap();
      }

      if (newFitnessPlan && memberId) {
        await dispatch(
          addNewFitnessPlan({
            newFitnessPlan: {
              ...newFitnessPlan,
              memberId: memberId,
            },
          }),
        );
      }

      return memberResponse.member;
    } catch (error) {
      return rejectWithValue(error?.message || "Add member flow failed");
    }
  },
);
