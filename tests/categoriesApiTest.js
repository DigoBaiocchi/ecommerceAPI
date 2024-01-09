const request = require('supertest');
const app = require('../app');

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
            .expect({ "message": `Category successfully created` })
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
            .expect({ "error": 'Category name not provided' })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });

    it('responses with 401 when category already exists', (done) => {
        request(app)
            .post('/categories/add-category')
            .send({"name": existentCategory})
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
            .expect({ "error": 'Category already exists' })
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
            .expect({ "message": `Category name has been updated` })
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
            .expect({ "error": `Name not provided for category` })
            .end((err) => {
                if(err) return done(err);
                done();
            })
    });

    it('responses with 401 when category does not exist', (done) => {
        request(app)
            .put('/categories/edit-category')
            .send({"id": 1000, "name": newName})
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
            .expect({ "error": `Category does not exist` })
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
            .expect({ "message": "Category has been deleted" })
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
            .expect({ "error": "Category does not exist" })
            .end((err) => {
                if(err) return done(err);
                done();
            })
    });
});

describe('GET /categories', () => {
    it('responses with 200 with all categories', (done) => {
        request(app)
            .get('/categories')
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({ message: 'All categories are loaded', "data": [{ "id": 2, "name": "Fish"}] })
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
            .expect({ "message": `Category selected`, "data": { "id": 2, "name": "Fish"} })
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
            .expect({ "error": `Category id not found` })
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
});