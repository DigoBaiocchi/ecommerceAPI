const BASE_URL = 'http://localhost:3001';

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
    const tryLogin = await fetch(`${BASE_URL}/auth/login`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        credentials: 'include',
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

const logout = async () => {
    try {
        await fetch(`${BASE_URL}/auth/logout`, { credentials: 'include' });
    } catch (err) {
        throw new Error('Unable to log user out.');
    }
};


export { 
    login,
    logout,
 };