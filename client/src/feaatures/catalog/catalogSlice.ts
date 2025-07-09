import { createSlice } from "@reduxjs/toolkit";
import type { ProductParams } from "../../app/model/productParams";

const initialState: ProductParams = {
    pageNumber: 1,
    pageSize: 8,
    types: [],
    brands: [],
    orderBy: 'name',
    searchTerm: ''
}

export const catalogSlice = createSlice({
    name: 'catalog',
    initialState,
    reducers: {
        setPageNumber(state, action) {
            state.pageNumber = action.payload;
        },
        setPageSize(state, action) {
            state.pageSize = action.payload;
        },
        setOrderBy(state, action) {
            state.orderBy = action.payload;
            state.pageNumber = 1; // Reset to first page when changing order
        },
        setTypes(state, action) {
            state.types = action.payload;
            state.pageNumber = 1; // Reset to first page when changing types
        },
        setBrands(state, action) {
            state.brands = action.payload;
            state.pageNumber = 1; // Reset to first page when changing brands
        },
        setSearchTerm(state, action) {
            state.searchTerm = action.payload;
            state.pageNumber = 1; // Reset to first page when changing search term
        },
        resetParams() {
            return initialState; // Reset to initial state
        }
    }
})

export const {setBrands, setOrderBy, setPageNumber, setPageSize, setSearchTerm, setTypes, resetParams} = catalogSlice.actions;