const login = async (email:String, password:String, checkoutData:Array<object>) => {
    const tryLogin = await fetch('http://localhost:3001/auth/login', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({email, password, checkoutData})
            });
            
            const responseStatus:Number = tryLogin.status;
            const response:Object = await tryLogin.json();

    return {
        responseStatus,
        response
    };
};

export { login };