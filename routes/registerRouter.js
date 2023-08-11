const express = require('express');
const router = express.Router();
const { query } = require('../db/index');
const {
	createUsersTableQuery,
	createUserInfoTableQuery,
	createCategoriesTableQuery,
	createProductsTableQuery,
	createCategoryProductTableQuery,
	createCartTableQuery,
	createPurchasingHistoryTableQuery
} = require('../db/queries/createTableQueries');

router.get('/', async (req, res, next) => {
    const timeNow = await query('SELECT NOW()');
    const createUsersTable = await query(createUsersTableQuery, (data) => {
        if(data) {
            console.log('Users Table has been creacted!');    
        } else {
            console.log('Users Table has already been created!');
        }
    });
    const createUserInfoTable = await query(createUserInfoTableQuery, (data) => {
        if(data) {
            console.log('Users Info Table has been creacted!');    
        } else {
            console.log('Users Info Table has already been created!');
        }
    });
    const createCategoriesTable = await query(createCategoriesTableQuery, (data) => {
        if(data) {
            console.log('Categories Table has been creacted!');    
        } else {
            console.log('Categories Table has already been created!');
        }
    });
    const createProductsTable = await query(createProductsTableQuery, (data) => {
        if(data) {
            console.log('Products Table has been creacted!');    
        } else {
            console.log('Products Table has already been created!');
        }
    });
    const createCategoryProductTable = await query(createCategoryProductTableQuery, (data) => {
        if(data) {
            console.log('Category_product Table has been creacted!');    
        } else {
            console.log('Category_product Table has already been created!');
        }
    });
    const createCartTable = await query(createCartTableQuery, (data) => {
        if(data) {
            console.log('Cart Table has been creacted!');    
        } else {
            console.log('Cart Table has already been created!');
        }
    });
    const createPurchasingHistoryTable = await query(createPurchasingHistoryTableQuery, (data) => {
        if(data) {
            console.log('Purchasing_History Table has been creacted!');    
        } else {
            console.log('Purchasing_History Table has already been created!');
        }
    });

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