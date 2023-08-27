const express = require('express');
const router = express.Router();
const { Database } = require('../db/databaseQueries');

router.post('/', (req, res, next) => {
    const { 
        userId, 
        firstName, 
        lastName, 
        address1, 
        address2, 
        city,
        province,
        postalCode,
        creditCard,
        expDate
    } = req.body;
    
    if (!firstName || !lastName || !address1 || !city || !province || !postalCode || !creditCard || !expDate) {
        return res.status(400).json('Missing required information');
    }

    const validUserId = userId === 6;
    if (!validUserId) {
        return res.status(400).json(`User id not found`);
    }

    return res.status(201).json(`User info has been added for user ${userId}`);
});

router.get('/:id', (req, res, next) => {
    const { id } = req.params;
    const validUserId = Number(id) === 6;
    
    if (!validUserId) {
        return res.status(400).json(`User ${id} was not found`);
    }
    return res.status(200).json(`User ${id} info was loaded`);
});

router.put('/update-info', (req, res, next) => {
    const { 
        userId, 
        firstName, 
        lastName, 
        address1, 
        address2, 
        city,
        province,
        postalCode,
        creditCard,
        expDate
    } = req.body;

    if (!firstName || !lastName || !address1 || !city || !province || !postalCode || !creditCard || !expDate) {
        return res.status(400).json('Missing required information');
    }

    const validUserId = Number(userId) === 6;
    if(!validUserId) {
        return res.status(400).json(`No user ${userId} was found`);
    }
    return res.status(200).json(`Data has been updated sucessfully for user ${userId}`);
});

router.delete('/delete-user/:id', (req, res, next) => {
    const { id } = req.params;

    const validUserId = Number(id) === 6;
    if(!validUserId) {
        return res.status(400).json(`User id ${id} was not found`);
    }

    return res.status(200).json(`User id ${id} deleted`);
});

module.exports = router;