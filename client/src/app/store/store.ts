import { configureStore, legacy_createStore } from "@reduxjs/toolkit";
import counterReducer, { counterSlice } from "../../feaatures/contact/counterReducer";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import { catalogApi } from "../../feaatures/catalog/CatalogApi";
import { uiSlice } from "../layout/uSlice";
import { errorApi } from "../../feaatures/about/errorApi";
import { basketApi } from "../../feaatures/basket/basketApi";
import { catalogSlice } from "../../feaatures/catalog/catalogSlice";
import { accountApi } from "../../feaatures/account/accountApi";
import { checkoutApi } from "../../feaatures/checkout/CheckoutApi";

export function configureTherStore() {
    return legacy_createStore(counterReducer)
}

export const store =configureStore({
    reducer: {
        [catalogApi.reducerPath]:catalogApi.reducer,
        [errorApi.reducerPath]:errorApi.reducer,
        [basketApi.reducerPath]: basketApi.reducer,
        [accountApi.reducerPath]: accountApi.reducer,
        [checkoutApi.reducerPath]: checkoutApi.reducer,

        counter: counterSlice.reducer,
        ui: uiSlice.reducer,
        catalog: catalogSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(
            catalogApi.middleware, 
            errorApi.middleware,
            basketApi.middleware,
            accountApi.middleware,
            checkoutApi.middleware
        )
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;