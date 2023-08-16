const express = require('express');
const router = express.Router();
const { query } = require('../db/index');
const { createDatabaseTables } = require('../db/createTables');
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

    createDatabaseTables.createTables();

    const selectUsersTable = await query("SELECT * FROM users");
    res.json({
        info: `Ecommerce app is running here at ${timeNow.rows[0].now}!`,
        data: selectUsersTable.rows
    });
});

router.post('/', async (req, res, next) => {
    const usersDb = await query("SELECT * FROM users");
    
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const usernameAlreadyExists = usersDb.rows.some(data => data.username === username);
    const emailAlreadyExists = usersDb.rows.some(data => data.email === email);
    
    if(!username || !email) {
        return res.status(400).json('No username or email provided');
    }
    if (usernameAlreadyExists) {
        return res.status(400).json('Username already exists');
    }
    if (emailAlreadyExists) {
        return res.status(400).json('Email already exists');
    }
    if (!password) {
        return res.status(400).json('No password provided');
    }
    if (username && email && password) {
        const addUser = await query("INSERT INTO users (username, email, password, administrator) VALUES ($1, $2, $3, $4)", [username, email, hashedPassword, false]);
        return res.status(201).json('User successfully created');
    } 
    return res.status(400).json('User not created');
});

router.get('/:email', async (req, res, next) => {
    const usersDb = await query("SELECT * FROM users");
    const { email } = req.params;
    const emailFound = usersDb.rows.some(data => data.email === email);
    if (emailFound) {
        return res.status(200).json(`User found with email ${email}`);
    }
    return res.status(400).json(`User not found with email ${email}`);
});

router.put('/:email', async (req, res, next) => {
    const usersDb = await query("SELECT * FROM users");
    const { email } = req.params;
    const { password } = req.body;
    const newHashedPassword = await bcrypt.hash(password, saltRounds);
    const validEmail = usersDb.rows.some(data => data.email === email);
    if (!validEmail) {
        return res.status(400).json({userUpdated: false, message: `email ${email} not found`});
    }
    if(!password) {
        return res.status(400).json({userUpdated: false, message: `password not updated for email ${email}`});    
    }
    const updatePassword = await query("UPDATE users SET password = $1 WHERE email = $2", [newHashedPassword, email])
    return res.status(200).json({userUpdated: true, message: `password updated for email ${email}`});
});

router.delete('/:email', async (req, res, next) => {
    const usersDb = await query("SELECT * FROM users");
    const { email } = req.params;
    const validEmail = usersDb.rows.some(data => data.email === email);
    if (validEmail) {
        const deleteUser = await query("DELETE FROM users WHERE email = $1", [email]);
        return res.status(200).json({userDeleted: true});
    }
    return res.status(400).json({userDeleted: false});
    
});

module.exports = router;