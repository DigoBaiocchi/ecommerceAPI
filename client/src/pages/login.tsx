import { SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../api/api";

import { 
    selectUserUsername,
    selectUserEmail,
    selectUserPassword,
    selectUserCart,
    setUserEmail,
    setUserUsername,
    setUserPassword,
    setUserCart,
} from "../store/userSlice";
import { useDispatch, useSelector } from "react-redux";

function Login() {
    const navigate = useNavigate();
    const userUsername = useSelector(selectUserUsername);
    const userEmail = useSelector(selectUserEmail);
    const userPassword = useSelector(selectUserPassword);
    const userCart = useSelector(selectUserCart);
    const dispatch = useDispatch();

    const onChangeEmail = (e: { target: { value: SetStateAction<string>; }; }) => {
        dispatch(setUserEmail(e.target.value));
    };
    const onChangePassword = (e: { target: { value: SetStateAction<string>; }; }) => {
        dispatch(setUserPassword(e.target.value));
    };

    const onSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        const tryLogin = await login(userEmail, userPassword, []);

        if (tryLogin.responseStatus === 200) {
            console.log(tryLogin);
            navigate('/');
        }
    };
    
    useEffect(() => {
        console.log(userEmail);
        console.log(userPassword);    
    }, [userEmail, userPassword]);

    return (
        <>
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