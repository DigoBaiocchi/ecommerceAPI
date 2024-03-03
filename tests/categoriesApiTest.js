const request = require('supertest');
const { app, server } = require('../app');
const { Database } = require('../db/databaseQueries');

let newCategoryData;

describe("Categories api tests", () => {

    describe('POST /categories/add-category', () => {
        const newCategory = "Poultry";
        
        it('responses with 201 when a category is successfully created', (done) => {
            request(app)
            .post('/categories/add-category')
            .send({"name": newCategory})
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .expect({ "message": `Category successfully created` })
            .end(async (err) => {
                if (err) return done(err);
                newCategoryData = await Database.getItemByName("categories", newCategory);
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
            .send({"name": newCategory})
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
    
    describe('GET /categories', () => {
        it('responses with 200 with all categories', (done) => {
            request(app)
            .get('/categories')
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({ message: 'All categories are loaded', "data": [newCategoryData] })
            .end((err) => {
                    if (err) return done(err);
                    done();
                })
            });
        });
        
    describe('GET /categories/:id', () => {
        const wrongCategoryId = 0;
        it('responses with 200 with correct category', (done) => {
            request(app)
            .get(`/categories/${newCategoryData.id}`)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({ "message": `Category data was loaded`, "data": newCategoryData })
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
            .expect({ "error": `Category was not found` })
            .end((err) => {
                if (err) return done(err);
                done();
            })
        });
    });
    
    describe('PATCH /categories/edit-category', () => {
        const categoryId = 1;
        const newName = 'Fish';
        it('responses with 200 when category name is updated', (done) => {
            request(app)
            .patch('/categories/edit-category')
            .send({"id": newCategoryData.id, "name": newName})
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
            .patch('/categories/edit-category')
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
            .patch('/categories/edit-category')
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
    
    describe('DELETE /categories/delete-category/:id', () => {
        const wrongCategory = 0;
        it('responses with 200 when category is successfully deleted', (done) => {
            request(app)
            .delete(`/categories/delete-category/${newCategoryData.id}`)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect({ "message": "Category has been deleted" })
            .end((err) => {
                if(err) return done(err);
                done();
            })
        })
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
    
    // after(done => {
    //     server.close(err => {
    //         if (err) return done(err);
    //         done();
    //     });
    // });
});
