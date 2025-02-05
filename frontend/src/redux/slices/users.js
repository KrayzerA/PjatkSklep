import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {apiFetch} from "./auth"


export const fetchUsers = createAsyncThunk('users/fetchUsers', async ({
                                                                          page = 1,
                                                                          limit = 5
                                                                      }, {rejectWithValue}) => {
    return await apiFetch(`/users?page=${page}&limit=${limit}`, 'GET', null, {}, rejectWithValue)
})

export const fetchRoles = createAsyncThunk('roles/fetchRoles', async ({
                                                                          page = 1,
                                                                          limit = 5
                                                                      }, {rejectWithValue}) => {
    return await apiFetch(`/roles?page=${page}&limit=${limit}`, 'GET', null, {}, rejectWithValue)
})


const initialState = {
    users: {
        items: [],
        pagination: {
            totalItems: 0,
            totalPages: 0,
            currentPage: 1,
            pageSize: 5
        },
        status: 'loading'
    },
    roles: {
        items: [],
        pagination: {
            totalItems: 0,
            totalPages: 0,
            currentPage: 1,
            pageSize: 5
        },
        status: 'loading'
    },

}

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state, action) => {
                state.users.status = 'loading';
                state.users.items = [];
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.users.status = 'loaded';
                state.users.items = action.payload.users || [];
                state.users.pagination = action.payload.pagination || state.users.pagination;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.users.status = 'error';
                state.users.items = [];
            })

            .addCase(fetchRoles.pending, (state, action) => {
                state.roles.status = 'loading';
                state.roles.items = [];
            })
            .addCase(fetchRoles.fulfilled, (state, action) => {
                state.roles.status = 'loaded';
                state.roles.items = action.payload.roles || [];
                state.roles.pagination = action.payload.pagination || state.roles.pagination;
            })
            .addCase(fetchRoles.rejected, (state, action) => {
                state.roles.status = 'error';
                state.roles.items = [];
            })

    }
})

export const userReducer = usersSlice.reducer
