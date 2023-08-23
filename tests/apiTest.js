// Setting up Supertest
const request = require('supertest');
const app = require('../app');
const { Database } = require('../db/databaseQueries');

describe('POST /register', () => {
    const correctData = {"id": "1", "username": 'DigoBaiocchi', "email": 'rodrigo@gmail.com', "password": "123456"};
    const incorrectData = {"email": "rodrigo@gmail.com", "password": "123456"};
    const noPasswordProvided = {"username": "OtherUser", "email": "newuser@gmail.com", "password": ""};
    const existentUser = {"username": "Gambito", "email": "gambito@gmail.com", "password": "123456"};
    const existentEmail = {"id": "1", "username": 'Rodrigos', "email": 'rodrigo@gmail.com', "password": "123456"};
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
    it('responses with 400 not created when username or email not provided', (done) => {
        request(app)
            .post('/register')
            .send(incorrectData)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect('"No username or email provided"')
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('responses with 400 not created when username already exists', (done) => {
        request(app)
            .post('/register')
            .send(existentUser)
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
    it('responses with 400 when password is not provided', (done) => {
        request(app)
            .post('/register')
            .send(noPasswordProvided)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect('"No password provided"')
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
    const missingPassword = {"password": ""};
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
            .send(dataToBeUpdated)
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

describe('POST /categories/add-category', async () => {
    const newCategory = "Poultry";
    const existentCategory = "Fish";
    it('responses with 201 when a category is successfully created', (done) => {
        request(app)
            .post('/categories/add-category')
            .send({"name": newCategory})
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .expect(`"Category ${newCategory} successfully created"`)
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('responses with 400 when no category was provided', (done) => {
        request(app)
            .post('/categories/add-category')
            .send({"name": ""})
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect('"Category name not provided"')
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('responses with 400 when category already exists', (done) => {
        request(app)
            .post('/categories/add-category')
            .send({"name": existentCategory})
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect('"Category already exists"')
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
});

describe('PUT /categories/edit-category', () => {
    const categoryId = 2;
    const newName = 'Fish';
    it('responses with 200 when category name is updated', (done) => {
        request(app)
            .put('/categories/edit-category')
            .send({"id": categoryId, "name": newName})
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(`"Category ${categoryId} has been updated to ${newName}"`)
            .end((err) => {
                if(err) return done(err);
                done();
            })
    });
    it('responses with 400 when no category name is provided', (done) => {
        request(app)
            .put('/categories/edit-category')
            .send({"id": categoryId, "name": ''})
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect(`"Name not provided for category ${categoryId}"`)
            .end((err) => {
                if(err) return done(err);
                done();
            })
    });
});

describe('DELETE /categories/delete-category/:name', () => {
    const newCategory = "Poultry";
    const wrongCategory = "WrongCategory";
    it('responses with 200 when category is successfully deleted', (done) => {
        request(app)
            .delete(`/categories/delete-category/${newCategory}`)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(`"Category has been deleted"`)
            .end((err) => {
                if(err) return done(err);
                done();
            })
    });
    it('responses with 400 when category is not found', (done) => {
        request(app)
            .delete(`/categories/delete-category/${wrongCategory}`)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect('"Category does not exist"')
            .end((err) => {
                if(err) return done(err);
                done();
            })
    });
});

describe('GET /categories', () => {
    const categories = Database.getAllCategories();
    it('responses with 200 with all categories', (done) => {
        request(app)
            .get('/categories')
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect('"All categories are loaded"')
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
});

describe('GET /categories/:id', () => {
    const categoryId = 2;
    const wrongCategoryId = 1;
    it('responses with 200 with correct category', (done) => {
        request(app)
            .get(`/categories/${categoryId}`)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(`"Category ${categoryId} selected"`)
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('responses with 400 when category does not exist', (done) => {
        request(app)
            .get(`/categories/${wrongCategoryId}`)
            .set('accept', 'application/json')
            .expect(400)
            .expect(`"Category ${wrongCategoryId} not found"`)
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
});

// describe('GET /products', () => {
//     // const categories = Database.getAllCategories();
//     it('responses with 200 with all products', (done) => {
//         request(app)
//             .get('/products')
//             .set('accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(200)
//             .expect('"All products are loaded"')
//             .end((err) => {
//                 if (err) return done(err);
//                 done();
//             })
//     });
// });

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

