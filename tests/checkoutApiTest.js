const request = require('supertest');
const app = require('../app');

const data = {
    "userId": 6,
    "productId": 37,
    "totalUnits": 1,
    "price": '$14.20'
};

const wrongUserIdData = {
    "userId": 1,
    "productId": 37,
    "totalUnits": 1,
    "price": '$14.20'
};

describe('GET /checkout', () => {
    const path = '/checkout';
    const goodData = {'userId': data['userId']};
    const badData = {'userId': wrongUserIdData['userId']};
    it('responses with 200 with all products in checkout', (done) => {
        request(app)
            .get(path)
            .send(goodData)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(`"All products in the cart are loaded for user ${goodData['userId']}"`)
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('responses with 400 when no products are found for user', (done) => {
        request(app)
            .get(path)
            .send(badData)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect(`"User ${badData['userId']} has no products in the cart"`)
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
});

describe('POST /checkout', () => {
    const path = '/checkout';
    it('responses with 201 when order is created from checkout and products are cleared from cart', (done) => {
        request(app)
            .post(path)
            .send(data)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .expect(`"Order was create with products from id ${data['userId']}'s cart"`)
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('responses with 400 when no user id was found', (done) => {
        request(app)
            .post(path)
            .send(wrongUserIdData)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect(`"User id ${wrongUserIdData['userId']} was not found"`)
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
});

// describe('')