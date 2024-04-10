import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import categoriesReducer from './categoriesSlice';
import productsReducer from './productsSlice';
import cartReducer from './cartSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        category: categoriesReducer,
        product: productsReducer,
        cart: cartReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;