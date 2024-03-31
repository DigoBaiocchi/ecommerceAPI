import { createSlice } from "@reduxjs/toolkit";
import { cartApi } from "../api/cartApi";

import type { AppDispatch, RootState } from "../store/store";

type CartData = {
    userId: number,
    productId: number,
    quantity: number
};

type Cart = {
    cart: Array<CartData>,
    message: String
};

const initialState:Cart = {
    cart: [],
    message: ''
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCart: (state, action) => {
            state.cart = action.payload;
        },
        setCartMessage: (state, action) => {
            state.message = action.payload;
        }
    }
});

export const {
    setCart,
    setCartMessage,
} = cartSlice.actions;

export default cartSlice.reducer;

export const getCart = () => async (dispatch: AppDispatch) => {
    try {
        const fetchCart = await cartApi();
        
        dispatch(setCart(fetchCart?.response.data.cart));
        dispatch(setCartMessage(fetchCart?.response.data.message))
    } catch (err) {
        throw new Error('Not able to fetch categories.');
    }
};

export const selectCart = (state:RootState) => state.cart.cart;
export const selectCartMessage = (state:RootState) => state.cart.message;