import axios from "../../service/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all Diet Plans
export const fetchAllDietPlans = createAsyncThunk(
  "dietplan/fetchAllDietPlans",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await axios.get("/dietplan/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch Diet plan");
    }
  }
);

// Fetch Diet Plan Counter
export const fetchDietPlanCounter = createAsyncThunk(
  "dietplan/fetchDietPlanCounter",
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

      return res.data.seq || 0;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch Diet Plan counter"
      );
    }
  }
);

// Add New Diet Plan
export const addNewDietPlan = createAsyncThunk(
  "dietplan/addNewDietPlan",
  async ({ newDietPlan }, { getState, rejectWithValue }) => {
    try {
      console.log(newDietPlan);
      const token = getState().auth.token;

      const res = await axios.post(
        "/dietplan/create",
        { ...newDietPlan },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to Add New Diet Plan"
      );
    }
  }
);
