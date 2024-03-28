import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import categoriesReducer from './categoriesSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        category: categoriesReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;