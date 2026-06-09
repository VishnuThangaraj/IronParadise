import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOnline: true,
};

const serverStatusSlice = createSlice({
  name: "serverStatus",
  initialState,
  reducers: {
    setOnline: (state, action) => {
      state.isOnline = action.payload;
    },
  },
});

export const { setOnline } = serverStatusSlice.actions;
export default serverStatusSlice.reducer;
