import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import categoriesReducer from './categoriesSlice';

export default configureStore({
    reducer: {
        user: userReducer,
        category: categoriesReducer
    }
});