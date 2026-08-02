import { createSelector } from "@reduxjs/toolkit";
import { type RootState } from "@/app/store";

export const selectAuth = (state: RootState) => state.auth;

export const selectUser = createSelector(selectAuth, (auth) => auth.user);
export const selectAuthLoading = createSelector(selectAuth, (auth) => auth.loading);
export const selectAuthError = createSelector(selectAuth, (auth) => auth.error);
export const selectAccessToken = createSelector(selectAuth, (auth) => auth.accessToken);
export const selectRefreshToken = createSelector(selectAuth, (auth) => auth.refreshToken);
