const request = require('supertest');
const app = require('../app');

const userInfo = {
    "userId": 6,
    "firstName": "Gambito",
    "lastName": "Puppers",
    "address1": "500 puppie Ave",
    "address2": "",
    "city": "Toronto",
    "province": "ON",
    "postalCode": "POP 1E1",
    "creditCard": "1234567891234567",
    "expDate": "01/26"
}
const wrongUserId = {
    "userId": 1,
    "firstName": "Gambito",
    "lastName": "Puppers",
    "address1": "500 puppie Ave",
    "address2": "",
    "city": "Toronto",
    "province": "ON",
    "postalCode": "POP 1E1",
    "creditCard": "1234567891234567",
    "expDate": "01/26"
}
const missingFirstName = {
    "userId": 6,
    "firstName": "",
    "lastName": "Puppers",
    "address1": "500 puppie Ave",
    "address2": "",
    "city": "Toronto",
    "province": "ON",
    "postalCode": "POP 1E1",
    "creditCard": "1234567891234567",
    "expDate": "01/26"
}
const missingLastName = {
    "userId": 6,
    "firstName": "Gambito",
    "lastName": "",
    "address1": "500 puppie Ave",
    "address2": "",
    "city": "Toronto",
    "province": "ON",
    "postalCode": "POP 1E1",
    "creditCard": "1234567891234567",
    "expDate": "01/26"
}
const missingAddress1 = {
    "userId": 6,
    "firstName": "Gambito",
    "lastName": "Puppers",
    "address1": "",
    "address2": "",
    "city": "Toronto",
    "province": "ON",
    "postalCode": "POP 1E1",
    "creditCard": "1234567891234567",
    "expDate": "01/26"
}
const missingCity = {
    "userId": 6,
    "firstName": "Gambito",
    "lastName": "Puppers",
    "address1": "500 puppie Ave",
    "address2": "",
    "city": "",
    "province": "ON",
    "postalCode": "POP 1E1",
    "creditCard": "1234567891234567",
    "expDate": "01/26"
}
const missingProvince = {
    "userId": 6,
    "firstName": "Gambito",
    "lastName": "Puppers",
    "address1": "500 puppie Ave",
    "address2": "",
    "city": "Toronto",
    "province": "",
    "postalCode": "POP 1E1",
    "creditCard": "1234567891234567",
    "expDate": "01/26"
}
const missingPostalCode = {
    "userId": 6,
    "firstName": "Gambito",
    "lastName": "Puppers",
    "address1": "500 puppie Ave",
    "address2": "",
    "city": "Toronto",
    "province": "ON",
    "postalCode": "",
    "creditCard": "1234567891234567",
    "expDate": "01/26"
}
const missingCreditCard = {
    "userId": 6,
    "firstName": "Gambito",
    "lastName": "Puppers",
    "address1": "500 puppie Ave",
    "address2": "",
    "city": "Toronto",
    "province": "ON",
    "postalCode": "POP 1E1",
    "creditCard": "",
    "expDate": "01/26"
}
const missingExpData = {
    "userId": 6,
    "firstName": "Gambito",
    "lastName": "Puppers",
    "address1": "500 puppie Ave",
    "address2": "",
    "city": "Toronto",
    "province": "ON",
    "postalCode": "POP 1E1",
    "creditCard": "1234567891234567",
    "expDate": ""
}

describe('POST /user', () => {
    const path = "/user"
    it('responses with 201 when user information is submitted successfully', (done) => {
        request(app)
            .post(path)
            .send(userInfo)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .expect({ "message": `User info has been added` })
            .end((err) => {
                if (err) return done(err);
                done(err);
            })
    });
    it('responses with 400 when userId is not valid', (done) => {
        request(app)
            .post(path)
            .send(wrongUserId)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect({ "error": `User id not found` })
            .end((err) => {
                if (err) done(err);
                done();
            })
    });
    it('responses with 400 when no first name is provided', (done) => {
        request(app)
            .post(path)
            .send(missingFirstName)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect({ "error": 'Missing required information' })
            .end((err) => {
                if(err) return done(err);
                done();
            })
    });
    it('responses with 400 when no last name is provided', (done) => {
        request(app)
            .post(path)
            .send(missingLastName)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect({ "error": 'Missing required information' })
            .end((err) => {
                if(err) return done(err);
                done();
            })
    });
    it('responses with 400 when no address1 is provided', (done) => {
        request(app)
            .post(path)
            .send(missingAddress1)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect({ "error": 'Missing required information' })
            .end((err) => {
                if(err) return done(err);
                done();
            })
    });
    it('responses with 400 when no city is provided', (done) => {
        request(app)
            .post(path)
            .send(missingCity)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect({ "error": 'Missing required information' })
            .end((err) => {
                if(err) return done(err);
                done();
            })
    });
    it('responses with 400 when no province is provided', (done) => {
        request(app)
            .post(path)
            .send(missingProvince)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect({ "error": 'Missing required information' })
            .end((err) => {
                if(err) return done(err);
                done();
            })
    });
    it('responses with 400 when no postal code is provided', (done) => {
        request(app)
            .post(path)
            .send(missingPostalCode)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect({ "error": 'Missing required information' })
            .end((err) => {
                if(err) return done(err);
                done();
            })
    });
    it('responses with 400 when no credit card is provided', (done) => {
        request(app)
            .post(path)
            .send(missingCreditCard)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect({ "error": 'Missing required information' })
            .end((err) => {
                if(err) return done(err);
                done();
            })
    });
    it('responses with 400 when no exp date is provided', (done) => {
        request(app)
            .post(path)
            .send(missingExpData)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect({ "error": 'Missing required information' })
            .end((err) => {
                if(err) return done(err);
                done();
            })
    });
});

describe('GET /user/:id', () => {
    const userId = 6;
    const path = `/user/${userId}`;
    const badUserId = 1;
    const badPath = `/user/${badUserId}`;
    it('responses with 200 when user info is loaded', (done) => {
        request(app)
            .get(path)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({ "message": `User info was loaded`, data: userInfo })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('responses with 400 when user id is not valid', (done) => {
        request(app)
            .get(badPath)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect({ "error": `User was not found` })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
});

describe('PUT /user/update-info', () => {
    const path = `/user/update-info`
    it('responses with 200 when user info is updated', (done) => {
        request(app)
            .put(path)
            .send(userInfo)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({ "message": `Data has been sucessfully updated` })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('responses with 400 when user id was found', (done) => {
        request(app)
            .put(path)
            .send(wrongUserId)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect({ "error": `User was not found` })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('responses with 401 when no first name is provided', (done) => {
        request(app)
            .put(path)
            .send(missingFirstName)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
            .expect({ "error": 'Missing required information' })
            .end((err) => {
                if(err) return done(err);
                done();
            })
    });
    it('responses with 401 when no last name is provided', (done) => {
        request(app)
            .put(path)
            .send(missingLastName)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
            .expect({ "error": 'Missing required information' })
            .end((err) => {
                if(err) return done(err);
                done();
            })
    });
    it('responses with 401 when no address1 is provided', (done) => {
        request(app)
            .put(path)
            .send(missingAddress1)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
            .expect({ "error": 'Missing required information' })
            .end((err) => {
                if(err) return done(err);
                done();
            })
    });
    it('responses with 401 when no city is provided', (done) => {
        request(app)
            .put(path)
            .send(missingCity)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
            .expect({ "error": 'Missing required information' })
            .end((err) => {
                if(err) return done(err);
                done();
            })
    });
    it('responses with 401 when no province is provided', (done) => {
        request(app)
            .put(path)
            .send(missingProvince)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
            .expect({ "error": 'Missing required information' })
            .end((err) => {
                if(err) return done(err);
                done();
            })
    });
    it('responses with 401 when no postal code is provided', (done) => {
        request(app)
            .put(path)
            .send(missingPostalCode)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
            .expect({ "error": 'Missing required information' })
            .end((err) => {
                if(err) return done(err);
                done();
            })
    });
    it('responses with 401 when no credit card is provided', (done) => {
        request(app)
            .put(path)
            .send(missingCreditCard)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
            .expect({ "error": 'Missing required information' })
            .end((err) => {
                if(err) return done(err);
                done();
            })
    });
    it('responses with 401 when no exp date is provided', (done) => {
        request(app)
            .put(path)
            .send(missingExpData)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
            .expect({ "error": 'Missing required information' })
            .end((err) => {
                if(err) return done(err);
                done();
            })
    });
});

describe('DELETE /user/delete-user/:id', () => {
    const userId = 6;
    const path = `/user/delete-user/${userId}`;
    const badUserId = 1;
    const badPath = `/user/delete-user/${badUserId}`;
    it('responses with 200 when a user was deleted', (done) => {
        request(app)
            .delete(path)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({ "message": `User info was successfully deleted` })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('resposnes with 400 when user was not found', (done) => {
        request(app)
            .delete(badPath)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect({ "error": `User was not found` })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
});
