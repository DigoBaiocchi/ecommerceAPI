const request = require('supertest');
const { server } = require('../app');
const { Database } = require('../db/databaseQueries');

require('./cartApiTest');
require('./categoriesApiTest');
require('./productsApiTest');

// Register user
// Add user info
// Add category
// Add product
// Add product to cart
// Add data from cart to checkout
// Create order from checkout data
// Delete order
// Delete cart
// Delete product
// Delete category
// Delete user info
// Delete user

after((done) => {
    server.close(err => {
        if (err) return done(err);
        done();
    });
});