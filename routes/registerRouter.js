const express = require('express');
const router = express.Router();
const { query } = require('../db/index');
const { Database } = require('../db/databaseQueries');
const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * @swagger
 * /register:
 *      get:
 *          tags:
 *              - Register
 *          description: Create all the databases and run the server
 *          produces:
 *              - application/json
 *          responses:
 *              200:
 *                  description: Databases have been created and Ecommerce app is running here
 *                  schema:
 *                      $ref: '#definitions/register'
 */

router.get('/', async (req, res, next) => {
    const timeNow = await query('SELECT NOW()');
    
    const selectUsersTable = await Database.selectAllUsers();
    const selectUser = await Database.selectUserByEmail('gambito@gmail.com');
    res.status(200).json({
        info: `Databases have been created and Ecommerce app is running here at ${timeNow.rows[0].now}!`,
        data: selectUsersTable,
        userData: selectUser,
        sessioninfo: req.session
    });
});

/**
 * @swagger
 * /register:
 *      post:
 *          tags:
 *              - Register
 *          description: Register new user
 *          produces:
 *              - application/json
 *          responses:
 *              201:
 *                  description: User successfully created
 *                  schema:
 *                      $ref: '#definitions/register'
 *              400:
 *                  description: No username or email provided
 *                  schema:
 *                      $ref: '#definitions/register'
 *              401:
 *                  description: Username already exists
 *                  schema:
 *                      $ref: '#definitions/register'
 *              402:
 *                  description: Email already exists
 *                  schema:
 *                      $ref: '#definitions/register'
 *              403:
 *                  description: No password provided
 *                  schema:
 *                      $ref: '#definitions/register'
 *              500:
 *                  description: User not created
 *                  schema:
 *                      $ref: '#definitions/register'
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
 *          produces:
 *              - application/json
 *          responses:
 *              200:
 *                  description: Email was found in the database
 *                  schema:
 *                      $ref: '#definitions/register'
 *              400:
 *                  description: Email was not found in the database
 *                  schema:
 *                      $ref: '#definitions/register'
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
 *          produces:
 *              - application/json
 *          responses:
 *              200:
 *                  description: Password was successfully updated
 *                  schema:
 *                      $ref: '#definitions/register'
 *              400:
 *                  description: Email was not found in the database
 *                  schema:
 *                      $ref: '#definitions/register'
 *              401:
 *                  description: Password was not updated
 *                  schema:
 *                      $ref: '#definitions/register'
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
 *          produces:
 *              - application/json
 *          responses:
 *              200:
 *                  description: User was successfully delete
 *                  schema:
 *                      $ref: '#definitions/register'
 *              400:
 *                  description: User was not delete
 *                  schema:
 *                      $ref: '#definitions/register'
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