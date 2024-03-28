import { SetStateAction, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { login, categoriesApi } from "../api/api";
import { loginUser } from "../store/userSlice";
import { getCategories } from "../store/categoriesSlice";
import type { AppDispatch } from "../store/store";

import { 
    selectUserEmail,
    selectUserPassword,
    setUserEmail,
    setUserPassword,
} from "../store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectCategories } from "../store/categoriesSlice";

function Login() {
    const navigate = useNavigate();
    const userEmail = useSelector(selectUserEmail);
    const userPassword = useSelector(selectUserPassword);
    const categories = useSelector(selectCategories);
    const dispatch:AppDispatch = useDispatch();
    
    const onChangeEmail = (e: { target: { value: SetStateAction<string>; }; }) => {
        dispatch(setUserEmail(e.target.value));
    };
    const onChangePassword = (e: { target: { value: SetStateAction<string>; }; }) => {
        dispatch(setUserPassword(e.target.value));
    };

    const fetchCategories = () => {
        dispatch(getCategories());
    };
    
    const onSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        const tryLogin = await login(userEmail, userPassword, []);
        console.log(getCategories);
        
        if (tryLogin.responseStatus === 200) {
            console.log(tryLogin);
            navigate('/');
        }
    };
    
    useEffect(() => {
        fetchCategories();
        console.log(userEmail);
        console.log(userPassword);
        console.log(categories);
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