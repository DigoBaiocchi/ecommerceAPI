const {
	createUsersTableQuery,
	createUserInfoTableQuery,
	createCategoriesTableQuery,
	createProductsTableQuery,
	createCategoryProductTableQuery,
	createCartTableQuery,
	createPurchasingHistoryTableQuery
} = require('./queries/createTableQueries');
const { query } = require('./index');

const createUsersTable = await query(createUsersTableQuery);
const createUserInfoTable = await query(createUserInfoTableQuery);
const createCategoriesTable = await query(createCategoriesTableQuery);
const createProductsTable = await query(createProductsTableQuery);
const createCategoryProductTable = await query(createCategoryProductTableQuery);
const createCartTable = await query(createCartTableQuery);
const createPurchasingHistoryTable = await query(createPurchasingHistoryTableQuery);

module.exports = {
    createUsersTable,
    createUserInfoTable,
    createCategoriesTable,
    createProductsTable,
    createCategoryProductTable,
    createCartTable,
    createPurchasingHistoryTable
};