import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "./store";
import { getAllApi, postApi } from "../api/productsApi";

type Product = {
    id: number;
    name: string;
    quantity: number;
    description: string;
    price: number;
};

type PostProductParams = {
    categoryId: number; 
    name: string; 
    quantity: number; 
    description:string; 
    price: number;
};

type Products = {
    products: Product[];
};

const initialState:Products = {
    products: []
};

export const productsSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload;
        }
    }
});

export const { setProducts } = productsSlice.actions;

export default productsSlice.reducer;

const BASE_URL = 'http://localhost:3001/products';

export const getProducts = () => async (dispatch:AppDispatch) => {
    try {
        const fetchProducts = await getAllApi(BASE_URL);

        dispatch(setProducts(fetchProducts?.response.data));
    } catch (err) {
        throw new Error ('Not able to fetch products.');
    }
};

export const addProduct = (params: PostProductParams) => async () => {
    await postApi(BASE_URL, "product", params);
};

export const selectProducts = (state:RootState) => state.product.products;