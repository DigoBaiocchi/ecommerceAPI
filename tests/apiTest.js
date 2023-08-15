// Setting up Supertest
const request = require('supertest');
const app = require('../app');

describe('POST /register', () => {
    const correctData = {"username": "DigoBaiocchi", "email": "rodrigo@gmail.com", "password": "123456"};
    const incorrectData = {"email": "rodrigo@gmail.com", "password": "123456"};
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

describe('GET /register/:email', () => {
    const email = 'rodrigo@gmail.com';
    const wrongEmail = 'somewrongemail@gmail.com'
    it('responses with 200 when finding email provided in the database', (done) => {
        request(app)
            .get(`/register/${email}`)
            .set('accept', 'application/json')
            .expect('Content-type', /json/)
            .expect(200)
            .expect(`"User found with email ${email}"`)
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
        .expect(`"User not found with email ${wrongEmail}"`)
        .end((err) => {
            if (err) return done(err);
            done();
        })
    });
});

describe('PUT /register/:email', () => {
    const dataToBeUpdated = {"password": "654321"};
    const missingPassword = {"Password": ""};
    const email = 'rodrigo@gmail.com';
    const wrongEmail = 'emailnotindb@email.com'
    it('responses with 200 password is updated', (done) => {
        request(app)
            .put(`/register/${email}`)
            .send(dataToBeUpdated)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({
                "userUpdated": true,
                "message": `password updated for email ${email}`
            })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('responses with 400 when no password is provided', (done) => {
        request(app)
            .put(`/register/${email}`)
            .send(missingPassword)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect({
                "userUpdated": false,
                "message": `password not updated for email ${email}`
            })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('responses with 400 when email is not found in db', (done) => {
        request(app)
            .put(`/register/${wrongEmail}`)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect({
                "userUpdated": false,
                "message": `email ${wrongEmail} not found`
            })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
});

describe('DELETE /register/:email', () => {
    const email = 'rodrigo@gmail.com';
    const invalidEmail = '""';
    it('responses with 200 when user was deleted', (done) => {
        request(app)
            .delete(`/register/${email}`)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({"userDeleted": true})
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('responses with 400 when email was not found', (done) => {
        request(app)
            .delete(`/register/${invalidEmail}`)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect({"userDeleted": false})
            .end((err) => {
                if (err) return done(err);
                done();
            })
    })
});

// describe('POST /login', () => {
//     const completeData = {'email': 'rodrigo@gmail.com', 'password': '123456'};
//     const missingEmail = {'password': '123456'};
//     const missingPassword = {'email': 'rodrigo@gmail.com'};
//     it('responses with 200 when email and password are provided for authentication', (done) => {
//         request(app)
//             .post('/login')
//             .send(completeData)
//             .set('accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(200)
//             .expect(completeData)
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             })
//     });
//     it('responses with 400 missing email', (done) => {
//         request(app)
//             .post('/login')
//             .send(missingEmail)
//             .set('accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(400)
//             .expect('"Email is required for authentication"')
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             })
//     });
//     it('responses with 400 missing password', (done) => {
//         request(app)
//             .post('/login')
//             .send(missingPassword)
//             .set('accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(400)
//             .expect('"Password is required for authentication"')
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             })
//     });
// });

