import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllEnquiry,
  addNewEnquiry,
  replayEnquiry,
  deleteEnquiryById,
} from "./enquiryThunks";

const initialState = {
  enquiries: [],
  loading: false,
  error: null,
};

const enquirySlice = createSlice({
  name: "enquiry",
  initialState,
  reducers: {
    clearEnquiries: (state) => {
      state.enquires = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      //Fetch all Enquires
      .addCase(fetchAllEnquiry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllEnquiry.fulfilled, (state, action) => {
        state.loading = false;
        state.enquiries = action.payload;
      })
      .addCase(fetchAllEnquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add New Enquiry
      .addCase(addNewEnquiry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewEnquiry.fulfilled, (state, action) => {
        state.loading = false;
        state.enquiries.push(action.payload);
      })
      .addCase(addNewEnquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Replay Enquiry
      .addCase(replayEnquiry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(replayEnquiry.fulfilled, (state, action) => {
        state.loading = false;
        // state.enquiries.push(action.payload);
      })
      .addCase(replayEnquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Enquiry
      .addCase(deleteEnquiryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEnquiryById.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload;

        state.enquiries = state.enquiries.filter(
          (enquiry) => enquiry._id !== id,
        );
        if (state.currentEnquiry?._id === id) {
          state.currentEnquiry = null;
        }
      })
      .addCase(deleteEnquiryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearEnquiries } = enquirySlice.actions;
export default enquirySlice.reducer;
