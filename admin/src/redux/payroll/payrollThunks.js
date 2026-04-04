import axios from "../../service/api";
import {createAsyncThunk} from "@reduxjs/toolkit";

// Fetch all Trainers Payroll
export const fetchAllPayroll = createAsyncThunk(
    "payroll/fetchAllPayroll",
    async (_, {getState, rejectWithValue}) => {
        try {
            const token = getState()?.auth?.token;

            const res = await axios.get("/payroll", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(res.data.trainers);
            return res.data.trainers || [];
        } catch (err) {
            return rejectWithValue(err.response?.data || "Failed to fetch Trainers Payroll");
        }
    }
)