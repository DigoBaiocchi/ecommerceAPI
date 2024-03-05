const request = require('supertest');
const { app, server } = require('../app');
const { Database } = require('../db/databaseQueries');

const noProductName = {
    'id': 1,
    'name': '',
    'quantity': 3,
    'description': 'Fresh from the sea',
    'price': '$4.99'
};

const noProductQuantity = {
    'id': 1,
    'name': 'Salmon',
    'quantity': '',
    'description': 'Fresh from the sea',
    'price': '$4.99'
};

const noProductDescription = {
    'id': 1,
    'name': 'Salmon',
    'quantity': 3,
    'description': '',
    'price': '$4.99'
};

const noProductPrice = {
    'id': 1,
    'name': 'Salmon',
    'quantity': 3,
    'description': 'Fresh from the sea',
    'price': ''
};

const wrongProduct = {
    'id': 2,
    'name': 'Salmon',
    'quantity': 3,
    'description': 'Fresh from the sea',
    'price': '$4.99'
};

let newCategoryData;
let productData;
let databaseProductData = {
    'name': 'Salmon Test',
    'quantity': 3,
    'description': 'Fresh from the sea',
    'price': '$4.99'
};

describe("PRODUCTS API TESTS", () => {

    before((done) => {
        request(app)
            .post('/categories/add-category')
            .send({'name': 'newCategory'})
            .set('accept', 'application/json')
            .end((err) => {
                if (err) return done(err);
                Database.getItemByName("categories", "newCategory")
                    .then(categoryData => {
                        newCategoryData = categoryData;
                        productData = {
                            'categoryId': newCategoryData.id,
                            ...databaseProductData
                        };
                        done();
                    })
            })
    });
    
    after((done) => {
        request(app)
            .delete(`/categories/delete-category/${newCategoryData.id}`)
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    
    describe('POST /products/add-product', () => {
        const path = "/products/add-product";
        
        it('responses with 200 when product is added', (done) => {
            request(app)
                .post(path)
                .send(productData)
                .set('accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect({ "message": `Product was successfully added` })
                .end(async (err) => {
                    if (err) return done(err);
                    databaseProductData = await Database.getItemByName("products", productData.name);
                    done();
                })
    
        });
    
        it('responses with 401 when product name already exists', (done) => {
            request(app)
                .post(path)
                .send(productData)
                .set('accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(401)
                .expect({ "error": `Product already exists` })
                .end((err) => {
                    if (err) return done(err);
                    done();
                })
            });
    
        it('responses with 400 when no product name is provided', (done) => {
            request(app)
            .post(path)
            .send(noProductName)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect({ "error": 'Product not added. Missing required information' })
            .end((err) => {
                if (err) return done(err);
                done();
            })
        });
    
        it('responses with 400 when no product quantity is provided', (done) => {
            request(app)
            .post(path)
            .send(noProductQuantity)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect({ "error": 'Product not added. Missing required information' })
            .end((err) => {
                if (err) return done(err);
                done();
            })
        });
    
        it('responses with 400 when no product quantity is provided', (done) => {
            request(app)
            .post(path)
            .send(noProductDescription)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect({ "error": 'Product not added. Missing required information' })
            .end((err) => {
                if (err) return done(err);
                done();
            })
        });
        
        it('responses with 400 when no product quantity is provided', (done) => {
            request(app)
            .post(path)
            .send(noProductPrice)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect({ "error": 'Product not added. Missing required information' })
            .end((err) => {
                if (err) return done(err);
                done();
            })
        });
    });
        
    describe('GET /products', () => {
        it('responses with 200 with all products', (done) => {
            request(app)
                .get('/products')
                .set('accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect({ "message": "All products are loaded", "data": [databaseProductData] })
                .end((err) => {
                    if (err) return done(err);
                    done();
                })
        });
    });
    
    describe('GET /products/:productId', () => {
        const wrongProductId = 0;
    
        it('resposnes with 200 with selected product info', (done) => {
            request(app)
                .get(`/products/${databaseProductData.id}`)
                .set('accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect({ "message": `Product data was loaded`, "data": databaseProductData })
                .end((err) => {
                    if (err) return done(err);
                    done();
                })
        });
    
        it('responses with 400 when product was not found', (done) => {
            request(app)
                .get(`/products/${wrongProductId}`)
                .set('accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .expect({ "error": `Product was not found` })
                .end((err) => {
                    if (err) return done(err);
                    done();
                })
        });
    });
    
    describe('PUT /products/edit-product/:productId', () => {
        const path = '/products/edit-product';
        
        it('responses with 200 when product name is updated successfully', (done) => {
            const updatedProduct = {
                ...databaseProductData,
                name: 'Tuna'
            };
            console.log(updatedProduct)
            request(app)
                .put(`/products/edit-product/${databaseProductData.id}`)
                .send(updatedProduct)
                .set('accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect({ "message": `Product was successfully updated` })
                .end((err) => {
                    if (err) return done(err);
                    done();
                })
        });
    
        it('responses with 400 when product was not found', (done) => {
            request(app)
                .put(`/products/edit-product/${0}`)
                .send(wrongProduct)
                .set('accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .expect({ "error": `Product was not found` })
                .end((err) => {
                    if (err) return done(err);
                    done();
                })
        });
    
        it('responses with 401 when product name is not provided', (done) => {
            request(app)
                .put(`/products/edit-product/${databaseProductData.id}`)
                .send(noProductName)
                .set('accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(401)
                .expect({ "error": 'Product not updated. Missing required information' })
                .end((err) => {
                    if (err) return done(err);
                    done();
                })
        });
    
        it('responses with 401 when no product quantity is provided', (done) => {
            request(app)
                .put(`/products/edit-product/${databaseProductData.id}`)
                .send(noProductQuantity)
                .set('accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(401)
                .expect({ "error": 'Product not updated. Missing required information' })
                .end((err) => {
                    if (err) return done(err);
                    done();
                })
        });
        
        it('responses with 401 when no product description is provided', (done) => {
            request(app)
                .put(`/products/edit-product/${databaseProductData.id}`)
                .send(noProductDescription)
                .set('accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(401)
                .expect({ "error": 'Product not updated. Missing required information' })
                .end((err) => {
                    if (err) return done(err);
                    done();
                })
        });
    
        it('responses with 401 when no product price is provided', (done) => {
            request(app)
                .put(`/products/edit-product/${databaseProductData.id}`)
                .send(noProductPrice)
                .set('accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(401)
                .expect({ "error": 'Product not updated. Missing required information' })
                .end((err) => {
                    if (err) return done(err);
                    done();
                })
        });
    });
    
    describe('DELETE /products/delete-product/:name', () => {
        const wrongProductId = 0;
    
        it('responses with 200 when products is deleted', (done) => {
            request(app)
                .delete(`/products/delete-product/${databaseProductData.id}`)
                .set('accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect({ "message": "Product has been deleted" })
                .end((err) => {
                    if (err) return done(err);
                    done();
                })
        });
    
        it('responses with 400 when product name does not exists', (done) => {
            request(app)
                .delete(`/products/delete-product/${wrongProductId}`)
                .set('accept0', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .expect({ "error": 'Product was not found' })
                .end((err) => {
                    if (err) return done(err);
                    done();
                })
        });
    });
    
    after((done) => {
        server.close(err => {
            if (err) return done(err);
            done();
        });
    });
});
