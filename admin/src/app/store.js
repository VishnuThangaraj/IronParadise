import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/auth/authSlice";
import flowReducer from "../redux/flows/flowSlice";
import eventReducer from "../redux/event/eventSlice";
import emailReducer from "../redux/email/emailSlice";
import memberReducer from "../redux/member/memberSlice";
import enquiryReducer from "../redux/enquiry/enquirySlice";
import trainerReducer from "../redux/trainer/trainerSlice";
import dietPlanReducer from "../redux/dietPlan/dietPlanSlice";
import attendanceReducer from "../redux/attendance/attendanceSlice";
import membershipReducer from "../redux/membership/membershipSlice";
import fitnessPlanReducer from "../redux/fitnessPlan/fitnessPlanSlice";
import workoutPlanReducer from "../redux/workoutPlan/workoutPlanSlice";
import membershipPlanReducer from "../redux/membershipPlan/membershipPlanSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    flows: flowReducer,
    email: emailReducer,
    event: eventReducer,
    member: memberReducer,
    enquiry: enquiryReducer,
    trainer: trainerReducer,
    dietPlan: dietPlanReducer,
    attendance: attendanceReducer,
    membership: membershipReducer,
    fitnessPlan: fitnessPlanReducer,
    workoutPlan: workoutPlanReducer,
    membershipPlan: membershipPlanReducer,
  },
});
