import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/modules/auth/redux/auth.slice";
import serverStatusReducer from "@/shared/redux/server-status/serverStatusSlice";
import membershipPlanReducer from "@/modules/membership-plan/redux/membership-plan.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    serverStatus: serverStatusReducer,
    membershipPlan: membershipPlanReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
