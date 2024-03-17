import { createSlice } from "@reduxjs/toolkit";

type user = {
    email:String,
    username:String,
    password:String,
};

const initialState:user = {
    email: '',
    username: '',
    password: '',
};

export const userSlice = createSlice({
    name: 'userData',
    initialState,
    reducers: {
        setUserData: state => {}
    }
});

export const { setUserData } = userSlice.actions;

export default userSlice.reducer;