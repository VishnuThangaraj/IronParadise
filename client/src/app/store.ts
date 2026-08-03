import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/modules/auth/redux/authSlice";
import serverStatusReducer from "@/shared/redux/server-status/serverStatusSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    serverStatus: serverStatusReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
