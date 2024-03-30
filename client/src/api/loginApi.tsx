type LoginResponse = {
    responseStatus:number,
    response: {
        data: {
            id: number,
            username: string,
            email: string,
            password: string,
            administrator: boolean
        }
    }
};

const login = async (email:String, password:String, checkoutData:Array<object>) => {
    const tryLogin = await fetch('http://localhost:3001/auth/login', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({email, password, checkoutData})
    });
            
    const responseStatus = tryLogin.status;
    const response = await tryLogin.json();

    const result:LoginResponse = {
        responseStatus,
        response
    };

    return result;
};


export { 
    login,
 };