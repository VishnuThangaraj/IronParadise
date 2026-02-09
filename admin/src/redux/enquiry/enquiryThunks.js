import axios from "../../service/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all Enquiry
export const fetchAllEnquiry = createAsyncThunk(
  "enquiry/fetchAllEnquiry",
  async (__DO_NOT_USE__ActionTypes, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await axios.get("/enquiry/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.enquiries;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch Enquiry");
    }
  },
);

// Add New Enquiry
export const addNewEnquiry = createAsyncThunk(
  "enquiry/addNewEnquiry",
  async ({ newEnquiry }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await axios.post(
        "/enquiry/create",
        { ...newEnquiry },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to Add New Enquiry");
    }
  },
);

// Replay to Enquiry
export const replayEnquiry = createAsyncThunk(
  async ({ mailData, enquiryID }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await axios.patch(
        `/enquiry/replay/${enquiryID}`,
        { ...mailData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to replay Enquiry");
    }
  },
);

// Delete Enquiry by ID
export const deleteEnquiryById = createAsyncThunk(
  "enquiry/deleteEnquiryById",
  async ({ enquiryId }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await axios.delete(`enquiry/${enquiryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data._id;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to Delete Enquiry");
    }
  },
);
