const request = require('supertest');
const { app } = require('../app');
const { newUserData } = require('./mockData/mockData');

let cookie;

const data = {
    "userId": 6,
    "productId": 37,
    "totalUnits": 1,
    "price": '$5.99'
};

const wrongUserIdData = {
    "userId": 1,
    "productId": 37,
    "totalUnits": 1,
    "price": '$14.20'
};

before((done) => {
    // login user
    request(app)
        .post('/auth/login/')
        .send(newUserData)
        .end((err, res) => {
            if (err) return done(err);
            cookie = res.headers['set-cookie'];
            done();
        })
});

describe('POST /checkout', () => {
    const path = '/checkout';
    it('responses with 201 when order is created from checkout and products are cleared from cart', (done) => {
        request(app)
        .post(path)
        .set('Cookie', cookie)
        .send({'checkoutData': [data]})
        .set('accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .expect({ "message": `Order successfully created` })
        .end((err) => {
            if (err) return done(err);
            done();
        })
    });
    it('responses with 402 when no user has no products in their cart', (done) => {
        request(app)
            .post(path)
            .set('Cookie', cookie)
            .send({'checkoutData': []})
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(402)
            .expect({ "error": `User has no products in their cart` })
            .end((err) => {
                if (err) return done(err);
                done();
            })
        });
    it('responses with 401 when user is not logged in', (done) => {
        request(app)
        .post(path)
        .send({'checkoutData': [data]})
        .set('accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(401)
        .expect({ "error": `User is not logged in` })
        .end((err) => {
            if (err) return done(err);
            done();
        })
    });
});

describe('GET /checkout', () => {
    const path = '/checkout';
    const goodUserIdData = {'userId': data['userId']};
    const badUserIdData = {'userId': wrongUserIdData['userId']};
    it('responses with 200 with all products in checkout', (done) => {
        request(app)
            .get(path)
            .set('Cookie', cookie)
            // .send(goodUserIdData)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({ message: `All products from user's cart are loaded`, data: data })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('responses with 400 when no products are found for user', (done) => {
        request(app)
            .get(path)
            .set('Cookie', cookie)
            // .send(badUserIdData)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect({ "error": `User has no products in the cart` })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('responses with 401 when user is not logged in', (done) => {
        request(app)
            .post(path)
            .send(goodUserIdData)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
            .expect({ "error": `User is not logged in` })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
});