// Setting up Supertest
const request = require('supertest');
const { app, server } = require('../app');
const { Database } = require('../db/databaseQueries');
const { newUserMockData } = require('./mockData/mockData');

let newUserData;

after((done) => {
    server.close(err => {
        if (err) return done(err);
        done();
    });
});

describe('POST /register', () => {
    it('responds with 201 created', (done) => {
        request(app)
            .post('/register')
            .send(newUserMockData.newUser)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .expect({
                "message": `User successfully created`
            })
            .end(async (err) => {
                if (err) return done(err);
                newUserData = await Database.selectUserByEmail(newUserMockData.newUser.email);
                done();
            });
    });

    it('responses with 400 not created when username or email not provided', (done) => {
        request(app)
            .post('/register')
            .send(newUserMockData.incorrectData)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect({
                "error": `No username or email provided`
            })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });

    it('responses with 401 not created when username already exists', (done) => {
        request(app)
            .post('/register')
            .send(newUserData)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
            .expect({
                "error": `Username already exists`
            })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });

    it('responses with 402 not created when email already exists', (done) => {
        request(app)
            .post('/register')
            .send(newUserMockData.existentEmail)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(402)
            .expect({
                "error": `Email already exists`
            })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });

    it('responses with 403 when password is not provided', (done) => {
        request(app)
            .post('/register')
            .send(newUserMockData.noPasswordProvided)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(403)
            .expect({
                "error": `No password provided`
            })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
});

describe('GET /register/:email', () => {
    const wrongEmail = 'somewrongemail@gmail.com'

    it('responses with 200 when finding email provided in the database', (done) => {
        request(app)
            .get(`/register/${newUserMockData.newUser.email}`)
            .set('accept', 'application/json')
            .expect('Content-type', /json/)
            .expect(200)
            .expect({
                "message": `Email was found in the database`,
                "userData": newUserData
            })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });

    it('responses with 400 when not finding email provided in the database', (done) => {
        request(app)
        .get(`/register/${wrongEmail}`)
        .set('accept', 'application/json')
        .expect('Content-type', /json/)
        .expect(400)
        .expect({
            "error": `Email was not found in the database`
        })
        .end((err) => {
            if (err) return done(err);
            done();
        })
    });
});

describe('PUT /register/:email', () => {
    const dataToBeUpdated = {"password": "654321"};
    const missingPassword = {"password": ""};
    
    const wrongEmail = 'emailnotindb@email.com'
    it('responses with 200 password is updated', (done) => {
        request(app)
            .put(`/register/${newUserData.email}`)
            .send(dataToBeUpdated)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({
                "message": `Password was successfully updated`
            })
            .end((err) => {
                if (err) return done(err);
                console.log(newUserData);
                done();
            })
    });

    it('responses with 400 when no password is provided', (done) => {
        request(app)
            .put(`/register/${newUserData.email}`)
            .send(missingPassword)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
            .expect({
                "error": `Password was not updated`
            })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });

    it('responses with 400 when email is not found in db', (done) => {
        request(app)
            .put(`/register/${wrongEmail}`)
            .send(dataToBeUpdated)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect({
                "error": `Email was not found in the database`
            })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
});

describe('DELETE /register/:email', () => {
    const invalidEmail = '""';

    it('responses with 200 when user was deleted', (done) => {
        request(app)
            .delete(`/register/${newUserData.email}`)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({
                "message": `User was successfully delete`
            })
            .end((err) => {
                if (err) return done(err);
                console.log(newUserData.email);
                done();
            })
    });
    
    it('responses with 400 when email was not found', (done) => {
        request(app)
            .delete(`/register/${invalidEmail}`)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect({
                "error": `User was not deleted`
            })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    })
});