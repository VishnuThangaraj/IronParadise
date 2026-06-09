import { createSelector } from "@reduxjs/toolkit";

export const selectServerStatusState = (state) => state.serverStatus;

export const selectIsOnline = createSelector(
  selectServerStatusState,
  (serverStatus) => serverStatus.isOnline
);
