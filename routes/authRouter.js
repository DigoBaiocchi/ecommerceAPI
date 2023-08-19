const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { query } = require('../db/index');
const passport = require('passport');

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
    , (req, res, next) => {
    console.log('Logged In');
    console.log(req.user);
    res.status(200).json(`User ${req.user.username} is logged in`);
});

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/');
    });
});

module.exports = router;