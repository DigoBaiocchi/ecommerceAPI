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
    it('responses with 201 when product was added to the cart', (done) => {
        request(app)
            .post(path)
            .send(data)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .expect(`"Product ${data["userId"]} has added to the cart"`)
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('responses with 400 when no user id is found', (done) => {
        request(app)
            .post(path)
            .send(invalidUserData)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect(`"No user id ${invalidUserData["userId"]} was found"`)
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('responses with 400 when no product id is found', (done) => {
        request(app)
            .post(path)
            .send(invalidProductData)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect(`"No product id ${invalidProductData["productId"]} was found"`)
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('responses with 400 when invalid quantity is sent', (done) => {
        request(app)
            .post(path)
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
    it('responses with 400 when product is already in the cart', (done) => {
        request(app)
            .post(path)
            .send(data)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect(`"Product ${data["userId"]} is already in the cart"`)
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