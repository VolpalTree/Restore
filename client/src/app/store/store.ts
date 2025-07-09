import { configureStore, legacy_createStore } from "@reduxjs/toolkit";
import counterReducer, { counterSlice } from "../../feaatures/contact/counterReducer";
import { useDispatch, useSelector } from "react-redux";
import { catalogApi } from "../../feaatures/catalog/CatalogApi";
import { uiSlice } from "../layout/uSlice";
import { errorApi } from "../../feaatures/about/errorApi";
import { basketApi } from "../../feaatures/basket/basketApi";
import { catalogSlice } from "../../feaatures/catalog/catalogSlice";

export function configureTherStore() {
    return legacy_createStore(counterReducer)
}

export const store =configureStore({
    reducer: {
        [catalogApi.reducerPath]:catalogApi.reducer,
        [errorApi.reducerPath]:errorApi.reducer,
        [basketApi.reducerPath]: basketApi.reducer,

        counter: counterSlice.reducer,
        ui: uiSlice.reducer,
        catalog: catalogSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(
            catalogApi.middleware, 
            errorApi.middleware,
            basketApi.middleware
        )
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()