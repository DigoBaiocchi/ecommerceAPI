type CategoriesResponse = {
    responseStatus: number,
    response: {
        data:Array<Object>
    }
};

const categoriesApi = async () => {
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
    categoriesApi,
 };