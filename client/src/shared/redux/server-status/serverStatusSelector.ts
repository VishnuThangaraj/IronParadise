import { createSelector } from "@reduxjs/toolkit";
import { type RootState } from "@/app/store";

export const selectServerStatus = (state: RootState) => state.serverStatus;

export const selectIsOnline = createSelector(
  selectServerStatus,
  (serverStatus) => serverStatus.isOnline,
);
