import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/auth/authSlice";
import memberReducer from "../redux/member/memberSlice";
import trainerReducer from "../redux/trainer/trainerSlice";
import dietPlanReducer from "../redux/dietPlan/dietPlanSlice";
import workoutPlanReducer from "../redux/workoutPlan/workoutPlanSlice";
import membershipPlanReducer from "../redux/membershipPlan/membershipPlanSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    member: memberReducer,
    trainer: trainerReducer,
    dietPlan: dietPlanReducer,
    workoutPlan: workoutPlanReducer,
    membershipPlan: membershipPlanReducer,
  },
});
