type CategoriesResponse = {
    responseStatus: number,
    response: {
        message:String,
        data:Array<Object>
    }
};

const BASE_URL = 'http://localhost:3001/categories';

const categoriesApi = async () => {
    try {
        const getCategories = await fetch(BASE_URL);
    
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

const addCategoryApi = async (name:string) => {
    try {
        await fetch(`${BASE_URL}/add-category`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({name})
        });
    } catch (err) {
        throw new Error('Not able to add category.');
    }
};

export { 
    categoriesApi,
    addCategoryApi
 };