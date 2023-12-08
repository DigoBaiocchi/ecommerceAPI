const express = require('express');
const router = express.Router();
const { Database } = require('../db/databaseQueries');

/**
 * @swagger
 * /checkout:
 *      get:
 *          tags:
 *              - Checkout
 *          description: Get product information from cart
 *          produces:
 *              - application/json
 *          responses:
 *              200:
 *                  description: All products in the cart are loaded for user userId`
 *                  schema:
 *                      $ref: '#definitions/Cart'
 *              400:
 *                  description: User has no products in the cart
 *                  schema:
 *                      $ref: '#definitions/Cart'
 */

router.get('/', async (req, res, next) => {
    const { userId } = req.body;
    const validUserId = await Database.selectUserById(userId);
    
    if(!validUserId) {
        return res.status(400).json({msg: `User ${userId} has no products in the cart`})
    }
    
    const cartData = await Database.getProductInfoWithPriceFromCart(userId);
    return res.status(200).json({msg: `All products in the cart are loaded for user ${userId}`, data: cartData});
});

/**
 * @swagger
 * /checkout:
 *      post:
 *          tags:
 *              - Checkout
 *          description: Create order with products in the checkout section
 *          produces:
 *              - application/json
 *          responses:
 *              201:
 *                  description: Order was create with products from userId's cart
 *                  schema:
 *                      $ref: '#definitions/Cart'
 *              400:
 *                  description: User was not found
 *                  schema:
 *                      $ref: '#definitions/Cart'
 *              401:
 *                  description: User is not logged in
 *                  schema:
 *                      $ref: '#definitions/Cart'
 *              402:
 *                  description: User has no products in their cart
 *                  schema:
 *                      $ref: '#definitions/Cart'
 */

router.post('/', async (req, res, next) => {
    const lastOrderNumber = await Database.checkLastOrderNumber();

    if(!req.session.passport) {
        return res.status(401).json({msg: `User is not logged in`});
    }

    const userId = req.session.passport.user.userId;
    const validUserId = await Database.selectUserById(userId);

    if (!validUserId) {
        return res.status(400).json({msg: `User id ${userId} was not found`});
    }

    const cartData = await Database.getProductInfoWithPriceFromCart(userId);

    if(cartData.length === 0) {
        return res.status(402).json({msg: `User ${userId} has no products in their cart`});
    }

    cartData.forEach(async cart => {
        const createOrder = await Database.createOrder(lastOrderNumber + 1, cart.user_id, cart.product_id, cart.total_units, cart.price, 'Pending');
    });

    const clearUserCart = await Database.deleteAllProductsFromCart(userId);

    return res.status(201).json({msg: `Order was create with products from id ${userId}'s cart`});
});

module.exports = router;