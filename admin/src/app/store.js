import { configureStore } from "@reduxjs/toolkit";

import authReducer from "@/features/auth/redux/authSlice";
import serverStatusReducer from "@/shared/redux/serverStatus/serverStatusSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    serverStatus: serverStatusReducer,
  },
});
