const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { query } = require('../db/index');
const passport = require('passport');

router.get('/', (req, res, next) => {
    return res.status(200).json({msg: 'Enter your email and password'});
});

router.post(
    '/', 
    passport.authenticate('local', 
    {
        // successReturnToOrRedirect: '/register',
        failureRedirect: '/login'
    })
    , (req, res, next) => {
    console.log('Logged In');
    console.log(req.session);
    res.status(200);
});

module.exports = router;