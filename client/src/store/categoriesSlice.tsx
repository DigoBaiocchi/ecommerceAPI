import { createSlice } from "@reduxjs/toolkit";

import type { AppDispatch, RootState } from "../store/store";
import { deleteApi, getAllApi, postApi, updateApi } from "../api/productsCategoriesApi";

type Category = {
    id: number,
    name: string
};

type Categories = {
    categories: Array<Category>
};

type CategoryParams = {
    name: string; 
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

const BASE_URL = 'http://localhost:3001/categories';

export const getCategories = () => async (dispatch: AppDispatch) => {
    try {
        const fetchCategories = await getAllApi(BASE_URL);
        
        dispatch(setCategories(fetchCategories?.response.data));
    } catch (err) {
        throw new Error('Not able to fetch categories.');
    }
};

export const addCategory = (params: CategoryParams) => async () => {
    console.log(params)
    await postApi(BASE_URL, "category", params);
};

export const deleteCategory = (id:number) => async () => {
    await deleteApi(BASE_URL, "category", id);
}

export const updateCategory = (id:number, params: CategoryParams) => async () => {
    const response = await updateApi(BASE_URL, "category", id, params);
    
    return response;
};

export const selectCategories = (state:RootState) => state.category.categories;