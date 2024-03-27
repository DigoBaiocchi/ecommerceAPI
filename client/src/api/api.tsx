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

type CategoriesResponse = {
    responseStatus: number,
    response: {
        data:Array<Object>
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

const categories = async () => {
    try {
        const getCategories = await fetch('http://localhost:3001/categories');
    
        const responseStatus = getCategories.status;
        const response = await getCategories.json();

        const result:CategoriesResponse  = {
            responseStatus,
            response
        }

        return result;
    } catch (err) {
        console.log(err);
    }
};

export { 
    login,
    categories,
 };