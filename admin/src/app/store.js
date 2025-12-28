import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/auth/authSlice";
import trainerReducer from "../redux/trainer/trainerSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    trainer: trainerReducer,
  },
});
