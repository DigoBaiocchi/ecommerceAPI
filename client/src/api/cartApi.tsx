type CartResponse = {
    responseStatus: number,
    response: {
        cart: Array<Object>,
        message: String
    }
};

const cartApi = async () => {
    try {
        const getCart = await fetch('http://localhost:3001/cart', { credentials: 'include' });
    
        const responseStatus = getCart.status;
        const response = await getCart.json();

        const result:CartResponse  = {
            responseStatus,
            response
        }
        console.log(result)
        return result;
    } catch (err) {
        console.log(err);
    }
};

export { 
    cartApi,
 };