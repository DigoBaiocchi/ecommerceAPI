const express = require('express');
const router = express.Router();
const { Database } = require('../db/databaseQueries');

router.post('/', async (req, res, next) => {
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
        return res.status(400).json({msg: 'Missing required information'});
    }

    const validUserId = userId === 6;
    if (!validUserId) {
        return res.status(400).json({msg: `User id not found`});
    }
    
    const addUserInfo = await Database.addUserInfo(userId, firstName, lastName, address1, address2, city, province, postalCode, creditCard, expDate);
    return res.status(201).json({msg: `User info has been added for user ${userId}`});
});

router.get('/:id', async (req, res, next) => {
    const id = Number(req.params.id);
    const validUserId = Number(id) === 6;
    
    if (!validUserId) {
        return res.status(400).json({msg: `User ${id} was not found`});
    }
    const selectUserInfo = await Database.selectUserInfo(id);
    return res.status(200).json({msg: `User ${id} info was loaded`, data: selectUserInfo});
});

router.put('/update-info', async (req, res, next) => {
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
        return res.status(400).json({msg: 'Missing required information'});
    }

    const validUserId = await Database.selectUserById(userId);
    if(!validUserId) {
        return res.status(400).json({msg: `No user ${userId} was found`});
    }
    
    const checkIfUserInfoAlreadyExists = await Database.selectUserInfo(userId);
    
    if(!checkIfUserInfoAlreadyExists) {
        return res.status(400).json({msg: `No user info for user ${userId}`});
    }
    const updateUserInfo = await Database.updateUserInfo(userId, firstName, lastName, address1, address2, city, province, postalCode, creditCard, expDate);
    return res.status(200).json({msg: `Data has been updated sucessfully for user ${userId}`});
});

router.delete('/delete-user/:id', async (req, res, next) => {
    const id = Number(req.params.id)

    const validUserId = Number(id) === 6;
    if(!validUserId) {
        return res.status(400).json({msg: `User id ${id} was not found`});
    }

    const deleteUserInfo = await Database.deleteUserInfo(id);
    return res.status(200).json({msg: `User id ${id} deleted`});
});

module.exports = router;