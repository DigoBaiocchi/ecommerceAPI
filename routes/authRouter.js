const express = require('express');
const router = express.Router();
const passport = require('passport');
const { Database } = require('../db/databaseQueries');

/**
 * @swagger
 * components:
 *      schemas:
 *          User:
 *              type: object
 *              properties:
 *                  email:
 *                      type: string
 *                      example: emailtest@gmail.com
 *                  password:
 *                      type: string
 *                      example: thisisapasswordexample123
 */

/**
 * @swagger
 * /auth/login:
 *      get:
 *          tags:
 *              - Login
 *          description: Request email and password to log user in
 *          produces:
 *              - application/json
 *          responses:
 *              200:
 *                  description: Receives an email and a password
 */

router.get('/login', (req, res, next) => {
    return res.status(200).json({ message: 'Enter your email and password' });
});

/**
 * @swagger
 * /auth/login:
 *      post:
 *          tags:
 *              - Login
 *          description: Get user email and password
 *          requestBody:
 *              description: Get user email and password to authenticate
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *                  application/xml:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          produces:
 *              - application/json
 *          responses:
 *              200:
 *                  description: User is logged in
 */

router.post(
    '/login', 
    passport.authenticate('local', 
    {
        // successReturnToOrRedirect: '/register',
        failureRedirect: '/auth/login'
    })
    , async (req, res, next) => {
    console.log('Logged In');
    console.log(req.user);
    const userId = req.user.id;
    let productIsAlreadyInCart; 
    let updateProductInCartTable;

    const { checkoutData } = req.body
    
    if (checkoutData.length > 0) {
        checkoutData.forEach(async (el) => {
            productIsAlreadyInCart = await Database.selectProductInCart(userId, el.productId);
            if(productIsAlreadyInCart) {
                updateProductInCartTable = await Database.updateProductQuanityInCart(userId, el.productId, el.quantity);
            } else {
                const addProductToCartTable = await Database.addProductToCart(userId, el.productId, el.quantity)
            }
        });
    } 
    
    return res.status(200).json({ message: `User is logged in` });
});

/**
 * @swagger
 * /auth/logout:
 *      get:
 *          tags:
 *              - Login
 *          description: Logging user out
 *          produces:
 *              - application/json
 */

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.status(200).redirect('/');
    });
});

module.exports = router;