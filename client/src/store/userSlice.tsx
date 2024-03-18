import { createSlice } from "@reduxjs/toolkit";
import { login } from "../api/api";

type user = {
    email:String,
    username:String,
    password:String,
    cart:Array<object>
};

const initialState:user = {
    email: '',
    username: '',
    password: '',
    cart: [],
};

export const userSlice = createSlice({
    name: 'userData',
    initialState,
    reducers: {
        setUserEmail: (state, action) => {
            state.email = action.payload
        },
        setUserUsername: (state, action) => {
            state.username = action.payload.username
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

// ThunkMiddleware
export const loginUser = () => async (dispatch: any, getState: any) => {
    try {
        const userData = await login(getState.email, getState.password, getState.cart);
    
        dispatch(setUserUsername(userData.response));
    } catch (err) {
        console.log(err);
    }
}