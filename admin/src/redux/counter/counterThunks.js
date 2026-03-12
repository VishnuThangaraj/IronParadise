import axios from "@/service/api"
import {createAsyncThunk} from "@reduxjs/toolkit";

export const fetchCounter = createAsyncThunk("counter/fetchCounter",
    async ({identity}, {getState, rejectWithValue}) => {
    try{
        const token = await getState()?.auth.token;

        const response = await axios.post("/counter",{identity},{headers:{Authorization:"Bearer " + token}});

        return response.data;
    }catch (err) {
      return rejectWithValue(
        err.response?.data || `Failed to fetch ${identity} Counter`,
      );
    }
});