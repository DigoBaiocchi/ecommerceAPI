import { SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../api/api";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onChangeEmail = (e: { target: { value: SetStateAction<string>; }; }) => {
        setEmail(e.target.value);
    };
    const onChangePassword = (e: { target: { value: SetStateAction<string>; }; }) => {
        setPassword(e.target.value);
    };

    const onSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        const tryLogin = await login(email, password, []);

        if (tryLogin.responseStatus === 200) {
            console.log(tryLogin.response);
            navigate('/');
        }
    };
    
    useEffect(() => {
        console.log(email);
        console.log(password);    
    }, [email, password]);

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