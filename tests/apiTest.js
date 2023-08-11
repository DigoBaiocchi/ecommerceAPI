// Setting up Supertest
const request = require('supertest');
const app = require('../app');

describe('POST /register', () => {
    const correctData = {"username": "DigoBaiocchi", "email": "myemail@myemail.com", "password": "123456"};
    const incorrectData = {"email": "myemail@myemail.com", "password": "123456"};
    const existentUsername = {"id": "1", "username": 'Rodrigo', "email": 'rodrigo@gmail.com', "password": "123456", "administrator": "true"};
    const existentEmail = {"id": "1", "username": 'Rodrigos', "email": 'rodrigo@gmail.com', "password": "123456", "administrator": "true"};
    it('responds with 201 created', (done) => {
        request(app)
            .post('/register')
            .send(correctData)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .expect(`"User successfully created"`)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });
    it('responses with 400 not created when username, email or password not provided', (done) => {
        request(app)
            .post('/register')
            .send(incorrectData)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect('"User not created"')
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('responses with 400 not created when username already exists', (done) => {
        request(app)
            .post('/register')
            .send(existentUsername)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect('"Username already exists"')
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('responses with 400 not created when email already exists', (done) => {
        request(app)
            .post('/register')
            .send(existentEmail)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect('"Email already exists"')
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
});