import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {apiFetch} from "./auth"

export const fetchPurchases = createAsyncThunk('purchases/fetchPurchases', async ({
                                                                                      page = 1,
                                                                                      limit = 5,
                                                                                      userId = undefined
                                                                                  }, {rejectWithValue}) => {
    return await apiFetch(`/users/${userId}/purchases?page=${page}&limit=${limit}`, 'GET', null, {}, rejectWithValue)
})


const initialState = {
    purchases: {
        items: [],
        pagination: {
            totalItems: 0,
            totalPages: 0,
            currentPage: 1,
            pageSize: 5
        },
        status: 'loading'
    }
}

const purchasesSlice = createSlice({
    name: 'purchases',
    initialState,
    reducers: {
        deletePurchase: (state, action) => {
            state.purchases.items = state.purchases.items.filter(pur => pur._id !== action.payload)
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPurchases.pending, (state, action) => {
                state.purchases.status = 'loading';
                state.purchases.items = [];
            })
            .addCase(fetchPurchases.fulfilled, (state, action) => {
                state.purchases.status = 'loaded';
                state.purchases.items = action.payload.purchases || [];
                state.purchases.pagination = action.payload.pagination || state.purchases.pagination;
            })
            .addCase(fetchPurchases.rejected, (state, action) => {
                state.purchases.status = 'error';
                state.purchases.items = [];
            })
    }

})

export const {deletePurchase} = purchasesSlice.actions
export const purchasesReducer = purchasesSlice.reducer
