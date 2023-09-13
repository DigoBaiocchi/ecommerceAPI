const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { query } = require('../db/index');
const passport = require('passport');
const { Database } = require('../db/databaseQueries');

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
    
    if (localStorage.getItem('cart')) {
        const cart = JSON.parse(localStorage.getItem('cart'));
        cart.forEach(async (el) => {
            const addProductToCartTable = await Database.addProductToCart(req.user.id, el.productId, el.quantity);
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