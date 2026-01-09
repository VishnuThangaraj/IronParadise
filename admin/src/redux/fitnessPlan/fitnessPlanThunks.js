import axios from "../../service/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all Fitness Plans
export const fetchAllFitnessPlans = createAsyncThunk(
  "feessplan/fetchAllFitnessPlans",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await axios.get("/fitnessplan/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch Fitness plan"
      );
    }
  }
);

// Add New Fitness Plan
export const addNewFitnessPlan = createAsyncThunk(
  "fitnessplan/addNewFitnessPlan",
  async ({ newFitnessPlan }, { getState, rejectWithValue }) => {
    try {
      console.log(newFitnessPlan);
      const token = getState().auth.token;

      const res = await axios.post(
        "/fitnessplan/create",
        { ...newFitnessPlan },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to Add New Fitness Plan"
      );
    }
  }
);
