export const selectAttendanceError = (state) => state.attendance.error;
export const selectAllAttendances = (state) => state.attendance.attendances;
export const selectAttendanceLoading = (state) => state.attendance.loading;
export const selectCurrentAttendance = (state) =>
  state.attendance.currentAttendance;
