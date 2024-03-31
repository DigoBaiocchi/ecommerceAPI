import { createSlice } from "@reduxjs/toolkit";
import { login, logout } from "../api/loginApi";

import type { AppDispatch, RootState } from "../store/store";


type User = {
    email:String,
    username:String,
    password:String,
    cart:Array<object>
};
const initialState:User = {
    email: '',
    username: '',
    password: '',
    cart: [],
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserEmail: (state, action) => {
            state.email = action.payload
        },
        setUserUsername: (state, action) => {
            state.username = action.payload
        },
        setUserPassword: (state, action) => {
            state.password = action.payload
        },
        setUserCart: (state, action) => {
            state.cart = action.payload
        }
    }
});

export const { 
    setUserEmail,
    setUserUsername,
    setUserPassword,
    setUserCart,
} = userSlice.actions;

export default userSlice.reducer;

// ThunkMiddleware API
export const loginUser = (email:String, password:String) => async (dispatch: AppDispatch, getState: any) => {
    try {
        const state = getState();
        const { cart } = state.user;
        const userData = await login(email, password, cart);
    
        if (userData.responseStatus) {
            dispatch(setUserUsername(userData.response.data.username));
            dispatch(setUserEmail(email));
            dispatch(setUserPassword(password));
        }
    } catch (err) {
        throw new Error('Not able to log user in.');
    }
};

export const logoutUser = () => async (dispatch: AppDispatch) => {
    try {
        await logout();

        dispatch(setUserUsername(''));
        dispatch(setUserEmail(''));
        dispatch(setUserPassword(''));
    } catch (err) {
        throw new Error('Unable to log user out.');
    }
};

export const selectUserEmail = (state:RootState) => state.user.email;
export const selectUserPassword = (state: RootState) => state.user.password;
export const selectUserUsername = (state: RootState) => state.user.username;
export const selectUserCart = (state: RootState) => state.user.cart;