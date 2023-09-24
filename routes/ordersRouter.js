const express = require('express');
const router = express.Router();
const { Database } = require('../db/databaseQueries');

router.get('/', (req, res, next) => {
    return res.status(200).json(`All orders are loaded`);
});

module.exports = router;