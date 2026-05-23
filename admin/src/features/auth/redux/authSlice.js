import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { loginAdmin, fetchAdmin } from "@/features/auth/redux/authThunks";
import { updateAdminProfile } from "@/features/account/redux/accountThunks";

const getStoredToken = () => {
    try {
        return localStorage.getItem("token") || "";
    } catch {
        return "";
    }
};

const initialState = {
    user: null,
    token: getStoredToken(),
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = "";
            state.error = null;
            localStorage.removeItem("token");
        },
        setToken: (state, action) => {
            state.token = action.payload;
            localStorage.setItem("token", action.payload);
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAdmin.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.token) {
                    state.token = action.payload.token;
                }
                if (action.payload.user) {
                    state.user = action.payload.user;
                }
            })
            .addCase(fetchAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(updateAdminProfile.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.user) {
                    state.user = action.payload.user;
                }
            })
            .addCase(fetchAdmin.rejected, (state) => {
                state.user = null;
                state.token = "";
            })
            .addMatcher(isAnyOf(loginAdmin.pending, fetchAdmin.pending), (state) => {
                state.loading = true;
                state.error = null;
            })
            .addMatcher(isAnyOf(loginAdmin.rejected, fetchAdmin.rejected), (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { logout, setToken, clearError } = authSlice.actions;

export default authSlice.reducer;