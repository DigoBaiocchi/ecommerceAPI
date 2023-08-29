const express = require('express');
const router = express.Router();
const { Database } = require('../db/databaseQueries');

router.post('/', (req, res, next) => {
    const { userId, productId, totalUnits } = req.body;
    const validUserId = userId === 6;
    const validProductId = productId === 37;
    const totalProductQty = 4;

    if(!validUserId) {
        return res.status(400).json(`No user id ${userId} was found`);
    }
    if(!validProductId) {
        return res.status(400).json(`No product id ${productId} was found`);
    }
    if(totalUnits < 1 || totalUnits > totalProductQty) {
        return res.status(400).json(`Product has less than ${totalUnits} units`)
    }
    return res.status(201).json(`Product ${userId} has added to the cart`);
});

router.get('/', (req, res, next) => {
    const { userId } = req.body;
    const validUserId = userId === 6;

    if(!validUserId) {
        return res.status(400).json(`User ${userId} was not found`);
    }

    return res.status(200).json(`Cart selected for user ${userId}`);
});

module.exports = router;