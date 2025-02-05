import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {apiFetch} from "./auth"

export const fetchProducts = createAsyncThunk('products/fetchProducts', async ({
                                                                                   page = 1,
                                                                                   limit = 5
                                                                               }, {rejectWithValue}) => {
    return await apiFetch(`/products?page=${page}&limit=${limit}`, 'GET', null, {}, rejectWithValue)
})

export const fetchSubjects = createAsyncThunk('subjects/fetchSubjects', async ({
                                                                                   page = 1,
                                                                                   limit = 5
                                                                               }, {rejectWithValue}) => {
    return await apiFetch(`/subjects?page=${page}&limit=${limit}`, 'GET', null, {}, rejectWithValue)
})

export const fetchSubjectTypes = createAsyncThunk('subjectTypes/fetchSubjectTypes', async ({
                                                                                               page = 1,
                                                                                               limit = 5
                                                                                           }, {rejectWithValue}) => {
    return await apiFetch(`/subjectTypes?page=${page}&limit=${limit}`, 'GET', null, {}, rejectWithValue)
})

export const fetchSpecialists = createAsyncThunk('specialists/fetchSpecialists', async ({
                                                                                            page = 1,
                                                                                            limit = 5
                                                                                        }, {rejectWithValue}) => {
    return await apiFetch(`/specialists?page=${page}&limit=${limit}`, 'GET', null, {}, rejectWithValue)
})

export const fetchAssignedSpecialists = createAsyncThunk('specialists/fetchAssignedSpecialists', async ({
                                                                                                            page = 1,
                                                                                                            limit = 5,
                                                                                                            subjectId = undefined
                                                                                                        }, {rejectWithValue}) => {
    return await apiFetch(`/subjects/${subjectId}/assigned?page=${page}&limit=${limit}`, 'GET', null, {}, rejectWithValue)
})


const initialState = {
    products: {
        items: [],
        pagination: {
            totalItems: 0,
            totalPages: 0,
            currentPage: 1,
            pageSize: 5
        },
        status: 'loading'
    },
    subjects: {
        items: [],
        pagination: {
            totalItems: 0,
            totalPages: 0,
            currentPage: 1,
            pageSize: 5
        },
        status: 'loading'
    },
    subjectTypes: {
        items: [],
        pagination: {
            totalItems: 0,
            totalPages: 0,
            currentPage: 1,
            pageSize: 5
        },
        status: 'loading'
    },
    specialists: {
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

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        deleteSpecialist: (state, action) => {
            state.specialists.items = state.specialists.items.filter(spec => spec._id !== action.payload)
        },
        deleteSubject: (state, action) => {
            state.subjects.items = state.subjects.items.filter(sub => sub._id !== action.payload)
        },
        deleteProducts: (state, action) => {
            state.products.items = state.products.items.filter(prod => prod._id !== action.payload)
        },
        deleteSubjectTypes: (state, action) => {
            state.subjectTypes.items = state.subjectTypes.items.filter(sub => sub._id !== action.payload)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state, action) => {
                state.products.status = 'loading';
                state.products.items = [];
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.products.status = 'loaded';
                state.products.items = action.payload.products || [];
                state.products.pagination = action.payload.pagination || state.products.pagination;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.products.status = 'error';
                state.products.items = [];
            })

            .addCase(fetchSubjects.pending, (state, action) => {
                state.subjects.status = 'loading';
                state.subjects.items = [];
            })
            .addCase(fetchSubjects.fulfilled, (state, action) => {
                state.subjects.status = 'loaded';
                state.subjects.items = action.payload.subjects || [];
                state.subjects.pagination = action.payload.pagination || state.subjects.pagination;
            })
            .addCase(fetchSubjects.rejected, (state, action) => {
                state.subjects.status = 'error';
                state.subjects.items = [];
            })

            .addCase(fetchSubjectTypes.pending, (state, action) => {
                state.subjectTypes.status = 'loading';
                state.subjectTypes.items = [];
            })
            .addCase(fetchSubjectTypes.fulfilled, (state, action) => {
                state.subjectTypes.status = 'loaded';
                state.subjectTypes.items = action.payload.subjectTypes || [];
                state.subjectTypes.pagination = action.payload.pagination || state.subjectTypes.pagination;
            })
            .addCase(fetchSubjectTypes.rejected, (state, action) => {
                state.subjectTypes.status = 'error';
                state.subjectTypes.items = [];
            })

            .addCase(fetchSpecialists.pending, (state, action) => {
                state.specialists.status = 'loading';
                state.specialists.items = [];
            })
            .addCase(fetchSpecialists.fulfilled, (state, action) => {
                state.specialists.status = 'loaded';
                state.specialists.items = action.payload.specialists || [];
                state.specialists.pagination = action.payload.pagination || state.subjects.pagination;
            })
            .addCase(fetchSpecialists.rejected, (state, action) => {
                state.specialists.status = 'error';
                state.specialists.items = [];
            })

            .addCase(fetchAssignedSpecialists.pending, (state, action) => {
                state.specialists.status = 'loading';
                state.specialists.items = [];
            })
            .addCase(fetchAssignedSpecialists.fulfilled, (state, action) => {
                state.specialists.status = 'loaded';
                state.specialists.items = action.payload.specialists || [];
                state.specialists.pagination = action.payload.pagination || state.subjects.pagination;
            })
            .addCase(fetchAssignedSpecialists.rejected, (state, action) => {
                state.specialists.status = 'error';
                state.specialists.items = [];
            })


    }
})

export const {
    deleteSpecialist,
    deleteProducts,
    deleteSubject,
    deleteSubjectTypes
} = productsSlice.actions
export const productsReducer = productsSlice.reducer
