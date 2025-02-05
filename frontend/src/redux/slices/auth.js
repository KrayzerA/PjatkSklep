import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

export const getToken = () => window.localStorage.getItem('token');

export const apiFetch = async (url, method = 'GET', body = null, headers = {}, rejectWithValue = null) => {
    const token = getToken();

    const defaultHeaders = {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
    };

    const options = {
        method,
        headers: {...defaultHeaders, ...headers},
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            const errorData = await response.json();
            if (rejectWithValue) {
                return rejectWithValue(errorData);
            }
            throw errorData
        }

        return await response.json();
    } catch (error) {
        console.error(`API Fetch Error: ${error}`);
        if (rejectWithValue) {
            return rejectWithValue(error)
        }
        throw error
    }
};


export const fetchLogin = createAsyncThunk('auth/fetchLogin', async (body, {rejectWithValue}) => {
    return await apiFetch('/auth/login', 'POST', body, {}, rejectWithValue);
})

export const fetchUser = createAsyncThunk('auth/fetchUser', async () => {
    return await apiFetch('/user', 'GET');
})

export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (body, {rejectWithValue}) => {
    return await apiFetch('/auth/register', 'POST', body, {}, rejectWithValue);
})

const initialState = {
    data: null,
    status: 'loading',
    error: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.data = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLogin.pending, (state, action) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchLogin.fulfilled, (state, action) => {
                state.status = 'loaded';
                state.data = action.payload;
            })
            .addCase(fetchLogin.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.payload;
            })

            .addCase(fetchUser.pending, (state, action) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.status = 'loaded';
                state.data = action.payload;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.error.message;
            })

            .addCase(fetchRegister.pending, (state, action) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchRegister.fulfilled, (state, action) => {
                state.status = 'loaded';
                state.data = action.payload;
            })
            .addCase(fetchRegister.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.payload;
            })
    }
})

export const selectorIsAuth = state => Boolean(state.auth.data);

export const authReducer = authSlice.reducer

export const {logout} = authSlice.actions