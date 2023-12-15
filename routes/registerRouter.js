const express = require('express');
const router = express.Router();
const { query } = require('../db/index');
const { Database } = require('../db/databaseQueries');
const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * @swagger
 * components:
 *      schemas:
 *          Register_Object:
 *              type: object
 *              properties:
 *                  username:
 *                      type: string
 *                      example: John_Doe
 *                  email:
 *                      type: string
 *                      example: emailtest@gmail.com
 *                  password:
 *                      type: string
 *                      example: thisisapasswordexample123
 *          User_Data:
 *              type: object
 *              properties:
 *                  msg:
 *                      type: string
 *                      example: Email was found in the database
 *                  data:
 *                      $ref: '#/components/schemas/Register_Object'
 *              xml:
 *                  name: user_info
 */

/**
 * @swagger
 * /register:
 *      get:
 *          tags:
 *              - Register
 *          description: Asks for username, email and password in order to create user
 *          produces:
 *              - application/json
 *          responses:
 *              200:
 *                  description: Provide username, email and password
 */

router.get('/', async (req, res, next) => {
    res.status(200).json({msg: `Provide username, email and password`});
});

/**
 * @swagger
 * /register:
 *      post:
 *          tags:
 *              - Register
 *          description: Register new user
 *          requestBody:
 *              description: Get username, email and password to create a new user
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Register_Object'
 *                  application/xml:
 *                      schema:
 *                          $ref: '#/components/schemas/Register_Object'
 *          responses:
 *              201:
 *                  description: User successfully created
 *              400:
 *                  description: No username or email provided
 *              401:
 *                  description: Username already exists
 *              402:
 *                  description: Email already exists
 *              403:
 *                  description: No password provided
 *              500:
 *                  description: User not created
 */

router.post('/', async (req, res, next) => {
    const usersDb = await Database.selectAllUsers()
    
    const { username, email, password } = req.body;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const usernameAlreadyExists = usersDb.some(data => data.username === username);
    const emailAlreadyExists = usersDb.some(data => data.email === email);
    
    if(!username || !email) {
        return res.status(400).json({msg: 'No username or email provided'});
    }
    if (usernameAlreadyExists) {
        return res.status(401).json({msg: 'Username already exists'});
    }
    if (emailAlreadyExists) {
        return res.status(402).json({msg: 'Email already exists'});
    }
    if (!password) {
        return res.status(403).json({msg: 'No password provided'});
    }
    if (username && email && password) {
        const addUser = await Database.addUser(username, email, hashedPassword);
        return res.status(201).json({msg: 'User successfully created'});
    } 
    return res.status(500).json({msg: 'User not created'});
});

/**
 * @swagger
 * /register/:email':
 *      get:
 *          tags:
 *              - Register
 *          description: Check if email exists
 *          parameters:
 *              - name: email
 *                in: path
 *                description: It uses email to get user data
 *                required: true
 *          responses:
 *              200:
 *                  description: Email was found in the database
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/User_Data'
 *                      application/xml:
 *                          schema:
 *                              $ref: '#/components/schemas/User_Data'
 *              400:
 *                  description: Email was not found in the database
 */

router.get('/:email', async (req, res, next) => {
    const usersDb = await Database.selectAllUsers();
    const { email } = req.params;
    const emailFound = usersDb.some(data => data.email === email);
    if (emailFound) {
        return res.status(200).json({msg: `Email was found in the database`});
    }
    return res.status(400).json({msg: `Email was not found in the database`});
});

/**
 * @swagger
 * /register/:email':
 *      put:
 *          tags:
 *              - Register
 *          description: Update user password
 *          parameters:
 *              - name: email
 *                in: path
 *                description: It uses email to update user data
 *                required: true
 *          requestBody:
 *              description: Get username, email and password to create a new user
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Register_Object'
 *                  application/xml:
 *                      schema:
 *                          $ref: '#/components/schemas/Register_Object'
 *          responses:
 *              200:
 *                  description: Password was successfully updated
 *              400:
 *                  description: Email was not found in the database
 *              401:
 *                  description: Password was not updated
 */

router.put('/:email', async (req, res, next) => {
    const usersDb = await Database.selectAllUsers();
    const { email } = req.params;
    const { password } = req.body;
    const salt = await bcrypt.genSalt(saltRounds);
    const newHashedPassword = await bcrypt.hash(password, salt);
    const validEmail = usersDb.some(data => data.email === email);
    if (!validEmail) {
        return res.status(400).json({userUpdated: false, msg: `Email was not found in the database`});
    }
    if(!password) {
        return res.status(401).json({userUpdated: false, msg: `Password was not updated`});    
    }
    const updatePassword = await Database.updateUserPassword(newHashedPassword, email);
    console.log(req.session);
    return res.status(200).json({userUpdated: true, msg: `Password was successfully updated`});
});

/**
 * @swagger
 * /register/:email':
 *      delete:
 *          tags:
 *              - Register
 *          description: Delete user
 *          parameters:
 *              - name: email
 *                in: path
 *                description: It uses email to delete user data
 *                required: true
 *          responses:
 *              200:
 *                  description: User was successfully deleted
 *              400:
 *                  description: User was not delete
 */

router.delete('/:email', async (req, res, next) => {
    const usersDb = await Database.selectAllUsers();
    const { email } = req.params;
    const validEmail = usersDb.some(data => data.email === email);
    if (validEmail) {
        const deleteUser = await Database.deleteUser(email);
        return res.status(200).json({msg: 'User was successfully delete', userDeleted: true});
    }
    return res.status(400).json({msg: 'User was not delete', userDeleted: false});
    
});

module.exports = router;