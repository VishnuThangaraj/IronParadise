import axios from "../../service/api";
import {createAsyncThunk} from "@reduxjs/toolkit";

// Fetch All Membership Plans
export const fetchAllMembershipPlans = createAsyncThunk(
    "membershipplan/fetchAllMembershipPlans",
    async (_, {getState, rejectWithValue}) => {
        try {
            const token = getState()?.auth?.token;

            const res = await axios.get("/membershipplan/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return res.data.membershipPlans || [];
        } catch (err) {
            return rejectWithValue(
                err.response?.data || "Failed to fetch Membership plans",
            );
        }
    },
);

// Add New Membership Plan
export const addNewMembershipPlan = createAsyncThunk(
    "membershipplan/addNewMembershipPlan",
    async ({newMembershipPlan}, {getState, rejectWithValue}) => {
        try {
            const token = getState()?.auth?.token;

            const res = await axios.post(
                "/membershipplan/create",
                {...newMembershipPlan},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            return res.data.membershipPlan || {};
        } catch (err) {
            return rejectWithValue(
                err.response?.data || "Failed to Add New Membership Plan",
            );
        }
    },
);

// Fetch Membership plan by ID
export const fetchMembershipPlanById = createAsyncThunk(
    "membershipplan/fetchMembershipPlanById",
    async (membershipPlanId, {getState, rejectWithValue}) => {
        try {
            const token = getState()?.auth?.token;

            const res = await axios.get(
                `/membershipplan/details/${membershipPlanId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            return res.data.membershipPlan || {};
        } catch (err) {
            return rejectWithValue(
                err.response?.data || "Failed to Fetch Membership Plan",
            );
        }
    },
);

// Update Membership Plan by ID
export const updateMembershipPlanById = createAsyncThunk(
    "membershipplan/updateMembershipPlanById",
    async ({membershipPlanId, updatedData}, {getState, rejectWithValue}) => {
        try {
            const token = getState()?.auth?.token;

            const res = await axios.put(
                `/membershipplan/update/${membershipPlanId}`,
                {updatedData},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            return res.data.membershipPlan || {};
        } catch (err) {
            return rejectWithValue(
                err.response?.data || "Failed to Update MembershipPlan",
            );
        }
    },
);

// Delete Membership Plan by ID
export const deleteMembershipPlanById = createAsyncThunk(
    "membershipplan/deleteMembershipPlanById",
    async ({membershipPlanId}, {getState, rejectWithValue}) => {
        try {
            const token = getState()?.auth?.token;

            const res = await axios.delete(
                `/membershipplan/delete/${membershipPlanId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            return res.data.membershipPlanId;
        } catch (err) {
            return rejectWithValue(
                err.response?.data || "Failed to Delete Membership Plan",
            );
        }
    },
);
