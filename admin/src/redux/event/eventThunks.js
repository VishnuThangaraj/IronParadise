import axios from "../../service/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all Event
export const fetchAllEvents = createAsyncThunk(
  "event/fetchAllEvents",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await axios.get("/event/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch Event");
    }
  },
);

// Fetch Event Counter
export const fetchEventCounter = createAsyncThunk(
  "event/fetchEventCounter",
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
        },
      );

      return res.data.seq || 0;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch Event counter",
      );
    }
  },
);

// Add New Event
export const addNewEvent = createAsyncThunk(
  "event/addNewEvent",
  async ({ newEvent }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await axios.post(
        "/event/create",
        { ...newEvent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to Add New Event");
    }
  },
);
