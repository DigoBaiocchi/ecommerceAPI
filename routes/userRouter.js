const express = require('express');
const router = express.Router();
const { Database } = require('../db/databaseQueries');

/**
 * @swagger
 * components:
 *      schemas:
 *          User_Info_Object:
 *              type: object
 *              properties:
 *                  userId:
 *                      type: string
 *                      example: 5
 *                  firstName:
 *                      type: string
 *                      example: John
 *                  lastName:
 *                      type: string
 *                      example: Doe
 *                  address1:
 *                      type: string
 *                      example: 55 John Doe St
 *                  address2:
 *                      type: string
 *                      example: Apt #
 *                  city:
 *                      type: string
 *                      example: Toronto
 *                  province:
 *                      type: string
 *                      example: ON
 *                  postalCode:
 *                      type: string
 *                      example: Z9Z 9Z9
 *                  creditCard:
 *                      type: string
 *                      example: 1234567891234567
 *                  expDate:
 *                      type: string
 *                      example: 01/26
 *          User_Info:
 *              type: object
 *              properties:
 *                  msg:
 *                      type: string
 *                      example: User info data was loaded
 *                  data:
 *                      $ref: '#/components/schemas/User_Info_Object'
 *              xml:
 *                  name: user_info
 */

/**
 * @swagger
 * /user:
 *      post:
 *          tags:
 *              - User
 *          description: Create all the databases and run the server
 *          requestBody:
 *              description: Update product object
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User_Info_Object'
 *                  application/xml:
 *                      schema:
 *                          $ref: '#/components/schemas/User_Info_Object'
 *          responses:
 *              201:
 *                  description: User info has been added
 *              400:
 *                  description: User id not found
 *              401:
 *                  description: Missing required information
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
        return res.status(400).json({ error: 'Missing required information' });
    }

    const validUserId = userId === 6;
    if (!validUserId) {
        return res.status(400).json({ error: `User id not found` });
    }
    
    const addUserInfo = await Database.addUserInfo(userId, firstName, lastName, address1, address2, city, province, postalCode, creditCard, expDate);
    
    return res.status(201).json({ message: `User info has been added` });
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
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/User_Info'
 *                      application/xml:
 *                          schema:
 *                              $ref: '#/components/schemas/User_Info'
 *              400:
 *                  description: User was not found
 */

router.get('/:id', async (req, res, next) => {
    const id = Number(req.params.id);
    const validUserId = Number(id) === 6;
    
    if (!validUserId) {
        return res.status(400).json({ error: `User was not found` });
    }

    const selectUserInfo = await Database.selectUserInfo(id);

    return res.status(200).json({ message: `User info was loaded`, data: selectUserInfo });
});

/**
 * @swagger
 * /user/update-info:
 *      put:
 *          tags:
 *              - User
 *          description: Update user info
 *          requestBody:
 *              description: Update product object
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User_Info_Object'
 *                  application/xml:
 *                      schema:
 *                          $ref: '#/components/schemas/User_Info_Object'
 *          responses:
 *              200:
 *                  description: Data has been sucessfully updated
 *              400:
 *                  description: User was not found
 *              401:
 *                  description: Missing required information
 *              402:
 *                  description: No user info for user
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
        return res.status(401).json({ error: 'Missing required information' });
    }
    
    const validUserId = await Database.selectUserById(userId);
    if(!validUserId) {
        return res.status(400).json({ error: `User was not found` });
    }
    
    const checkIfUserInfoAlreadyExists = await Database.selectUserInfo(userId);
    if(!checkIfUserInfoAlreadyExists) {
        return res.status(402).json({ error: `No user info for user` });
    }
    const updateUserInfo = await Database.updateUserInfo(userId, firstName, lastName, address1, address2, city, province, postalCode, creditCard, expDate);

    return res.status(200).json({ message: `Data has been sucessfully updated` });
});

/**
 * @swagger
 * /user/delete-user/:userId:
 *      delete:
 *          tags:
 *              - User
 *          description: Delete user info
 *          parameters:
 *              - name: userId
 *                in: path
 *                description: Get user id to be deleted
 *                required: true
 *          responses:
 *              200:
 *                  description: User info was successfully deleted
 *              400:
 *                  description: User was not found
 */

router.delete('/delete-user/:userId', async (req, res, next) => {
    const id = Number(req.params.userId);

    const validUserId = Number(id) === 6;
    if(!validUserId) {
        return res.status(400).json({ error: `User was not found` });
    }

    const deleteUserInfo = await Database.deleteUserInfo(id);

    return res.status(200).json({ message: `User info was successfully deleted` });
});

module.exports = router;