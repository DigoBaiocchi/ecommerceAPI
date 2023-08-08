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
        }
        console.log('Users Table has already been created!');
    });
    const createUserInfoTable = await query(createUserInfoTableQuery, () => {
        console.log('Users Info Table has been creacted!');
    });
    const createCategoriesTable = await query(createCategoriesTableQuery, () => {
        console.log('Users Categories Table has been creacted!');
    });
    const createProductsTable = await query(createProductsTableQuery, () => {
        console.log('Users Products Table has been creacted!');
    });
    const createCategoryProductTable = await query(createCategoryProductTableQuery, () => {
        console.log('Users Category_product Table has been creacted!');
    });
    const createCartTable = await query(createCartTableQuery, () => {
        console.log('Users Cart Table has been creacted!');
    });
    const createPurchasingHistoryTable = await query(createPurchasingHistoryTableQuery, () => {
        console.log('Users Purchasing History Table has been creacted!');
    });

    const selectUsersTable = await query("SELECT * FROM users");
    res.json({
        info: `Ecommerce app is running here at ${timeNow.rows[0].now}!`,
        data: selectUsersTable.rows
    });
});

module.exports = router;