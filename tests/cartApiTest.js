const request = require('supertest');
const app = require('../app');
const { Database } = require('../db/databaseQueries');
const { Database } = require('../db/databaseQueries');


const invalidProductData = {
    "userId": 6,
    "productId": 1,
    "totalUnits": 1
};

const reduceQtyData = {
    "userId": 6,
    "productId": 37,
    "totalUnits": -2
};

const invalidQtyData = {
    "userId": 6,
    "productId": 37,
    "totalUnits": 5
};

const userData = {
    "email": "gambito@gmail.com",
    "password": "12345",
    "checkoutData": []
};

let newCategoryData;
let productData;
let databaseProductData = {
    'name': 'Salmon Test',
    'quantity': 3,
    'description': 'Fresh from the sea',
    'price': '$4.99'
};

describe('CART TESTS', () => {
    let cookie;
    let newCategoryData;
    let productData;
    let databaseProductData = {
        'name': 'Salmon Test',
        'quantity': 3,
        'description': 'Fresh from the sea',
        'price': '$4.99'
    };
    let updatedProductData;

    let data = {
        "userId": 6,
        "productId": 37,
        "totalUnits": 1
    };
    
    before((done) => {
        // login user
        request(app)
        .post('/auth/login/')
        .send(userData)
        .end((err, res) => {
            if (err) return done(err);
            cookie = res.headers['set-cookie']

            // adding mock category
            request(app)
                .post('/categories/add-category')
                .send({'name': 'newCategory'})
                .set('accept', 'application/json')
                .end((err) => {
                    if (err) return done(err);

                    // get added mock category data
                    Database.getCategoryByName('newCategory')
                        .then(categoryData => {
                            newCategoryData = categoryData;
                            productData = {
                                'categoryId': newCategoryData.id,
                                ...databaseProductData
                            };

                            // adding mock product
                            request(app)
                                .post(`/products/add-product`)
                                .send(productData)
                                .set('accept', 'application/json')
                                .end((err) => {
                                    if (err) return done(err);
                                    
                                    // get added mock product data
                                    Database.getProductByName(productData.name)
                                        .then(productData => {
                                            updatedProductData = productData;
                                        })
                                    done();
                                })
                        })
                })
        })
    });

    after((done) => {
        // deleting mock category
        request(app)
            .delete(`/categories/delete-category/${newCategoryData.id}`)
            .end((err) => {
                if (err) return done(err);

                // deleting mock product
                request(app)
                    .delete(`/products/delete-product/${updatedProductData.id}`)
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    })
            })
    });

    describe('POST /cart', () => {
        const path = '/cart';
    
        it('responses with 401 when user is not logged in', (done) => {
            request(app)
            .post(path)
            .send(data)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
            .expect({ "error": `User is not logged in` })
            .end((err) => {
                if (err) return done(err);
                done();
            })
        });
    
        it('responses with 201 when product was added to the cart', (done) => {
            request(app)
                .post(path)
                .set('Cookie', cookie)
                .send(data)
                .set('accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)
                .expect({ "message": `Product ${data["productId"]} was added to cart table`})
                .end((err) => {
                    if (err) return done(err);
                    done();
                })
        });
        
        it('responses with 200 when product quantity has been updated', (done) => {
            request(app)
                .post(path)
                .set('Cookie', cookie)
                .send(data)
                .set('accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect({ "message": `Product ${data["productId"]} quantity has been udpated in the cart`})
                .end((err) => {
                    if (err) return done(err);
                    done();
                })
        });
    
        it('responses with 404 when no product id is found', (done) => {
            request(app)
                .post(path)
                .set('Cookie', cookie)
                .send(invalidProductData)
                .set('accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404)
                .expect({ "error": `Product id was not found` })
                .end((err) => {
                    if (err) return done(err);
                    done();
                })
        });
        it('responses with 400 when invalid quantity is sent', (done) => {
            request(app)
                .post(path)
                .set('Cookie', cookie)
                .send(invalidQtyData)
                .set('accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .expect({ "error": `Product does not have that many units` })
                .end((err) => {
                    if (err) return done(err);
                    done();
                })
        });
        it('responses with 400 when product quantity in cart is zero', (done) => {
            request(app)
                .post(path)
                .set('Cookie', cookie)
                .send(reduceQtyData)
                .set('accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .expect({ "error": `Product total in the cart can't be zero. Do you want to delete this product from cart?` })
                .end((err) => {
                    if (err) return done(err);
                    done();
                })
        });
    });
    
    describe('GET /cart', () => {
        const path = '/cart';
    
        const updatedData = [{
            "product_id": data["productId"],
            "user_id": data["userId"],
            "quantity": data["totalUnits"] + 1
        }];
    
        it('responses with 500 when user is not logged in', (done) => {
            request(app)
                .get(path)
                .set('accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(500)
                .expect({ "error": `User is not logged in` })
                .end((err) => {
                    if (err) return done(err);
                    done();
                })
        });
    
        it('responses with 200 with cart for a user was loaded', (done) => {
            request(app)
                .get(path)
                .set('Cookie', cookie)
                .set('accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect({ "message": `Cart selected for user`, "cart": updatedData })
                .end((err) => {
                    if (err) return done(err);
                    done();
                })
        });
    });
    
    describe('DELETE /cart/delete-product', () => {
        const productId = data['productId'];
        const invalidProductId = invalidProductData['productId'];
        const path = `/cart/delete-product?productId=${productId}`;
        const badQueryParamsPath = `/cart/delete-product`;
        const badProductIdPath = `/cart/delete-product?productId=${invalidProductId}`;
    
        it('responses with 401 when user is not logged in', (done) => {
            request(app)
                .delete(path)
                .set('accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(401)
                .expect({ "error": `User is not logged in` })
                .end((err) => {
                    if (err) return done(err);
                    done();
                })
        });
    
        it('responses with 200 when product was deleted from the cart', (done) => {
            request(app)
                .delete(path)
                .set('Cookie', cookie)
                .set('accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect({ message: 'Product was deleted from user cart' })
                .end((err) => {
                    if (err) return done(err);
                    done();
                })
        });
    
        it('responses with 400 when productId query param is not provided', (done) => {
            request(app)
                .delete(badQueryParamsPath)
                .set('Cookie', cookie)
                .set('accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .expect({ "error": 'ProductId parameter was not provided' })
                .end((err) => {
                    if (err) return done(err);
                    done();
                })
        });
    
        it('responses with 404 when no product id was found', (done) => {
            request(app)
                .delete(badProductIdPath)
                .set('Cookie', cookie)
                .set('accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404)
                .expect({ "error": 'Product id was not found' })
                .end((err) => {
                    if (err) return done(err);
                    done();
                })
        });

        it('responses with 404 when user has no products in the cart', (done) => {
            request(app)
                .delete(path)
                .set('Cookie', cookie)
                .expect('Content-Type', /json/)
                .expect(404)
                .expect({ "error": `No products in the cart` })
                .end((err) => {
                    if (err) return done(err);
                    done();
                })
        });
    });

    describe('DELETE /cart/delete-cart', () => {
        const path = '/cart/delete-cart';

        it("responses with 200 when user's cart was deleted", (done) => {
            request(app)
                .post('/cart')
                .set('Cookie', cookie)
                .send(data)
                .set('accept', 'application/json')
                .end((err) => {
                    if (err) return done(err);
                    request(app)
                        .delete(path)
                        .set('Cookie', cookie)
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .expect({ "message": `All products deleted from user cart` })
                        .end((err) => {
                            if (err) return done(err);
                            done();
                        })
                })
        });

        it('responses with 401 when user is not logged in', (done) => {
            request(app)
                .delete(path)
                .expect('Content-Type', /json/)
                .expect(401)
                .expect({ "error": `User is not logged in` })
                .end((err) => {
                    if (err) return done(err);
                    done();
                })
        });

        it('responses with 404 when user has no products in the cart', (done) => {
            request(app)
                .delete(path)
                .set('Cookie', cookie)
                .expect('Content-Type', /json/)
                .expect(404)
                .expect({ "error": `No products in the cart` })
                .end((err) => {
                    if (err) return done(err);
                    done();
                })
        });
    });
});
