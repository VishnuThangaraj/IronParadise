import {createSlice} from "@reduxjs/toolkit";
import {fetchAllPayroll} from "@/redux/payroll/payrollThunks.js";

const initialState = {
    currentPayroll: null,
    payrolls: [],
    loading: false
}

const payrollSlice = createSlice({
    name: "payroll",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Trainer Payroll
            .addCase(fetchAllPayroll.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllPayroll.fulfilled, (state, action) => {
                state.loading = false;
                state.payrolls = action.payload;
            })
            .addCase(fetchAllPayroll.rejected, (state) => {
                state.loading = false;
            })
    }
})

export default payrollSlice.reducer;