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

const createDatabaseTables = {
    async createTables() {
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
    }
}



module.exports = {
    // createUsersTable,
    // createUserInfoTable,
    // createCategoriesTable,
    // createProductsTable,
    // createCategoryProductTable,
    // createCartTable,
    // createPurchasingHistoryTable
    createDatabaseTables
};