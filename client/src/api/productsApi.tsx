type ProductsResponse = {
    responseStatus: number,
    response: {
        message:String,
        data:Array<Object>
    }
}

type CategoriesParams = {
    name: string;
}

type ProductsParams = {
    name: string;
    quantity: number;
    price: number;
}

type FunctionParams = CategoriesParams | ProductsParams;

const BASE_URL = 'http://localhost:3001/categories';

const getAllApi = async (baseUrl: string) => {
    try {
        const getData = await fetch(baseUrl);
    
        const responseStatus = getData.status;
        const response = await getData.json();

        const result:ProductsResponse  = {
            responseStatus,
            response
        }
        console.log(result, 'test');

        return result;
    } catch (err) {
        console.log(err);
    }
}

const postApi = async (baseUrl: string, pageName: 'category' | 'product', params: FunctionParams) => {
    try {
        await fetch(`${baseUrl}/add-${pageName}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({...params})
        });
    } catch (err) {
        throw new Error('Not able to add category.');
    }
}

const deleteApi = async (baseUrl: string, pageName: string, id: number) => {
    try {
        await fetch(`${baseUrl}/delete-${pageName}/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
    } catch (err) {
        throw new Error(`Unable to delete category id: ${id}`);
    }
}

const updateApi = async (baseUrl: string, pageName: string, id: number, params: FunctionParams) => {
    try {
        const response = await fetch (`${baseUrl}/edit-${pageName}/${id}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'PATCH',
            credentials: 'include',
            body: JSON.stringify({...params})
        });

        return response;
    } catch (err) {
        throw new Error(`Unable to update category id: ${id}`);
    }
}

export { 
    getAllApi,
    postApi,
    deleteApi,
    updateApi
 };