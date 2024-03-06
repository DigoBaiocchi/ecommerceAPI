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

const checkIfMissingRequiredInfo = (req, res, next) => {
    const { 
        first_name, 
        last_name, 
        address1, 
        address2, 
        city,
        province,
        postal_code,
        credit_card_number,
        credit_card_exp_date
    } = req.body;
    
    if (
        !first_name || 
        !last_name || 
        !address1 || 
        !city || 
        !province || 
        !postal_code || 
        !credit_card_number || 
        !credit_card_exp_date
    ) {
        return res.status(400).json({ error: 'Missing required information' });
    } else {
        req.userInfo = { 
            first_name, 
            last_name, 
            address1, 
            address2, 
            city,
            province,
            postal_code,
            credit_card_number,
            credit_card_exp_date
        };
        next();
    }
};

/**
 * @swagger
 * components:
 *      schemas:
 *          User_Info_Object:
 *              type: object
 *              properties:
 *                  first_name:
 *                      type: string
 *                      example: John
 *                  last_name:
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
 *                  postal_code:
 *                      type: string
 *                      example: Z9Z 9Z9
 *                  credit_card_number:
 *                      type: string
 *                      example: 1234567891234567
 *                  credit_card_exp_date:
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
 *                  description: User is not logged in
 */


router.post('/', userNotLoggedInError, checkIfMissingRequiredInfo, async (req, res, next) => {
    const addUserInfo = await Database.addUserInfo(
        req.userId, 
        req.userInfo.first_name, 
        req.userInfo.last_name, 
        req.userInfo.address1, 
        req.userInfo.address2, 
        req.userInfo.city, 
        req.userInfo.province, 
        req.userInfo.postal_code, 
        req.userInfo.credit_card_number, 
        req.userInfo.credit_card_exp_date
    );
    
    return res.status(201).json({ message: `User info has been added` });
});

/**
 * @swagger
 * /user/:
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
 *              401:
 *                  description: User is not logged in
 */

router.get('/', userNotLoggedInError, async (req, res, next) => {
    const selectUserInfo = await Database.selectUserInfo(req.userId);

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
 *                  description: Missing required information
 *              401:
 *                  description: User is not logged in
 */

router.put('/update-info', userNotLoggedInError, checkIfMissingRequiredInfo, async (req, res, next) => {
    const updateUserInfo = await Database.updateUserInfo(
        req.userId, 
        req.userInfo.first_name, 
        req.userInfo.last_name, 
        req.userInfo.address1, 
        req.userInfo.address2, 
        req.userInfo.city, 
        req.userInfo.province, 
        req.userInfo.postal_code, 
        req.userInfo.credit_card_number, 
        req.userInfo.credit_card_exp_date
    );

    return res.status(200).json({ message: `Data has been sucessfully updated` });
});

/**
 * @swagger
 * /user/delete-user/:
 *      delete:
 *          tags:
 *              - User
 *          description: Delete user info
 *          responses:
 *              200:
 *                  description: User info was successfully deleted
 *              401:
 *                  description: User is not logged in
 */

router.delete('/delete-user/', userNotLoggedInError, async (req, res, next) => {
    const deleteUserInfo = await Database.deleteUserInfo(req.userId);

    return res.status(200).json({ message: `User info was successfully deleted` });
});

module.exports = router;