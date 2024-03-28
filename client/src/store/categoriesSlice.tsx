import { createSlice } from "@reduxjs/toolkit";
import { categoriesApi } from "../api/api";

type Category = {
    id: number,
    name: string
};

type Categories = {
    categories: Array<Category>
};

type RootState = {
    category: Categories
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

export const getCategories = () => async (dispatch: any) => {
    try {
        const fetchCategories = await categoriesApi();
        console.log(fetchCategories?.response.data)
        dispatch(setCategories(fetchCategories?.response.data));
    } catch (err) {
        throw new Error('Not able to fetch categories.');
    }
};

export const selectCategories = (state:RootState) => state.category.categories;