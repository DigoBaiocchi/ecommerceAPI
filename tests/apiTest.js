const request = require('supertest');
const app = require('../app');
const { Database } = require('../db/databaseQueries');

let newUserData;

describe('POST /register', () => {
    const correctData = {"username": 'DigoBaiocchi', "email": 'rodrigo@gmail.com', "password": "123456"};
    const incorrectData = {"email": "rodrigo@gmail.com", "password": "123456"};
    const noPasswordProvided = {"username": "OtherUser", "email": "newuser@gmail.com", "password": ""};
    const existentEmail = {"id": "1", "username": 'Rodrigos', "email": 'rodrigo@gmail.com', "password": "123456"};

    it('responds with 201 created', (done) => {
        request(app)
            .post('/register')
            .send(correctData)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .expect({
                "message": `User successfully created`
            })
            .end(async (err) => {
                if (err) return done(err);
                newUserData = await Database.selectUserByEmail(correctData.email);
                done();
            });
    });

    it('responses with 400 not created when username or email not provided', (done) => {
        request(app)
            .post('/register')
            .send(incorrectData)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect({
                "error": `No username or email provided`
            })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });

    it('responses with 401 not created when username already exists', (done) => {
        request(app)
            .post('/register')
            .send(newUserData)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
            .expect({
                "error": `Username already exists`
            })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });

    it('responses with 402 not created when email already exists', (done) => {
        request(app)
            .post('/register')
            .send(existentEmail)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(402)
            .expect({
                "error": `Email already exists`
            })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });

    it('responses with 403 when password is not provided', (done) => {
        request(app)
            .post('/register')
            .send(noPasswordProvided)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(403)
            .expect({
                "error": `No password provided`
            })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
});

describe('GET /register/:email', () => {
    const email = 'rodrigo@gmail.com';
    const wrongEmail = 'somewrongemail@gmail.com'

    it('responses with 200 when finding email provided in the database', (done) => {
        request(app)
            .get(`/register/${email}`)
            .set('accept', 'application/json')
            .expect('Content-type', /json/)
            .expect(200)
            .expect({
                "message": `Email was found in the database`,
                "userData": newUserData
            })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });

    it('responses with 400 when not finding email provided in the database', (done) => {
        request(app)
        .get(`/register/${wrongEmail}`)
        .set('accept', 'application/json')
        .expect('Content-type', /json/)
        .expect(400)
        .expect({
            "error": `Email was not found in the database`
        })
        .end((err) => {
            if (err) return done(err);
            done();
        })
    });
});

describe('PUT /register/:email', () => {
    const dataToBeUpdated = {"password": "654321"};
    const missingPassword = {"password": ""};
    const wrongEmail = 'emailnotindb@email.com';

    it('responses with 200 password is updated', (done) => {
        request(app)
            .put(`/register/${newUserData.email}`)
            .send(dataToBeUpdated)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({
                "message": `Password was successfully updated`
            })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });

    it('responses with 400 when no password is provided', (done) => {
        request(app)
            .put(`/register/${newUserData.email}`)
            .send(missingPassword)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
            .expect({
                "error": `Password was not updated`
            })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });

    it('responses with 400 when email is not found in db', (done) => {
        request(app)
            .put(`/register/${wrongEmail}`)
            .send(dataToBeUpdated)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect({
                "error": `Email was not found in the database`
            })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
});

describe('DELETE /register/:email', () => {
    const invalidEmail = '""';

    it('responses with 200 when user was deleted', (done) => {
        request(app)
            .delete(`/register/${newUserData.email}`)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({
                "message": `User was successfully delete`
            })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    
    it('responses with 400 when email was not found', (done) => {
        request(app)
            .delete(`/register/${invalidEmail}`)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect({
                "error": `User was not deleted`
            })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
});

// tests end here


// describe('POST /categories/add-category', async () => {
//     const newCategory = "Poultry";
//     const existentCategory = "Fish";
//     it('responses with 201 when a category is successfully created', (done) => {
//         request(app)
//             .post('/categories/add-category')
//             .send({"name": newCategory})
//             .set('accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(201)
//             .expect(`"Category ${newCategory} successfully created"`)
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             })
//     });
//     it('responses with 400 when no category was provided', (done) => {
//         request(app)
//             .post('/categories/add-category')
//             .send({"name": ""})
//             .set('accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(400)
//             .expect('"Category name not provided"')
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             })
//     });
//     it('responses with 400 when category already exists', (done) => {
//         request(app)
//             .post('/categories/add-category')
//             .send({"name": existentCategory})
//             .set('accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(400)
//             .expect('"Category already exists"')
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             })
//     });
// });

// describe('PUT /categories/edit-category', () => {
//     const categoryId = 2;
//     const newName = 'Fish';
//     it('responses with 200 when category name is updated', (done) => {
//         request(app)
//             .put('/categories/edit-category')
//             .send({"id": categoryId, "name": newName})
//             .set('accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(200)
//             .expect(`"Category ${categoryId} has been updated to ${newName}"`)
//             .end((err) => {
//                 if(err) return done(err);
//                 done();
//             })
//     });
//     it('responses with 400 when no category name is provided', (done) => {
//         request(app)
//             .put('/categories/edit-category')
//             .send({"id": categoryId, "name": ''})
//             .set('accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(400)
//             .expect(`"Name not provided for category ${categoryId}"`)
//             .end((err) => {
//                 if(err) return done(err);
//                 done();
//             })
//     });
// });


// describe('GET /categories', () => {
//     it('responses with 200 with all categories', (done) => {
//         request(app)
//         .get('/categories')
//         .set('accept', 'application/json')
//         .expect('Content-Type', /json/)
//         .expect(200)
//         .expect('"All categories are loaded"')
//         .end((err) => {
//                 if (err) return done(err);
//                 done();
//             })
//     });
// });

// describe('GET /categories/:id', () => {
//     const categoryId = 2;
//     const wrongCategoryId = 1;
//     it('responses with 200 with correct category', (done) => {
//         request(app)
//             .get(`/categories/${categoryId}`)
//             .set('accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(200)
//             .expect(`"Category ${categoryId} selected"`)
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             })
//         });
//         it('responses with 400 when category does not exist', (done) => {
//             request(app)
//             .get(`/categories/${wrongCategoryId}`)
//             .set('accept', 'application/json')
//             .expect(400)
//             .expect(`"Category ${wrongCategoryId} not found"`)
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             })
//         });
//     });
    
//     const newProduct = {
//     'categoryId': 2,
//     'name': 'Salmon Test',
//     'quantity': 3,
//     'description': 'Fresh from the sea',
//     'price': '$4.99'
// };
// const existintProduct = {
//     'id': 3,
//     'name': 'Tuna',
//     'quantity': 3,
//     'description': 'Fresh from the sea',
//     'price': '$4.99'
// }
// const noProductName = {
//     'id': 1,
//     'name': '',
//     'quantity': 3,
//     'description': 'Fresh from the sea',
//     'price': '$4.99'
// };
// const noProductQuantity = {
//     'id': 1,
//     'name': 'Salmon',
//     'quantity': '',
//     'description': 'Fresh from the sea',
//     'price': '$4.99'
// };
// const noProductDescription = {
//     'id': 1,
//     'name': 'Salmon',
//     'quantity': 3,
//     'description': '',
//     'price': '$4.99'
// };
// const noProductPrice = {
//     'id': 1,
//     'name': 'Salmon',
//     'quantity': 3,
//     'description': 'Fresh from the sea',
//     'price': ''
// };
// const wrongProduct = {
//     'id': 2,
//     'name': 'Salmon',
//     'quantity': 3,
//     'description': 'Fresh from the sea',
//     'price': '$4.99'
// };

// describe('GET /products', () => {
//     it('responses with 200 with all products', (done) => {
//         request(app)
//             .get('/products')
//             .set('accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(200)
//             .expect('"All products are loaded"')
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             })
//         });
//     });
    
//     describe('GET /products/:name', () => {
//         const productName = 'Tuna';
//         const path = `/products/${productName}`;
//         const wrongProductName = 'No Salmon';
//         const wrongPath = `/products/${wrongProductName}`;
//         it('resposnes with 200 with selected product info', (done) => {
//             request(app)
//             .get(path)
//             .set('accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(200)
//             .expect(`"Product ${productName} data is loaded"`)
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             })
//         });
//         it('responses with 400 when product was not found', (done) => {
//             request(app)
//             .get(wrongPath)
//             .set('accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(400)
//             .expect(`"No product ${wrongProductName} was found"`)
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             })
//         });
//     });
    
// describe('POST /products/add-product', () => {
//     const path = "/products/add-product";
//     it('responses with 200 when product is added', (done) => {
//         request(app)
//         .post(path)
//         .send(newProduct)
//         .set('accept', 'application/json')
//         .expect('Content-Type', /json/)
//         .expect(200)
//         .expect(`"Product ${newProduct['name']} successfully added"`)
//         .end((err) => {
//             if (err) return done(err);
//             done();
//         })
//     });
//     it('responses with 400 when product name already exists', (done) => {
//         request(app)
//         .post(path)
//         .send(existintProduct)
//         .set('accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(400)
//             .expect(`"Product ${existintProduct['name']} already exists"`)
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             })
//         });
//         it('responses with 400 when no product name is provided', (done) => {
//             request(app)
//             .post(path)
//             .send(noProductName)
//             .set('accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(400)
//             .expect('"Product not added. Missing required information"')
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             })
//         });
//         it('responses with 400 when no product quantity is provided', (done) => {
//             request(app)
//             .post(path)
//             .send(noProductQuantity)
//             .set('accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(400)
//             .expect('"Product not added. Missing required information"')
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             })
//         });
//         it('responses with 400 when no product quantity is provided', (done) => {
//             request(app)
//             .post(path)
//             .send(noProductDescription)
//             .set('accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(400)
//             .expect('"Product not added. Missing required information"')
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             })
//         });
//         it('responses with 400 when no product quantity is provided', (done) => {
//             request(app)
//             .post(path)
//             .send(noProductPrice)
//             .set('accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(400)
//             .expect('"Product not added. Missing required information"')
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             })
//         });
//     });
    
//     describe('PUT /products/edit-product', () => {
//         const path = '/products/edit-product';
//         it('responses with 200 when product name is updated successfully', (done) => {
//             request(app)
//             .put(path)
//             .send(existintProduct)
//             .set('accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(200)
//             .expect(`"Product with id ${existintProduct['id']} info updated"`)
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             })
//         });
//         it('responses with 400 when product was not found', (done) => {
//             request(app)
//             .put(path)
//             .send(wrongProduct)
//             .set('accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(400)
//             .expect(`"Product with id ${wrongProduct['id']} was not found"`)
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             })
//     });
//     it('responses with 400 when product name is not provided', (done) => {
//         request(app)
//         .put(path)
//         .send(noProductName)
//         .set('accept', 'application/json')
//         .expect('Content-Type', /json/)
//         .expect(400)
//         .expect(`"Product not updated. Missing required information"`)
//         .end((err) => {
//             if (err) return done(err);
//             done();
//         })
//     });
//     it('responses with 400 when no product quantity is provided', (done) => {
//         request(app)
//         .put(path)
//         .send(noProductQuantity)
//         .set('accept', 'application/json')
//         .expect('Content-Type', /json/)
//         .expect(400)
//         .expect('"Product not updated. Missing required information"')
//         .end((err) => {
//             if (err) return done(err);
//             done();
//         })
//     });
//     it('responses with 400 when no product description is provided', (done) => {
//         request(app)
//         .put(path)
//         .send(noProductDescription)
//         .set('accept', 'application/json')
//         .expect('Content-Type', /json/)
//         .expect(400)
//         .expect('"Product not updated. Missing required information"')
//         .end((err) => {
//             if (err) return done(err);
//             done();
//         })
//     });
//     it('responses with 400 when no product price is provided', (done) => {
//         request(app)
//         .put(path)
//         .send(noProductPrice)
//         .set('accept', 'application/json')
//         .expect('Content-Type', /json/)
//         .expect(400)
//         .expect('"Product not updated. Missing required information"')
//         .end((err) => {
//             if (err) return done(err);
//             done();
//         })
//     });
// });

// const data = {
//     "userId": 6,
//     "productId": 37,
//     "totalUnits": 1
// };

// const invalidUserData = {
//     "userId": 5,
//     "productId": 37,
//     "totalUnits": 1
// };

// const invalidProductData = {
//     "userId": 6,
//     "productId": 1,
//     "totalUnits": 1
// };

// const invalidQtyData = {
//     "userId": 6,
//     "productId": 37,
//     "totalUnits": 5
// };

// describe('POST /cart', () => {
//     const path = '/cart';
//     it('responses with 201 when product was added to the cart', (done) => {
//         request(app)
//         .post(path)
//         .send(data)
//         .set('accept', 'application/json')
//         .expect('Content-Type', /json/)
//         .expect(201)
//         .expect(`"Product ${data["userId"]} has added to the cart"`)
//         .end((err) => {
//                 if (err) return done(err);
//                 done();
//             })
//     });
//     it('responses with 400 when no user id is found', (done) => {
//         request(app)
//         .post(path)
//         .send(invalidUserData)
//         .set('accept', 'application/json')
//         .expect('Content-Type', /json/)
//         .expect(400)
//         .expect(`"No user id ${invalidUserData["userId"]} was found"`)
//         .end((err) => {
//                 if (err) return done(err);
//                 done();
//             })
//     });
//     it('responses with 400 when no product id is found', (done) => {
//         request(app)
//         .post(path)
//         .send(invalidProductData)
//         .set('accept', 'application/json')
//         .expect('Content-Type', /json/)
//         .expect(400)
//         .expect(`"No product id ${invalidProductData["productId"]} was found"`)
//         .end((err) => {
//             if (err) return done(err);
//                 done();
//             })
//         });
//         it('responses with 400 when invalid quantity is sent', (done) => {
//             request(app)
//             .post(path)
//             .send(invalidQtyData)
//             .set('accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(400)
//             .expect(`"Product has less than ${invalidQtyData["totalUnits"]} units"`)
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             })
//     });
//     it('responses with 400 when product is already in the cart', (done) => {
//         request(app)
//             .post(path)
//             .send(data)
//             .set('accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(400)
//             .expect(`"Product ${data["userId"]} is already in the cart"`)
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             })
//     });
// });

// describe('GET /cart', () => {
//     const path = '/cart';
//     const userId = 6;
//     it('responses with 200 with cart for a user was loaded', (done) => {
//         request(app)
//         .get(path)
//         .send(data)
//         .set('accept', 'application/json')
//         .expect('Content-Type', /json/)
//         .expect(200)
//         .expect(`"Cart selected for user ${data['userId']}"`)
//         .end((err) => {
//                 if (err) return done(err);
//                 done();
//             })
//     });
//     it('response with 400 when no user id was found', (done) => {
//         request(app)
//         .get(path)
//         .send(invalidUserData)
//         .set('accept', 'application/json')
//         .expect('Content-Type', /json/)
//         .expect(400)
//         .expect(`"User ${invalidUserData['userId']} was not found"`)
//         .end((err) => {
//             if (err) return done(err);
//                 done();
//             })
//         });
//     });
    
//     describe('PUT /cart', () => {
//         const path = '/cart';
//     it('responses with 200 when a product quantity was updated in the cart', (done) => {
//         request(app)
//         .put(path)
//         .send(data)
//         .set('accept', 'application/json')
//         .expect('Content-Type', /json/)
//         .expect(200)
//         .expect(`"Quantity for product id ${data['productId']} was updated in the cart"`)
//         .end((err) => {
//                 if (err) return done(err);
//                 done();
//             })
//     });
//     it('responses with 400 when no user id was found', (done) => {
//         request(app)
//         .put(path)
//         .send(invalidUserData)
//         .set('accept', 'application/json')
//         .expect('Content-Type', /json/)
//         .expect(400)
//         .expect(`"User id ${invalidUserData['userId']} was not found"`)
//         .end((err) => {
//                 if (err) return done(err);
//                 done();
//             })
//     });
//     it('responses with 400 when no product id was found', (done) => {
//         request(app)
//             .put(path)
//             .send(invalidProductData)
//             .set('accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(400)
//             .expect(`"Product id ${invalidProductData['productId']} was not found"`)
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             })
//     });
//     it('responses with 400 when invalid quantity is sent', (done) => {
//         request(app)
//         .put(path)
//             .send(invalidQtyData)
//             .set('accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(400)
//             .expect(`"Product has less than ${invalidQtyData["totalUnits"]} units"`)
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             })
//     });
// });

// const checkoutData = {
//     "userId": 6,
//     "productId": 37,
//     "totalUnits": 1,
//     "price": '$5.99'
// };

// const wrongUserIdData = {
//     "userId": 1,
//     "productId": 37,
//     "totalUnits": 1,
//     "price": '$14.20'
// };

// describe('GET /checkout', () => {
//     const path = '/checkout';
//     const goodUserIdData = {'userId': checkoutData['userId']};
//     const badUserIdData = {'userId': wrongUserIdData['userId']};
//     it('responses with 200 with all products in checkout', (done) => {
//         request(app)
//             .get(path)
//             .send(goodUserIdData)
//             .set('accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(200)
//             .expect(`"All products in the cart are loaded for user ${goodUserIdData['userId']}"`)
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             })
//     });
//     it('responses with 400 when no products are found for user', (done) => {
//         request(app)
//             .get(path)
//             .send(badUserIdData)
//             .set('accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(400)
//             .expect(`"User ${badUserIdData['userId']} has no products in the cart"`)
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             })
//     });
// });

// describe('POST /checkout', () => {
//     const path = '/checkout';
//     it('responses with 201 when order is created from checkout and products are cleared from cart', (done) => {
//         request(app)
//             .post(path)
//             .send(data)
//             .set('accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(201)
//             .expect(`"Order was create with products from id ${data['userId']}'s cart"`)
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             })
//     });
//     it('responses with 400 when no user id was found', (done) => {
//         request(app)
//             .post(path)
//             .send(wrongUserIdData)
//             .set('accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(400)
//             .expect(`"User id ${wrongUserIdData['userId']} was not found"`)
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             })
//     });
//     it('responses with 400 when user is not logged in', (done) => {
//         request(app)
//             .post(path)
//             .send(wrongUserIdData)
//             .set('accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(400)
//             .expect(`"User is not logged in"`)
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             })
//     });
// });

// describe('DELETE /cart/:userId/:productId', () => {
//     const userId = data['userId'];
//     const productId = data['productId'];
//     const invalidUserId = invalidUserData['userId'];
//     const invalidProductId = invalidProductData['productId'];
//     const path = `/cart/${userId}/${productId}`;
//     const badUserIdPath = `/cart/${invalidUserId}/${productId}`;
//     const badProductIdPath = `/cart/${userId}/${invalidProductId}`;
//     it('responses with 200 when product was deleted from the cart', (done) => {
//         request(app)
//         .delete(path)
//         .set('accept', 'application/json')
//         .expect('Content-Type', /json/)
//         .expect(200)
//         .expect(`"Product id ${productId} delete from user ${userId} cart"`)
//         .end((err) => {
//                 if (err) return done(err);
//                 done();
//             })
//     });
//     it('responses with 400 when no user id was found', (done) => {
//         request(app)
//         .delete(badUserIdPath)
//         .set('accept', 'application/json')
//         .expect('Content-Type', /json/)
//         .expect(400)
//         .expect(`"User id ${invalidUserData['userId']} was not found"`)
//         .end((err) => {
//                 if (err) return done(err);
//                 done();
//             })
//     });
//     it('responses with 400 when no product id was found', (done) => {
//         request(app)
//         .delete(badProductIdPath)
//         .set('accept', 'application/json')
//         .expect('Content-Type', /json/)
//         .expect(400)
//         .expect(`"Product id ${invalidProductData['productId']} was not found"`)
//         .end((err) => {
//                 if (err) return done(err);
//                 done();
//             })
//     });
// });

// describe('DELETE /products/delete-product/:name', () => {
//     const productName = 'Salmon Test';
//     const wrongProductName = 'No Salmon';
//     const existentProductPath = `/products/delete-product/${productName}`;
//     const nonExistentProductPath = `/products/delete-product/${wrongProductName}`;
//     it('responses with 200 when products is deleted', (done) => {
//         request(app)
//         .delete(existentProductPath)
//         .set('accept', 'application/json')
//         .expect('Content-Type', /json/)
//         .expect(200)
//         .expect('"Product has been deleted"')
//         .end((err) => {
//             if (err) return done(err);
//             done();
//         })
//     });
//     it('responses with 400 when product name does not exists', (done) => {
//         request(app)
//         .delete(nonExistentProductPath)
//         .set('accept0', 'application/json')
//         .expect('Content-Type', /json/)
//         .expect(400)
//         .expect('"No product was found"')
//         .end((err) => {
//             if (err) return done(err);
//             done();
//         })
//     });
// });

// describe('DELETE /categories/delete-category/:name', () => {
//     const newCategory = "Poultry";
//     const wrongCategory = "WrongCategory";
//     it('responses with 200 when category is successfully deleted', (done) => {
//         request(app)
//             .delete(`/categories/delete-category/${newCategory}`)
//             .set('accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(200)
//             .expect(`"Category has been deleted"`)
//             .end((err) => {
//                 if(err) return done(err);
//                 done();
//             })
//     });
//     it('responses with 400 when category is not found', (done) => {
//         request(app)
//             .delete(`/categories/delete-category/${wrongCategory}`)
//             .set('accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(400)
//             .expect('"Category does not exist"')
//             .end((err) => {
//                 if(err) return done(err);
//                 done();
//             })
//     });
// });