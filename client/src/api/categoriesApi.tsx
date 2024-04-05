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

const deleteCategoryApi = async (id:number) => {
    try {
        await fetch(`${BASE_URL}/delete-category/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
    } catch (err) {
        throw new Error(`Unable to delete category id: ${id}`);
    }
}

const updateCategoryApi = async (id:number, name:string) => {
    try {
        await fetch (`${BASE_URL}/edit-category/${id}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'PATCH',
            credentials: 'include',
            body: JSON.stringify({name})
        });
    } catch (err) {
        throw new Error(`Unable to update category id: ${id}`);
    }
};

export { 
    categoriesApi,
    addCategoryApi,
    deleteCategoryApi,
    updateCategoryApi
 };