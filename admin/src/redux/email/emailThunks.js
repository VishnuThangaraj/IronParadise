import axios from "../../service/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

// send Mail without Attachments
export const sendMail = createAsyncThunk(
  "email/sendMail",
  async ({ mailData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const result = await axios.post(
        "email/send",
        { ...mailData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return result.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Login failed");
    }
  },
);
