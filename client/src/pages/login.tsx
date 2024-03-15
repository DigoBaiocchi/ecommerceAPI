function Login() {
    return (
        <>
            <form action="">
                <label htmlFor="email">Email:</label>
                <input type="text" id="email" placeholder="Email" />
                <label htmlFor="password">Password:</label>
                <input type="text" id="password" placeholder="Password" />
                <button>Login</button>
            </form>
        </>
    );
}

export default Login;