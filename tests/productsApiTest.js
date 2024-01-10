const request = require('supertest');
const app = require('../app');
const { Database } = require('../db/databaseQueries');

const existintProduct = {
    'id': 3,
    'name': 'Tuna',
    'quantity': 3,
    'description': 'Fresh from the sea',
    'price': '$4.99'
}
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

before((done) => {
    request(app)
        .post('/categories/add-category')
        .send({'name': 'newCategory'})
        .set('accept', 'application/json')
        .end((err) => {
            if (err) return done(err);
            Database.getCategoryByName('newCategory')
                .then(categoryData => {
                    newCategoryData = categoryData;
                    productData = {
                        'categoryId': newCategoryData.id,
                        'name': 'Salmon Test',
                        'quantity': 3,
                        'description': 'Fresh from the sea',
                        'price': '$4.99'
                    };
                    done();
                })
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
            .end((err) => {
                if (err) return done(err);
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
            .expect({ "message": "All products are loaded", "data": [newProduct] })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
});

describe('GET /products/:productId', () => {
    const productId = 'Tuna';
    const path = `/products/${productId}`;
    const wrongProductId = 0;
    const wrongPath = `/products/${wrongProductId}`;
    it('resposnes with 200 with selected product info', (done) => {
        request(app)
            .get(path)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({ "message": `Product data was loaded`, "data": categoryData })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('responses with 400 when product was not found', (done) => {
        request(app)
            .get(wrongPath)
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

describe('PUT /products/edit-product', () => {
    const path = '/products/edit-product';
    it('responses with 200 when product name is updated successfully', (done) => {
        request(app)
            .put(path)
            .send(existintProduct)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(`"Product with id ${existintProduct['id']} info updated"`)
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('responses with 400 when product was not found', (done) => {
        request(app)
            .put(path)
            .send(wrongProduct)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect(`"Product with id ${wrongProduct['id']} was not found"`)
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('responses with 400 when product name is not provided', (done) => {
        request(app)
            .put(path)
            .send(noProductName)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect(`"Product not updated. Missing required information"`)
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('responses with 400 when no product quantity is provided', (done) => {
        request(app)
            .put(path)
            .send(noProductQuantity)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect('"Product not updated. Missing required information"')
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('responses with 400 when no product description is provided', (done) => {
        request(app)
            .put(path)
            .send(noProductDescription)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect('"Product not updated. Missing required information"')
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('responses with 400 when no product price is provided', (done) => {
        request(app)
            .put(path)
            .send(noProductPrice)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect('"Product not updated. Missing required information"')
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
});

describe('DELETE /products/delete-product/:name', () => {
    const productName = 'Salmon Test';
    const wrongProductName = 'No Salmon';
    const existentProductPath = `/products/delete-product/${productName}`;
    const nonExistentProductPath = `/products/delete-product/${wrongProductName}`;
    it('responses with 200 when products is deleted', (done) => {
        request(app)
            .delete(existentProductPath)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect('"Product has been deleted"')
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('responses with 400 when product name does not exists', (done) => {
        request(app)
            .delete(nonExistentProductPath)
            .set('accept0', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect('"No product was found"')
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
});