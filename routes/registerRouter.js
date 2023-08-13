const express = require('express');
const router = express.Router();
const { query } = require('../db/index');
const { createDatabaseTables } = require('../db/createTables');

router.get('/', async (req, res, next) => {
    const timeNow = await query('SELECT NOW()');

    createDatabaseTables.createTables();

    const selectUsersTable = await query("SELECT * FROM users");
    res.json({
        info: `Ecommerce app is running here at ${timeNow.rows[0].now}!`,
        data: selectUsersTable.rows
    });
});

router.post('/', (req, res, next) => {
    const database = {
        rows: [
            {id: 1, username: 'Rodrigo', email: 'rodrigo@gmail.com', password: "123456", administrator: true},
            {id: 2, username: 'Gambit', email: 'gambit@gmail.com', password: "123456", administrator: false}
        ]
    }
    const { username, email, password } = req.body;
    const usernameAlreadyExists = database.rows.some(data => data.username === username);
    const emailAlreadyExists = database.rows.some(data => data.email === email);
    
    if (usernameAlreadyExists) {
        return res.status(400).json('Username already exists')
    }
    if (emailAlreadyExists) {
        return res.status(400).json('Email already exists')
    }
    if (username && email && password) {
        return res.status(201).json('User successfully created');
    } 
    return res.status(400).json('User not created');
    
});

module.exports = router;