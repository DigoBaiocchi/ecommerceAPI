const express = require('express');
const router = express.Router();
const { Database } = require('../db/databaseQueries');

/**
 * @swagger
 * components:
 *      schemas:
 *          Checkout_Data:
 *              type: object
 *              properties:
 *                  checkoutData:
 *                      $ref: '#/components/schemas/Order_Object'
 *              xml:
 *                  name: User_Order
 */

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
        return res.status(400).json({ error: `User has no products in the cart` })
    }
    
    const cartData = await Database.getProductInfoWithPriceFromCart(userId);
    return res.status(200).json({ message: `All products in the cart are loaded for user ${userId}`, data: cartData });
});

/**
 * @swagger
 * /checkout:
 *      post:
 *          tags:
 *              - Checkout
 *          description: Create order with products from the checkout section
 *          requestBody:
 *              description: Checkout data
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Checkout_Data'
 *                  application/xml:
 *                      schema:
 *                          $ref: '#/components/schemas/Checkout_Data'
 *          responses:
 *              201:
 *                  description: Order was created with products from userId's checkout section
 *              400:
 *                  description: User was not found
 *              401:
 *                  description: User is not logged in
 *              402:
 *                  description: User has no products in their cart
 */

router.post('/', async (req, res, next) => {
    const lastOrderNumber = await Database.checkLastOrderNumber();

    if(!req.session.passport) {
        return res.status(401).json({ error: `User is not logged in` });
    }

    const userId = req.session.passport.user.userId;
    const validUserId = await Database.selectUserById(userId);

    if (!validUserId) {
        return res.status(400).json({ error: `User id ${userId} was not found` });
    }

    const { checkoutData } = req.body

    if(checkoutData.length === 0) {
        return res.status(402).json({ error: `User ${userId} has no products in their cart` });
    }

    checkoutData.forEach(async cart => {
        const createOrder = await Database.createOrder(lastOrderNumber + 1, cart.user_id, cart.product_id, cart.total_units, cart.price, 'Pending');
    });

    const clearUserCart = await Database.deleteAllProductsFromCart(userId);

    return res.status(201).json({ message: `Order was create with products from id ${userId}'s cart` });
});

module.exports = router;