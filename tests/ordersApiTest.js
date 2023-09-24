const request = require('supertest');
const app = require('../app');

describe('GET /orders', () => {
    const path = '/orders'
    it('Select all the orders from database', (done) => {
        request(app)
            .get(path)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(`"All orders are loaded"`)
            .end((err) => {
                if(err) return done(err);
                done();
            })
    });
});