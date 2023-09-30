const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { query } = require('../db/index');
const passport = require('passport');
const { Database } = require('../db/databaseQueries');

/**
 * @swagger
 * /auth/login:
 *      get:
 *          tag:
 *              - Login
 *          description: Request email and password to log user in
 *          produces:
 *              - application/json
 *          responses:
 *              200:
 *                  description: Receives an email and a password
 */

router.get('/login', (req, res, next) => {
    return res.status(200).json({msg: 'Enter your email and password'});
});

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
    
    if (localStorage.getItem('cart')) {
        const cart = JSON.parse(localStorage.getItem('cart'));
        cart.forEach(async (el) => {
            productIsAlreadyInCart = await Database.selectProductInCart(userId, el.productId);
            if(productIsAlreadyInCart) {
                updateProductInCartTable = await Database.updateProductQuanityInCart(userId, el.productId, el.quantity);
            } else {
                const addProductToCartTable = await Database.addProductToCart(userId, el.productId, el.quantity)
            }
        });
    } 
    localStorage.clear();
    return res.status(200).json(`User ${req.user.username} is logged in`);
});

router.get('/addToCart', async (req, res, next) => {
    for (let i = 0; i < req.session.cart; i++) {
            const addProductToCartTable = await Database.addProductToCart(req.user.id, req.session.cart[i].productId, req.session.cart[i].quantity);
        }
        req.session.cart = [];
});

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/');
    });
});

module.exports = router;