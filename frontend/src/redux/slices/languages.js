import {createSlice} from "@reduxjs/toolkit";

export const getDictionary = () => JSON.parse(window.localStorage.getItem('dictionary'))

const languageSlice = createSlice({
    name: 'users',
    initialState: window.localStorage.getItem('currentLanguage') || 'EN',
    reducers: {
        setLanguage: (state, action) => {
            localStorage.setItem('currentLanguage',action.payload)
            return action.payload;
        }
    },
})

export const languageReducer = languageSlice.reducer
export const {setLanguage} = languageSlice.actions;
