import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/auth/authSlice";
import flowReducer from "../redux/flows/flowSlice";
import eventReducer from "../redux/event/eventSlice";
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
    event: eventReducer,
    member: memberReducer,
    trainer: trainerReducer,
    dietPlan: dietPlanReducer,
    membership: membershipReducer,
    fitnessPlan: fitnessPlanReducer,
    workoutPlan: workoutPlanReducer,
    membershipPlan: membershipPlanReducer,
  },
});
