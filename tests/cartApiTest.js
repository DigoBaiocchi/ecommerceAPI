const request = require('supertest');
const app = require('../app');

const data = {
    "userId": 6,
    "productId": 37,
    "totalUnits": 1
};

const invalidUserData = {
    "userId": 5,
    "productId": 37,
    "totalUnits": 1
};

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

describe('POST /cart', () => {
    const path = '/cart';
    let cookie;
    
    before((done) => {
        request(app)
        .post('/auth/login/')
        .send(userData)
        .end((err, res) => {
            if (err) return done(err);
            cookie = res.headers['set-cookie']
            done();
        })
    });

    it('responses with 500 when user is not logged in', (done) => {
        request(app)
        .post(path)
        .send(data)
        .set('accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500)
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

    it('responses with 401 when no product id is found', (done) => {
        request(app)
            .post(path)
            .set('Cookie', cookie)
            .send(invalidProductData)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
            .expect({ "error": `Product id was not found` })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('responses with 402 when invalid quantity is sent', (done) => {
        request(app)
            .post(path)
            .set('Cookie', cookie)
            .send(invalidQtyData)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(402)
            .expect({ "error": `Product has less than ${invalidQtyData["totalUnits"]} units` })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('responses with 403 when product quantity in cart is zero', (done) => {
        request(app)
            .post(path)
            .set('Cookie', cookie)
            .send(reduceQtyData)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(403)
            .expect({ "error": `Product total in the cart can't be zero. Do you want to delete this product from cart?` })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
});

describe('GET /cart', () => {
    const path = '/cart';
    let cookie;

    const updatedData = [{
        "product_id": data["productId"],
        "user_id": data["userId"],
        "total_units": data["totalUnits"] + 1
    }]
    
    before((done) => {
        request(app)
        .post('/auth/login/')
        .send(userData)
        .end((err, res) => {
            if (err) return done(err);
            cookie = res.headers['set-cookie']
            done();
        })
    });

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
    
    let cookie;
    
    before((done) => {
        request(app)
        .post('/auth/login/')
        .send(userData)
        .end((err, res) => {
            if (err) return done(err);
            cookie = res.headers['set-cookie']
            done();
        })
    });

    it('responses with 500 when user is not logged in', (done) => {
        request(app)
            .delete(path)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(500)
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

    it('responses with 402 when productId query param is not provided', (done) => {
        request(app)
            .delete(badQueryParamsPath)
            .set('Cookie', cookie)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(402)
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
});