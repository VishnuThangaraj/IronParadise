import axios from "../../service/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Fetch All Membership Plans
export const fetchAllMembershipPlans = createAsyncThunk(
  "membershipplan/fetchAllMembershipPlans",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await axios.get("/membershipplan/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch Membership plans"
      );
    }
  }
);

// Fetch Membership Plan Counter
export const fetchMembershipPlanCounter = createAsyncThunk(
  "membershipplan/fetchMembershipPlanCounter",
  async ({ role }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await axios.post(
        "/counter",
        { role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);
      return res.data.seq || 0;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch Membership plan counter"
      );
    }
  }
);

// Add New Membership Plan
export const addNewMembershipPlan = createAsyncThunk(
  "membershipplan/addNewMembershipPlan",
  async ({ newMembershipPlan }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await axios.post(
        "/membershipplan/create",
        { ...newMembershipPlan },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to Add New Membership Plan"
      );
    }
  }
);
