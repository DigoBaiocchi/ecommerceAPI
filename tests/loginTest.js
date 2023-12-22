// Setting up Supertest
const request = require('supertest');
const app = require('../app');

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

const otherRequest = require('superagent');
const user1 = request.agent()

describe('POST /auth/login', () => {
    const path = '/auth/login';
    const userCredentials = {
        "email": "rodrigo@gmail.com",
        "password": "123456",
        "checkoutData": []
    };

    it('responses with 200 when user is successfully logged in', (done) => {
        request(app)
            .post(path)
            .send(userCredentials)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({
                "message": `User is logged in`
            })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });

});
    
describe('GET /auth/logout', () => {
    const path = '/auth/logout';
    it('responses with 200 when user is successfully logged out', (done) => {
        request(app)
            .get(path)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
});
