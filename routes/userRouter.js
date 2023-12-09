const express = require('express');
const router = express.Router();
const { Database } = require('../db/databaseQueries');

/**
 * @swagger
 * /user:
 *      post:
 *          tags:
 *              - User
 *          description: Create all the databases and run the server
 *          produces:
 *              - application/json
 *          responses:
 *              201:
 *                  description: User info has been added
 *                  schema:
 *                      $ref: '#definitions/user'
 *              400:
 *                  description: User id not found
 *                  schema:
 *                      $ref: '#definitions/user'
 *              401:
 *                  description: Missing required information
 *                  schema:
 *                      $ref: '#definitions/user'
 */

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
    return res.status(201).json({msg: `User info has been added`});
});

/**
 * @swagger
 * /user/:id:
 *      get:
 *          tags:
 *              - User
 *          description: Get user info
 *          produces:
 *              - application/json
 *          responses:
 *              200:
 *                  description: User info was loaded
 *                  schema:
 *                      $ref: '#definitions/user'
 *              400:
 *                  description: User was not found
 *                  schema:
 *                      $ref: '#definitions/user'
 */

router.get('/:id', async (req, res, next) => {
    const id = Number(req.params.id);
    const validUserId = Number(id) === 6;
    
    if (!validUserId) {
        return res.status(400).json({msg: `User was not found`});
    }
    const selectUserInfo = await Database.selectUserInfo(id);
    return res.status(200).json({msg: `User info was loaded`, data: selectUserInfo});
});

/**
 * @swagger
 * /user/update-info:
 *      put:
 *          tags:
 *              - User
 *          description: Update user info
 *          produces:
 *              - application/json
 *          responses:
 *              200:
 *                  description: Data has been sucessfully updated
 *                  schema:
 *                      $ref: '#definitions/user'
 *              400:
 *                  description: User was not found
 *                  schema:
 *                      $ref: '#definitions/user'
 *              401:
 *                  description: Missing required information
 *                  schema:
 *                      $ref: '#definitions/user'
 *              402:
 *                  description: No user info for user
 *                  schema:
 *                      $ref: '#definitions/user'
 */

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
        return res.status(401).json({msg: 'Missing required information'});
    }
    
    const validUserId = await Database.selectUserById(userId);
    if(!validUserId) {
        return res.status(400).json({msg: `User was not found`});
    }
    
    const checkIfUserInfoAlreadyExists = await Database.selectUserInfo(userId);
    
    if(!checkIfUserInfoAlreadyExists) {
        return res.status(402).json({msg: `No user info for user`});
    }
    const updateUserInfo = await Database.updateUserInfo(userId, firstName, lastName, address1, address2, city, province, postalCode, creditCard, expDate);
    return res.status(200).json({msg: `Data has been sucessfully updated`});
});

/**
 * @swagger
 * /user/delete-user/:id:
 *      delete:
 *          tags:
 *              - User
 *          description: Delete user info
 *          produces:
 *              - application/json
 *          responses:
 *              200:
 *                  description: User info was successfully deleted
 *                  schema:
 *                      $ref: '#definitions/user'
 *              400:
 *                  description: User was not found
 *                  schema:
 *                      $ref: '#definitions/user'
 */

router.delete('/delete-user/:id', async (req, res, next) => {
    const id = Number(req.params.id)

    const validUserId = Number(id) === 6;
    if(!validUserId) {
        return res.status(400).json({msg: `User was not found`});
    }

    const deleteUserInfo = await Database.deleteUserInfo(id);
    return res.status(200).json({msg: `User info was successfully deleted`});
});

module.exports = router;