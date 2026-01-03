import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/auth/authSlice";
import memberReducer from "../redux/member/memberSlice";
import trainerReducer from "../redux/trainer/trainerSlice";
import membershipPlanReducer from "../redux/membershipPlan/membershipPlanSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    trainer: trainerReducer,
    member: memberReducer,
    membershipPlan: membershipPlanReducer,
  },
});
