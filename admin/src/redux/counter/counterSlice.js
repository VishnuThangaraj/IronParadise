import {createSlice} from '@reduxjs/toolkit';
import {fetchCounter} from "@/redux/counter/counterThunks";

const initialState = {counter: 0};

const counterSlice = createSlice(
    {
        name: "counter",
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder.addCase(fetchCounter.pending, (state) => {
                state.counter = -1;
            })
                .addCase(fetchCounter.fulfilled, (state, action) => {
                    state.loading = false;
                    state.counter = action.payload;
                })
                .addCase(fetchCounter.rejected, (state) => {
                    state.counter = -1;
                })
        }
    }
)

export default counterSlice.reducer;