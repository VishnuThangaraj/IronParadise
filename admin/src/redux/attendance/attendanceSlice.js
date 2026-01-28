import { createSlice } from "@reduxjs/toolkit";
import { fetchAllAttendances, addNewAttendance } from "./attendanceThunks";

const initialState = {
  currentAttendance: null,
  attendances: [],
  loading: false,
  error: null,
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    clearAttendances: (state) => {
      state.attendances = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Attendances
    builder
      .addCase(fetchAllAttendances.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAttendances.fulfilled, (state, action) => {
        state.loading = false;
        state.attendances = action.payload;
      })
      .addCase(fetchAllAttendances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add New Attendance
      .addCase(addNewAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewAttendance.fulfilled, (state, action) => {
        state.loading = false;
        const updatedAttendance = action.payload;
        const index = state.attendances.findIndex(
          (attendance) => attendance._id === updatedAttendance._id,
        );

        if (index !== -1) state.attendances[index] = updatedAttendance;

        state.currentMember = updatedAttendance;
      })
      .addCase(addNewAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAttendances } = attendanceSlice.actions;
export default attendanceSlice.reducer;
