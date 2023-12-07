const express = require('express');
const router = express.Router();
const { query } = require('../db/index');
const { Database } = require('../db/databaseQueries');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const database = {
    rows: [
        {id: 1, username: 'Rodrigo', email: 'rodrigo@gmail.com', password: "123456", administrator: true},
        {id: 2, username: 'Gambit', email: 'gambit@gmail.com', password: "123456", administrator: false}
    ]
}

router.get('/', async (req, res, next) => {
    const timeNow = await query('SELECT NOW()');

    Database.createTables();

    const selectUsersTable = await Database.selectAllUsers();
    const selectUser = await Database.selectUserByEmail('gambito@gmail.com');
    res.json({
        info: `Ecommerce app is running here at ${timeNow.rows[0].now}!`,
        data: selectUsersTable,
        userData: selectUser,
        sessioninfo: req.session
    });
});

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
        return res.status(400).json({msg: 'Username already exists'});
    }
    if (emailAlreadyExists) {
        return res.status(400).json({msg: 'Email already exists'});
    }
    if (!password) {
        return res.status(400).json({msg: 'No password provided'});
    }
    if (username && email && password) {
        const addUser = await Database.addUser(username, email, hashedPassword);
        return res.status(201).json({msg: 'User successfully created'});
    } 
    return res.status(400).json({msg: 'User not created'});
});

router.get('/:email', async (req, res, next) => {
    const usersDb = await Database.selectAllUsers();
    const { email } = req.params;
    const emailFound = usersDb.some(data => data.email === email);
    if (emailFound) {
        return res.status(200).json({msg: `User found with email ${email}`});
    }
    return res.status(400).json({msg: `User not found with email ${email}`});
});

router.put('/:email', async (req, res, next) => {
    const usersDb = await Database.selectAllUsers();
    const { email } = req.params;
    const { password } = req.body;
    const salt = await bcrypt.genSalt(saltRounds);
    const newHashedPassword = await bcrypt.hash(password, salt);
    const validEmail = usersDb.some(data => data.email === email);
    if (!validEmail) {
        return res.status(400).json({userUpdated: false, message: `email ${email} not found`});
    }
    if(!password) {
        return res.status(400).json({userUpdated: false, message: `password not updated for email ${email}`});    
    }
    const updatePassword = await Database.updateUserPassword(newHashedPassword, email);
    console.log(req.session);
    return res.status(200).json({userUpdated: true, message: `password updated for email ${email}`});
});

router.delete('/:email', async (req, res, next) => {
    const usersDb = await Database.selectAllUsers();
    const { email } = req.params;
    const validEmail = usersDb.some(data => data.email === email);
    if (validEmail) {
        const deleteUser = await Database.deleteUser(email);
        return res.status(200).json({userDeleted: true});
    }
    return res.status(400).json({userDeleted: false});
    
});

module.exports = router;