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
    "productId": 3,
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
});