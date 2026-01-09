import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/auth/authSlice";
import flowReducer from "../redux/flows/flowSlice";
import memberReducer from "../redux/member/memberSlice";
import trainerReducer from "../redux/trainer/trainerSlice";
import dietPlanReducer from "../redux/dietPlan/dietPlanSlice";
import membershipReducer from "../redux/membership/membershipSlice";
import fitnessPlanReducer from "../redux/fitnessPlan/fitnessPlanSlice";
import workoutPlanReducer from "../redux/workoutPlan/workoutPlanSlice";
import membershipPlanReducer from "../redux/membershipPlan/membershipPlanSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    flows: flowReducer,
    member: memberReducer,
    trainer: trainerReducer,
    dietPlan: dietPlanReducer,
    membership: membershipReducer,
    fitnessPlan: fitnessPlanReducer,
    workoutPlan: workoutPlanReducer,
    membershipPlan: membershipPlanReducer,
  },
});
