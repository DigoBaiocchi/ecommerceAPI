const express = require('express');
const router = express.Router();
const { Database } = require('../db/databaseQueries');

router.get('/', async (req, res, next) => {
    const { userId } = req.body;
    const validUserId = await Database.selectUserById(userId);
    
    if(!validUserId) {
        return res.status(400).json({msg: `User ${userId} has no products in the cart`})
    }

    const cartData = await Database.getProductInfoWithPriceFromCart(userId);
    return res.status(200).json({msg: `All products in the cart are loaded for user ${userId}`, data: cartData});
});

router.post('/', async (req, res, next) => {
    const lastOrderNumber = await Database.checkLastOrderNumber();

    if(!req.session.passport) {
        return res.status(400).json({msg: `User is not logged in`});
    }

    const userId = req.session.passport.user.userId;
    const validUserId = await Database.selectUserById(userId);

    if (!validUserId) {
        return res.status(400).json({msg: `User id ${userId} was not found`});
    }

    const cartData = await Database.getProductInfoWithPriceFromCart(userId);

    if(cartData.length === 0) {
        return res.status(400).json({msg: `User ${userId} has no products in their cart`});
    }

    cartData.forEach(async cart => {
        const createOrder = await Database.createOrder(lastOrderNumber + 1, cart.user_id, cart.product_id, cart.total_units, cart.price, 'Pending');
    });

    const clearUserCart = await Database.deleteAllProductsFromCart(userId);

    return res.status(201).json({msg: `Order was create with products from id ${userId}'s cart`});
});

module.exports = router;