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
    categoryId: number;
    name: string;
    quantity: number;
    price: number;
}

type FunctionParams = CategoriesParams | ProductsParams;

const getAllApi = async (baseUrl: string) => {
    try {
        const getData = await fetch(baseUrl);
    
        const responseStatus = getData.status;
        const response = await getData.json();

        const result:ProductsResponse  = {
            responseStatus,
            response
        };

        return result;
    } catch (err) {
        throw new Error(`Not able to fetch data.`);
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
        throw new Error(`Not able to add ${pageName}.`);
    }
}

const deleteApi = async (baseUrl: string, pageName: string, id: number) => {
    try {
        await fetch(`${baseUrl}/delete-${pageName}/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
    } catch (err) {
        throw new Error(`Unable to delete ${pageName} id: ${id}`);
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
        throw new Error(`Unable to update ${pageName} id: ${id}`);
    }
}

export { 
    getAllApi,
    postApi,
    deleteApi,
    updateApi
 };