const bcrypt = require('bcrypt');
const saltRounds = 10;

const {
	createUsersTableQuery,
	createUserInfoTableQuery,
	createCategoriesTableQuery,
	createProductsTableQuery,
	createCategoryProductTableQuery,
	createCartTableQuery,
	createPurchasingHistoryTableQuery,
    createCheckoutTableQuery,
    createOrdersTableQuery
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
        const createOrdersTable = await query(createOrdersTableQuery, (data) => {
            if(data) {
                console.log('Orders Table has been creacted!');    
            } else {
                console.log('Orders Table has already been created!');
            }
        });
        // const createPurchasingHistoryTable = await query(createPurchasingHistoryTableQuery, (data) => {
        //     if(data) {
        //         console.log('Purchasing_History Table has been creacted!');    
        //     } else {
        //         console.log('Purchasing_History Table has already been created!');
        //     }
        // });
        // const createCheckoutTable = await query(createCheckoutTableQuery, (data) => {
        //     if(data) {
        //         console.log('Checkout Table has been creacted!');    
        //     } else {
        //         console.log('Checkout Table has already been created!');
        //     }
        // });
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
        return await query("DELETE FROM users WHERE email = $1", [email]);
    },
    async getAllCategories() {
        return await query("SELECT * FROM categories").then(results => results.rows);
    },
    async getCategoryByName(name) {
        return await query("SELECT * FROM categories WHERE name = $1", [name]).then(result => result.rows[0]);
    },
    async getCategoryId(name) {
        const categoryData = await query("SELECT * FROM categories WHERE name = $1", [name]).then(result => result.rows[0]);
        return categoryData;
    },
    async getCategoryById(id) {
        return await query('SELECT * FROM categories WHERE id = $1', [id]).then(result => result.rows[0]);
    },
    async addCategory(name) {
        return await query("INSERT INTO categories (name) VALUES ($1)", [name]);
    },
    async updateCategory(id, name) {
        return await query("UPDATE categories SET name = $2 WHERE id = $1", [id, name]);
    },
    async deleteCategory(name) {
        return await query("DELETE FROM categories WHERE name = $1", [name]);
    },
    async getAllProducts() {
        return await query("SELECT * FROM products").then(results => results.rows);
    },
    async getProductByName(name) {
        return await query("SELECT * FROM products WHERE name = $1", [name]).then(results => results.rows[0]);
    },
    async getProductById(id) {
        return await query("SELECT * FROM products WHERE id = $1", [id]).then(results => results.rows[0]);
    },
    async checkIfProductAlreadyExists(idOrName) {
        let getProductData;

        if(isNaN(Number(idOrName))) {
            getProductData = await query("SELECT * FROM products WHERE name = $1", [idOrName]).then(results => results.rows);
        } else {
            getProductData = await query("SELECT * FROM products WHERE id = $1", [idOrName]).then(results => results.rows);
        }
        
        if (getProductData.length === 0) {
            return false;
        } else {
            return true;
        }
    },
    async checkIfUserInfoAlreadyExists(id) {
        const getUser = await query("SELECT * FROM user_info WHERE id = $1", [id]).then(results => results.rows);

    },
    async addProduct(categoryId, name, quantity, description, price) {
        const productId = await query("INSERT INTO products (name, total_available, description, price) VALUES ($1, $2, $3, $4) RETURNING id", [name, quantity, description, price]).then(results => results.rows[0].id);
        
        return await query("INSERT INTO category_product (category_id, product_id) VALUES ($1, $2)", [categoryId, productId]);
    },
    async updateProduct(id, name, quantity, description, price) {
        return await query("UPDATE products SET name = $2, total_available = $3, description = $4, price = $5 WHERE id = $1", [id, name, quantity, description, price]);
    },
    async deleteProduct(name) {
        return await query("DELETE FROM products WHERE name = $1", [name]);
    },
    async addUserInfo(userId, firstName, lastName, address1, address2, city, province, postalCode, creditCard, expDate) {
        return await query(`INSERT INTO user_info 
                            (user_id, first_name, last_name, address1, address2, city, province, postal_code, credit_card_number, credit_card_exp_date)
                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                            [userId, firstName, lastName, address1, address2, city, province, postalCode, creditCard, expDate])
    },
    async selectUserInfo(userId) {
        return await query(`SELECT * FROM user_info WHERE user_id = $1`, [userId]).then(results => results.rows[0]);
    },
    async updateUserInfo(userId, firstName, lastName, address1, address2, city, province, postalCode, creditCard, expDate) {
        return await query(`UPDATE user_info 
            SET first_name = $2, last_name = $3, address1 = $4, address2 = $5, city = $6, province = $7, postal_code = $8, credit_card_number = $9, credit_card_exp_date = $10
            WHERE user_id = $1`,
            [userId, firstName, lastName, address1, address2, city, province, postalCode, creditCard, expDate]);
    },
    async deleteUserInfo(userId) {
        return await query(`DELETE FROM user_info WHERE user_id = $1`, [userId]);
    },
    async addProductToCart(userId, productId, productQuantity) {
        return await query(`INSERT INTO cart (user_id, product_id, total_units) VALUES ($1, $2, $3)`, [userId, productId, productQuantity]);
    },
    async selectCartProducts(userId) {
        return await query(`SELECT * FROM cart WHERE user_id = $1`, [userId]).then(results => results.rows);
    },
    async selectProductInCart(userId, productId) {
        return await query(`SELECT * FROM cart WHERE user_id = $1 AND product_id = $2`, [userId, productId]).then(results => results.rows[0]);
    },
    async updateProductQuanityInCart(userId, productId, productQuanity) {
        return await query(`UPDATE cart SET total_units = $3 WHERE user_id = $1 AND product_id = $2`, [userId, productId, productQuanity])
    },
    async deleteProductFromCart(userId, productId) {
        return await query(`DELETE FROM cart WHERE user_id = $1 AND product_id = $2`, [userId, productId]);
    },
    async deleteAllProductsFromCart(userId) {
        return await query(`DELETE FROM cart WHERE user_id = $1`, [userId]);
    },
    async checkLastOrderNumber() {
        const listOfOrders = await query(`SELECT order_number FROM orders`).then(results = results.rows);
        if (listOfOrders.length === 0) {
            return 0;
        } else {
            return Math.max(...listOfOrders.map(order => order.order_number));
        }
    },
    async getProductInfoWithPriceFromCart() {
        const query = `
            SELECT cart.user_id, cart.product_id, cart.total_units, products.price 
            FROM cart
            JOIN products
                ON cart.product_id = products.id;
        `;

        const cartProductsInfo = await query(query).then(results = results.rows);
    }
}

module.exports = {
    Database
};