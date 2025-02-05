import {configureStore} from '@reduxjs/toolkit'
import {productsReducer} from "./slices/products";
import {authReducer} from "./slices/auth";
import {userReducer} from "./slices/users";
import {purchasesReducer} from "./slices/purchases";
import {languageReducer} from "./slices/languages";

const store = configureStore({
    reducer: {
        products: productsReducer,
        auth: authReducer,
        users: userReducer,
        purchases: purchasesReducer,
        languages: languageReducer,
    },
})

export default store;
