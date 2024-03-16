import { SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
        const tryLogin = await fetch('http://localhost:3001/auth/login', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({email, password, checkoutData: []})
        });
        
        const response = await tryLogin.json();
        if (response.message === 'User is logged in') {
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