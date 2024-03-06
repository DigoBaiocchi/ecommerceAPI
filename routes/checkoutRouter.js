const express = require('express');
const router = express.Router();
const { Database } = require('../db/databaseQueries');

// Router middlewares
const userNotLoggedInError = (req, res, next) => {
    if(!req.session.passport) {
        return res.status(401).json({ error: `User is not logged in` });
    } else {
        req.userId = req.session.passport.user.userId;
        next();
    }
};

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
 *                  description: All products from user's cart are loaded
 *                  schema:
 *                      $ref: '#definitions/Cart'
 *              400:
 *                  description: User has no products in the cart
 *                  schema:
 *                      $ref: '#definitions/Cart'
 *              401:
 *                  description: User is not logged in
 */

router.get('/', userNotLoggedInError, async (req, res, next) => {    
    const cartData = await Database.getProductInfoWithPriceFromCart(req.userId);
    if(cartData.length === 0) {
        return res.status(400).json({ error: `User has no products in the cart` })
    }


    return res.status(200).json({ message: `All products from user's cart are loaded`, data: cartData });
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
 *                  description: Order successfully created
 *              401:
 *                  description: User is not logged in
 *              402:
 *                  description: User has no products in their cart
 */

router.post('/', userNotLoggedInError, async (req, res, next) => {
    const lastOrderNumber = await Database.checkLastOrderNumber();

    const { checkoutData } = req.body;
    if(checkoutData.length === 0) {
        return res.status(402).json({ error: `User has no products in their cart` });
    }

    checkoutData.forEach(async cart => {
        const createOrder = await Database.createOrder(
            lastOrderNumber + 1, 
            req.userId, 
            cart.productId, 
            cart.totalUnits, 
            cart.price, 
            'Pending'
        );
    });

    const clearUserCart = await Database.deleteAllProductsFromCart(req.userId);

    return res.status(201).json({ message: `Order successfully created` });
});

module.exports = router;