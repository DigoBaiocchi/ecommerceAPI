import { SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser, selectUserUsername } from "../../store/userSlice";
import type { AppDispatch } from "../../store/store";

import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/header";
import { getCart } from "../../store/cartSlice";

function Login() {
    const navigate = useNavigate();
    const userUsername:String = useSelector(selectUserUsername);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch:AppDispatch = useDispatch();
    
    const onChangeEmail = (e: { target: { value: SetStateAction<string>; }; }) => {
        setEmail(e.target.value);
    };
    const onChangePassword = (e: { target: { value: SetStateAction<string>; }; }) => {
        setPassword(e.target.value);
    };
    
    const logUserIn = () => {
        dispatch(loginUser(email, password));
    };
    
    const onSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        logUserIn();
    };
    
    useEffect(() => {
        if (userUsername) {
            console.log(userUsername);
            navigate('/');
            dispatch(getCart());
        };
    }, [userUsername, navigate]);

    return (
        <>
            <Header />
            <form onSubmit={onSubmit}>
                <label htmlFor="email">Email:</label>
                <input type="text" id="email" placeholder="Email" onChange={onChangeEmail} />
                <label htmlFor="password">Password:</label>
                <input type="text" id="password" placeholder="Password" onChange={onChangePassword} />
                <button type="submit">Login</button>
            </form>
        </>
    );
}

export default Login;