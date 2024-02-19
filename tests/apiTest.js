const request = require('supertest');
const { server } = require('../app');
const { Database } = require('../db/databaseQueries');

require('./cartApiTest');
require('./categoriesApiTest');

after((done) => {
    server.close(err => {
        if (err) return done(err);
        done();
    });
});