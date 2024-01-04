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

const invalidQtyData = {
    "userId": 6,
    "productId": 37,
    "totalUnits": 5
};

describe('POST /cart', () => {
    const path = '/cart';
    const userData = {
        "email": "gambito@gmail.com",
        "password": "12345",
        "checkoutData": []
    }
    
    let cookie;
    
    before((done) => {
        request(app)
        .post('/auth/login/')
        .send(userData)
        .end((err, res) => {
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

    it('responses with 400 when no user id is found', (done) => {
        request(app)
            .post(path)
            .set('Cookie', cookie)
            .send(invalidUserData)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect({ "error": `User id was not found` })
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
    it('responses with 403 when product is already in the cart', (done) => {
        request(app)
            .post(path)
            .set('Cookie', cookie)
            .send(data)
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
    const userId = 6;
    it('responses with 200 with cart for a user was loaded', (done) => {
        request(app)
            .get(path)
            .send(data)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(`"Cart selected for user ${data['userId']}"`)
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('response with 400 when no user id was found', (done) => {
        request(app)
            .get(path)
            .send(invalidUserData)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect(`"User ${invalidUserData['userId']} was not found"`)
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
});

describe('PUT /cart', () => {
    const path = '/cart';
    it('responses with 200 when a product quantity was updated in the cart', (done) => {
        request(app)
            .put(path)
            .send(data)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(`"Quantity for product id ${data['productId']} was updated in the cart"`)
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('responses with 400 when no user id was found', (done) => {
        request(app)
            .put(path)
            .send(invalidUserData)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect(`"User id ${invalidUserData['userId']} was not found"`)
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('responses with 400 when no product id was found', (done) => {
        request(app)
            .put(path)
            .send(invalidProductData)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect(`"Product id ${invalidProductData['productId']} was not found"`)
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('responses with 400 when invalid quantity is sent', (done) => {
        request(app)
            .put(path)
            .send(invalidQtyData)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect(`"Product has less than ${invalidQtyData["totalUnits"]} units"`)
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
});

describe('DELETE /cart/:userId/:productId', () => {
    const userId = data['userId'];
    const productId = data['productId'];
    const invalidUserId = invalidUserData['userId'];
    const invalidProductId = invalidProductData['productId'];
    const path = `/cart/${userId}/${productId}`;
    const badUserIdPath = `/cart/${invalidUserId}/${productId}`;
    const badProductIdPath = `/cart/${userId}/${invalidProductId}`;
    it('responses with 200 when product was deleted from the cart', (done) => {
        request(app)
            .delete(path)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(`"Product id ${productId} delete from user ${userId} cart"`)
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('responses with 400 when no user id was found', (done) => {
        request(app)
            .delete(badUserIdPath)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect(`"User id ${invalidUserData['userId']} was not found"`)
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('responses with 400 when no product id was found', (done) => {
        request(app)
            .delete(badProductIdPath)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect(`"Product id ${invalidProductData['productId']} was not found"`)
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
});