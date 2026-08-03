import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ConnectionState {
  isOnline: boolean;
}

const initialState: ConnectionState = {
  isOnline: false,
};

const serverStatusSlice = createSlice({
  name: "serverStatus",
  initialState,
  reducers: {
    setOnline: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
  },
});

export const { setOnline } = serverStatusSlice.actions;
export default serverStatusSlice.reducer;
