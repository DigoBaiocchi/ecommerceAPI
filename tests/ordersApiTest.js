const request = require('supertest');
const { app } = require('../app');

describe('GET /orders', () => {
    const path = '/orders'
    it('Responses with 200 when all orders are loaded from database', (done) => {
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

describe('GET /orders/:userId', () => {
    const userId = 6;
    const path = `/orders/${userId}`;
    const badUserId = 1;
    const badPath = `/orders/${badUserId}`;
    it('Responses with 200 when all orders from user was loaded from database', (done) => {
        request(app)
            .get(path)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(`"All orders for user ${userId} were loaded"`)
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('Responses with 400 user does not exists', (done) => {
        request(app)
            .get(badPath)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect(`"User id ${badUserId} does not exists"`)
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
});

describe('GET /orders/userId/orderId', () => {
    const userId = 6;
    const orderId = 2;
    const path = `/orders/${userId}/${orderId}`;
    const badUserId = 1;
    const badOrderId = 1000;
    const badUserPath = `/orders/${badUserId}/${orderId}`;
    const badOrderPath = `/orders/${userId}/${badOrderId}`;

    it('responses with 200 when order has been updated', (done) => {
        request(app)
            .get(path)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(`"Order ${orderId} has been selected for user ${userId}"`)
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('responses with 400 when user id was not found', (done) => {
        request(app)
            .get(badUserPath)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect(`"User id ${badUserId} was not found"`)
            .end((err) => {
                if(err) return done(err);
                done();
            })
    });
    it('responses with 400 when order number was not found', (done) => {
        request(app)
            .get(badOrderPath)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect(`"Order number ${badOrderId} was not found"`)
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
});

describe('PUT /orders/userId/orderId', () => {
    const userId = 6;
    const orderId = 2;
    const path = `/orders/${userId}/${orderId}`;
    const badUserId = 1;
    const badOrderId = 1000;
    const badUserPath = `/orders/${badUserId}/${orderId}`;
    const badOrderPath = `/orders/${userId}/${badOrderId}`;
    const body = {"orderStatus": "Completed"};

    it('responses with 200 when order has been updated', (done) => {
        request(app)
            .patch(path)
            .send(body)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(`"Order ${orderId} has been updated for user ${userId}"`)
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('responses with 400 when user id was not found', (done) => {
        request(app)
            .patch(badUserPath)
            .send(body)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect(`"User id ${badUserId} was not found"`)
            .end((err) => {
                if(err) return done(err);
                done();
            })
    });
    it('responses with 400 when order number was not found', (done) => {
        request(app)
            .patch(badOrderPath)
            .send(body)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect(`"Order number ${badOrderId} was not found"`)
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('responses with 400 when order status was provided', (done) => {
        request(app)
            .patch(path)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect(`"No order status was provided"`)
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
});

describe('DELETE /orders/:userId/:orderId', () => {
    const userId = 6;
    const orderId = 2;
    const path = `/orders/${userId}/${orderId}`;
    const badUserId = 1;
    const badOrderId = 1000;
    const badUserPath = `/orders/${badUserId}/${orderId}`;
    const badOrderPath = `/orders/${userId}/${badOrderId}`;

    it('responses with 200 when order was deleted', (done) => {
        request(app)
            .delete(path)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(`"Order number ${orderId} was deleted"`)
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('responses with 400 when user id was not found', (done) => {
        request(app)
            .delete(badUserPath)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect(`"User id ${badUserId} was not found"`)
            .end((err) => {
                if(err) return done(err);
                done();
            })
    });
    it('responses with 400 when order number was not found', (done) => {
        request(app)
            .delete(badOrderPath)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect(`"Order number ${badOrderId} was not found"`)
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
});

describe('DELETE /orders/:userId', () => {
    const userId = 6;
    const path = `/orders/${userId}`;
    const badUserId = 1;
    const badUserPath = `/orders/${badUserId}`;

    it('responses with 200 when all orders were delete from a user', (done) => {
        request(app)
            .delete(path)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(`"All user's ${userId} orders were deleted"`)
            .end((err) => {
                if (err) return done(err);
                done();
            })
    });
    it('responses with 400 when user id was not found', (done) => {
        request(app)
            .delete(badUserPath)
            .set('accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .expect(`"User id ${badUserId} was not found"`)
            .end((err) => {
                if(err) return done(err);
                done();
            })
    });
});



