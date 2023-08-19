const bcrypt = require('bcrypt');
const saltRounds = 10;

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

const Database = {
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
    },
    async selectUserByEmail(email) {
        return await query('SELECT * FROM users WHERE email = $1', [email]).then(results => results.rows[0]);
    },
    async selectAllUsers() {
        return await query('SELECT * FROM users').then(results => results.rows);
    },
    async selectUserById(id) {
        return await query('SELECT * FROM users WHERE id = $1', [id]).then(results => results.rows[0]);
    },
    async compareUserPassword(email, password) {
        const user = await this.selectUserByEmail(email);
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const matchedPassword = await bcrypt.compare(password, user.password);

        return matchedPassword;
    },
    async addUser(username, email, password) {
        return await query("INSERT INTO users (username, email, password, administrator) VALUES ($1, $2, $3, $4)", [username, email, password, false]);
    },
    async updateUserPassword(newPassword, email) {
        return await query("UPDATE users SET password = $1 WHERE email = $2", [newPassword, email]);
    },
    async deleteUser(email) {
        return query("DELETE FROM users WHERE email = $1", [email]);
    }
}



module.exports = {
    Database
};