const request = require('supertest');
const app = require('../app');
const { Database } = require('../db/databaseQueries');
const { newUserData, newCategoryData, newProductData } = require('./mockData/mockData');

describe('CART TESTS', () => {
    let cookie;
    let newCategoryData;
    let productData;
    let productData2;
    let updatedProductData;
    let updatedProductData2;

    let newProductData2 = {
        ...newProductData,
        'name': 'Tuna Test',
    };
    
    let data = {
        "userId": 6,
        "totalUnits": 1
    };
    
    let data2 = {
        ...data
    };
    
    const invalidProductData = {
        ...data,
        "productId": 0,
    };
    
    let reduceQtyData = {
        ...data,
        "totalUnits": -2
    };
    
    let invalidQtyData = {
        ...data,
        "totalUnits": 5
    };
    
    before((done) => {
        // login user
        request(app)
        .post('/auth/login/')
        .send(newUserData)
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
                                ...newProductData
                            };
                            productData2 = {
                                'categoryId': newCategoryData.id,
                                ...newProductData2
                            }

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

                                            // updating mock data
                                            data = {
                                                ...data,
                                                "productId": productData.id
                                            };
                                            reduceQtyData = {
                                                ...reduceQtyData,
                                                "productId": productData.id
                                            };
                                            invalidQtyData = {
                                                ...invalidQtyData,
                                                "productId": productData.id
                                            };
                                        });
                                    request(app)
                                        .post(`/products/add-product`)
                                        .send(productData2)
                                        .set('accept', 'application/json')
                                        .end((err) => {
                                            if (err) return done(err);

                                            // get second mock product data
                                            Database.getProductByName(productData2.name)
                                                .then(productData2 => {
                                                    updatedProductData2 = productData2;

                                                    // updating mock data2
                                                    data2 = {
                                                        ...data2,
                                                        "productId": productData2.id
                                                    };
                                                    
                                                    done(); 
                                                });
                                        })
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

                        // deleting second mock product
                        request(app)
                            .delete(`/products/delete-product/${updatedProductData2.id}`)
                            .end((err) => {
                                if (err) return done(err);
                                done();
                            })
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
    
        it('responses with 201 when second product was added to the cart', (done) => {
            console.log(data2);
            request(app)
                .post(path)
                .set('Cookie', cookie)
                .send(data2)
                .set('accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)
                .expect({ "message": `Product ${data2["productId"]} was added to cart table`})
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
            const updatedData = [
                {
                    "user_id": data2["userId"],
                    "product_id": data2["productId"],
                    "quantity": data2["totalUnits"]
                },
                {
                    "user_id": data["userId"],
                    "product_id": data["productId"],
                    "quantity": data["totalUnits"] + 1
                } 
            ];

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
        const invalidProductId = invalidProductData['productId'];
        const path = `/cart/delete-product?productId=`;
        const badQueryParamsPath = `/cart/delete-product`;
        const badProductIdPath = `/cart/delete-product?productId=${invalidProductId}`;
    
        it('responses with 401 when user is not logged in', (done) => {
            request(app)
                .delete(`${path}${data['productId']}`)
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
                .delete(`${path}${data['productId']}`)
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
        
        it('responses with 404 when user has no products in the cart', (done) => {
            request(app)
                .delete(`${path}${data['productId']}`)
                .set('Cookie', cookie)
                .expect('Content-Type', /json/)
                .expect(404)
                .expect({ "error": `No products in the cart` })
                .end((err) => {
                    if (err) return done(err);
                    done();
                })
        });
    
        it('responses with 404 when no product id was found', (done) => {
            console.log(badProductIdPath);
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
