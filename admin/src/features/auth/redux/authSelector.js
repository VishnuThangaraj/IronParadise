import { createSelector } from "@reduxjs/toolkit";

export const selectAuth = (state) => state.auth;

export const selectUser = createSelector(selectAuth, (auth) => auth.user);
export const selectToken = createSelector(selectAuth, (auth) => auth.token);
export const selectIsAuthenticated = createSelector(selectAuth, (auth) => !!auth.token);
export const selectAuthError = createSelector(selectAuth, (auth) => auth.error);
export const selectAuthLoading = createSelector(selectAuth, (auth) => auth.loading);
export const selectUserRole = createSelector(selectUser, (user) => user?.role);

export const selectCurrentUser = createSelector(selectUser, (user) => user);