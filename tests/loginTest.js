// Setting up Supertest
const request = require('supertest');
const chai = require('chai');
const app = require('../app');

const expect = chai.expect;

describe('GET /auth/login', () => {
    const path = '/auth/login';
    it('responses with 200 and request user email and password', (done) => {
        request(app)
            .get(path)
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({
                "message": `Enter your email and password`
            })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
});

describe('POST /auth/login', () => {
    const path = '/auth/login';
    const userCredentials = {
        "email": "rodrigo@gmail.com",
        "password": "123456",
        "checkoutData": []
    };

    it('responses with 200 when user is successfully logged in', async () => {
        const loginRes = await request(app)
            .post(path)
            .send(userCredentials);
        expect(loginRes.status).to.equal(200);

        expect(loginRes.body).to.have.property('message', 'User is logged in');
    });

});
    
describe('GET /auth/logout', () => {
    const path = '/auth/logout';
    it('responses with 200 when user is successfully logged out', async () => {
        const logoutRes = await request(app)
            .get(path)
        expect(logoutRes.status).to.equal(302);
    });
});
