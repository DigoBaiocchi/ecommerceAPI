const express = require('express');
const router = express.Router();
const { Database } = require('../db/databaseQueries');

router.get('/', async (req, res, next) => {
    const { userId } = req.body;
    const validUserId = await Database.selectUserById(userId);
    
    if(!validUserId) {
        return res.status(400).json(`User ${userId} has no products in the cart`)
    }

    const cartData = await Database.getProductInfoWithPriceFromCart(userId);
    return res.status(200).json(`All products in the cart are loaded for user ${userId}`);
});

router.post('/', async (req, res, next) => {
    const { userId, productId, totalUnits, price } = req.body;
    
    const validUserId = userId === 6;
    if (!validUserId) {
        return res.status(400).json(`User id ${userId} was not found`);
    }

    const cartData = await Database.getProductInfoWithPriceFromCart(userId);

    cartData.forEach(async cart => {
        const createOrder = await Database.createOrder(1, userId, productId, totalUnits, price, 'Pending');
    })
    return res.status(201).json(`Order was create with products from id ${userId}'s cart`);
});

module.exports = router;