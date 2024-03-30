import { createSlice } from "@reduxjs/toolkit";
import { categoriesApi } from "../api/categoriesApi";

import type { AppDispatch, RootState } from "../store/store";

type Category = {
    id: number,
    name: string
};

type Categories = {
    categories: Array<Category>
};

const initialState:Categories = {
    categories: []
};

export const categoriesSlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        setCategories: (state, action) => {
            state.categories = action.payload;
        }
    }
});

export const {
    setCategories
} = categoriesSlice.actions;

export default categoriesSlice.reducer;

export const getCategories = () => async (dispatch: AppDispatch) => {
    try {
        const fetchCategories = await categoriesApi();
        
        dispatch(setCategories(fetchCategories?.response.data));
    } catch (err) {
        throw new Error('Not able to fetch categories.');
    }
};

export const selectCategories = (state:RootState) => state.category.categories;