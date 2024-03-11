const newUserMockData = {
    newUserData: {
        "username": 'DigoBaiocchi', 
        "email": 'rodrigo@gmail.com', 
        "password": "123456"
    },
    incorrectData: {
        "email": "rodrigo@gmail.com", 
        "password": "123456"
    },
    noPasswordProvided: {
        "username": "OtherUser", 
        "email": "newuser@gmail.com", 
        "password": ""
    },    
    existentEmail: {
        "id": "1", 
        "username": 'Rodrigos', 
        "email": 'rodrigo@gmail.com', 
        "password": "123456"
    }
};

const newUserData = {
    "email": "gambito@gmail.com",
    "password": "12345",
    "checkoutData": []
};

const newCategoryData = {
    'name': 'newCategory'
};

const newProductData = {
    'name': 'Salmon Test',
    'quantity': 3,
    'description': 'Fresh from the sea',
    'price': '$4.99'
};


module.exports = {
    newUserData,
    newCategoryData,
    newProductData,
    newUserMockData
};