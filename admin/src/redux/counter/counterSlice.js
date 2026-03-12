import {createSlice} from '@reduxjs/toolkit';
import {fetchCounter} from "@/redux/counter/counterThunks.js";

const initialState = {counter: 0, error: null, loading:false};

const counterSlice = createSlice(
    {
        name: "counter",
        initialState,
        reducers: {
            clearCounter: (state) => {
                state.counter = 0;
                state.error = null;
                state.loading = false;
            }
        },
        extraReducers:(builder) => {
            builder.addCase(fetchCounter.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
                .addCase(fetchCounter.fulfilled, (state,action) => {
                    state.loading = false;
                    state.counter = action.payload;
                })
                .addCase(fetchCounter.rejected, (state,action) => {

                    state.loading = false;
                    state.error = action.payload;
                })
        }
    }
)

export const { clearCounter } = counterSlice.actions;
export default counterSlice.reducer;