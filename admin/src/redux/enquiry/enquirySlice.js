import { createSlice } from "@reduxjs/toolkit";
import { fetchAllEnquiry, addNewEnquiry } from "./enquiryThunks";

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
      });
  },
});

export const { clearEnquiries } = enquirySlice.actions;
export default enquirySlice.reducer;
