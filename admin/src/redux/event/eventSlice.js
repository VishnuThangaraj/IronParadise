import { createSlice } from "@reduxjs/toolkit";
import { addNewEvent, fetchAllEvents, fetchEventCounter } from "./eventThunks";

const initialState = {
  events: [],
  loading: false,
  error: null,
  counter: 0,
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    clearEventplans: (state) => {
      state.events = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Event Plans
      .addCase(fetchAllEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchAllEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Event Plan Counter
      .addCase(fetchEventCounter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventCounter.fulfilled, (state, action) => {
        state.loading = false;
        state.counter = action.payload;
      })
      .addCase(fetchEventCounter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add New Event Plan
      .addCase(addNewEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.counter += 1;
        state.events.push(action.payload);
      })
      .addCase(addNewEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearEventplans } = eventSlice.actions;
export default eventSlice.reducer;
