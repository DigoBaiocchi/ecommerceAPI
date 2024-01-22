const request = require('supertest');
const app = require('../app');

const userData = {
    "email": "gambito@gmail.com",
    "password": "12345",
    "checkoutData": []
};

const userInfo = {
    "user_id": 6,
    "first_name": "Gambito",
    "last_name": "Puppers",
    "address1": "500 puppie Ave",
    "address2": "",
    "city": "Toronto",
    "province": "ON",
    "postal_code": "POP 1E1",
    "credit_card_number": "1234567891234567",
    "credit_card_exp_date": "01/26"
};

const missingFirstName = {
    "user_id": 6,
    "first_name": "",
    "last_name": "Puppers",
    "address1": "500 puppie Ave",
    "address2": "",
    "city": "Toronto",
    "province": "ON",
    "postal_code": "POP 1E1",
    "credit_card_number": "1234567891234567",
    "credit_card_exp_date": "01/26"
};

const missingLastName = {
    "user_id": 6,
    "first_name": "Gambito",
    "last_name": "",
    "address1": "500 puppie Ave",
    "address2": "",
    "city": "Toronto",
    "province": "ON",
    "postal_code": "POP 1E1",
    "credit_card_number": "1234567891234567",
    "credit_card_exp_date": "01/26"
};

const missingAddress1 = {
    "user_id": 6,
    "first_name": "Gambito",
    "last_name": "Puppers",
    "address1": "",
    "address2": "",
    "city": "Toronto",
    "province": "ON",
    "postal_code": "POP 1E1",
    "credit_card_number": "1234567891234567",
    "credit_card_exp_date": "01/26"
};

const missingCity = {
    "user_id": 6,
    "first_name": "Gambito",
    "last_name": "Puppers",
    "address1": "500 puppie Ave",
    "address2": "",
    "city": "",
    "province": "ON",
    "postal_code": "POP 1E1",
    "credit_card_number": "1234567891234567",
    "credit_card_exp_date": "01/26"
};

const missingProvince = {
    "user_id": 6,
    "first_name": "Gambito",
    "last_name": "Puppers",
    "address1": "500 puppie Ave",
    "address2": "",
    "city": "Toronto",
    "province": "",
    "postal_code": "POP 1E1",
    "credit_card_number": "1234567891234567",
    "credit_card_exp_date": "01/26"
};

const missingPostalCode = {
    "user_id": 6,
    "first_name": "Gambito",
    "last_name": "Puppers",
    "address1": "500 puppie Ave",
    "address2": "",
    "city": "Toronto",
    "province": "ON",
    "postal_code": "",
    "credit_card_number": "1234567891234567",
    "credit_card_exp_date": "01/26"
};

const missingCreditCard = {
    "user_id": 6,
    "first_name": "Gambito",
    "last_name": "Puppers",
    "address1": "500 puppie Ave",
    "address2": "",
    "city": "Toronto",
    "province": "ON",
    "postal_code": "POP 1E1",
    "credit_card_number": "",
    "credit_card_exp_date": "01/26"
};

const missingExpData = {
    "user_id": 6,
    "first_name": "Gambito",
    "last_name": "Puppers",
    "address1": "500 puppie Ave",
    "address2": "",
    "city": "Toronto",
    "province": "ON",
    "postal_code": "POP 1E1",
    "credit_card_number": "1234567891234567",
    "credit_card_exp_date": ""
};

let cookie;
let newCategoryData;
let productData;
let productData2;
let updatedProductData;
let updatedProductData2;

before((done) => {
    // login user
    request(app)
    .post('/auth/login/')
    .send(userData)
    .end((err, res) => {
        if (err) return done(err);
        cookie = res.headers['set-cookie']

        // adding mock category
        // request(app)
        //     .post('/categories/add-category')
        //     .send({'name': 'newCategory'})
        //     .set('accept', 'application/json')
        //     .end((err) => {
        //         if (err) return done(err);

        //         // get added mock category data
        //         Database.getCategoryByName('newCategory')
        //             .then(categoryData => {
        //                 newCategoryData = categoryData;
        //                 productData = {
        //                     'categoryId': newCategoryData.id,
        //                     ...databaseProductData
        //                 };
        //                 productData2 = {
        //                     'categoryId': newCategoryData.id,
        //                     ...databaseProductData2
        //                 }

        //                 // adding mock product
        //                 request(app)
        //                     .post(`/products/add-product`)
        //                     .send(productData)
        //                     .set('accept', 'application/json')
        //                     .end((err) => {
        //                         if (err) return done(err);
                                
        //                         // get added mock product data
        //                         Database.getProductByName(productData.name)
        //                             .then(productData => {
        //                                 updatedProductData = productData;

        //                                 // updating mock data
        //                                 data = {
        //                                     ...data,
        //                                     "productId": productData.id
        //                                 };
        //                                 reduceQtyData = {
        //                                     ...reduceQtyData,
        //                                     "productId": productData.id
        //                                 };
        //                                 invalidQtyData = {
        //                                     ...invalidQtyData,
        //                                     "productId": productData.id
        //                                 };
        //                             });
        //                         request(app)
        //                             .post(`/products/add-product`)
        //                             .send(productData2)
        //                             .set('accept', 'application/json')
        //                             .end((err) => {
        //                                 if (err) return done(err);

        //                                 // get second mock product data
        //                                 Database.getProductByName(productData2.name)
        //                                     .then(productData2 => {
        //                                         updatedProductData2 = productData2;

        //                                         // updating mock data2
        //                                         data2 = {
        //                                             ...data2,
        //                                             "productId": productData2.id
        //                                         };
                                                
                                                done(); 
        //                                     });
        //                             })
        //                     })
        //             })
        //     })
    })
});

describe('POST /user', () => {
    const path = "/user";

    it('responses with 201 when user information is submitted successfully', (done) => {
        request(app)
            .post(path)
            .set('Cookie', cookie)
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

    it('responses with 401 when user is not logged in', (done) => {
        request(app)
            .post(path)
            .send(userInfo)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
            .expect({ "error": `User is not logged in` })
            .end((err) => {
                if (err) done(err);
                done();
            })
    });

    it('responses with 400 when no first name is provided', (done) => {
        request(app)
            .post(path)
            .set('Cookie', cookie)
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
            .set('Cookie', cookie)
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
            .set('Cookie', cookie)
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
            .set('Cookie', cookie)
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
            .set('Cookie', cookie)
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
            .set('Cookie', cookie)
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
            .set('Cookie', cookie)
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
            .set('Cookie', cookie)
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

describe('GET /user/', () => {
    const path = `/user/`;

    it('responses with 200 when user info is loaded', (done) => {
        request(app)
            .get(path)
            .set('Cookie', cookie)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({ "message": `User info was loaded`, "data": userInfo })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });

    it('responses with 401 when user is not logged in', (done) => {
        request(app)
            .get(path)
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

describe('PUT /user/update-info', () => {
    const path = `/user/update-info`;

    it('responses with 200 when user info is updated', (done) => {
        request(app)
            .put(path)
            .set('Cookie', cookie)
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

    it('responses with 401 when user is not logged in', (done) => {
        request(app)
            .put(path)
            .send(userInfo)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
            .expect({ "error": `User is not logged in` })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });

    it('responses with 400 when no first name is provided', (done) => {
        request(app)
            .put(path)
            .set('Cookie', cookie)
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
            .put(path)
            .set('Cookie', cookie)
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
            .put(path)
            .set('Cookie', cookie)
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
            .put(path)
            .set('Cookie', cookie)
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
            .put(path)
            .set('Cookie', cookie)
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
            .put(path)
            .set('Cookie', cookie)
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
            .put(path)
            .set('Cookie', cookie)
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
            .put(path)
            .set('Cookie', cookie)
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

describe('DELETE /user/delete-user/', () => {
    const path = `/user/delete-user/`;

    it('responses with 200 when a user was deleted', (done) => {
        request(app)
            .delete(path)
            .set('Cookie', cookie)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({ "message": `User info was successfully deleted` })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });

    it('responses with 401 when user is not logged in', (done) => {
        request(app)
            .delete(path)
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
