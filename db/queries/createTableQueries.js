const createUsersTableQuery = `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY, 
    username varchar(30) NOT NULL UNIQUE, 
    email varchar(100) NOT NULL UNIQUE,
    password varchar(200) NOT NULL,
    administrator boolean NOT NULL
);`;

const createUserInfoTableQuery = `CREATE TABLE IF NOT EXISTS user_info (
	user_id integer REFERENCES users (id) ON DELETE CASCADE,
	first_name varchar(30) NOT NULL,
	last_name varchar(40) NOT NULL,
	address1 varchar(100) NOT NULL,
	address2 varchar(200),
	city varchar(40) NOT NULL,
	province varchar(2) NOT NULL,
	postal_code varchar(7) NOT NULL,
	credit_card_number varchar(19),
	credit_card_exp_date varchar(5)
);`;

const createCategoriesTableQuery = `CREATE TABLE IF NOT EXISTS categories (
	id SERIAL PRIMARY KEY,
	name varchar(40) NOT NULL UNIQUE
);`;

const createProductsTableQuery = `CREATE TABLE IF NOT EXISTS products (
	id SERIAL PRIMARY KEY,
	name varchar(100) NOT NULL UNIQUE,
	total_available integer DEFAULT 0,
	description varchar(100),
	price money NOT NULL
);`;

const createCategoryProductTableQuery = `CREATE TABLE IF NOT EXISTS category_product (
	category_id integer REFERENCES categories (id) ON DELETE CASCADE,
	product_id integer REFERENCES products (id) ON DELETE CASCADE
);`;

const createCartTableQuery = `CREATE TABLE IF NOT EXISTS cart (
	user_id integer REFERENCES users (id) ON DELETE CASCADE,
	product_id integer REFERENCES products(id) ON DELETE CASCADE,
	total_units integer NOT NULL
);`;

// const createCheckoutTableQuery = `CREATE TABLE IF NOT EXISTS checkout (
// 	user_id integer REFERENCES users (id) ON DELETE CASCADE,
// 	product_id integer REFERENCES products(id) ON DELETE CASCADE,
// 	total_units integer NOT NULL,
// 	price money NOT NULL
// );`;

// const createPurchasingHistoryTableQuery = `CREATE TABLE IF NOT EXISTS purchasing_history (
// 	user_id integer REFERENCES users (id) ON DELETE CASCADE,
// 	product_id integer REFERENCES products(id) ON DELETE CASCADE,
// 	total_purchased integer NOT NULL,
// 	price money NOT NULL
// );`;

const createOrdersTableQuery = `CREATE TABLE IF NOT EXISTS orders (
	order_id integer NOT NULL,
	user_id integer REFERENCES users (id) ON DELETE CASCADE,
	product_id integer REFERENCES products(id) ON DELETE CASCADE,
	total_purchased integer NOT NULL,
	price money NOT NULL,
	order_status varchar(15) CONSTRAINT order_status_value_check CHECK (order_status = 'Pending' OR 'Completed')
);`;

module.exports = {
	createUsersTableQuery,
	createUserInfoTableQuery,
	createCategoriesTableQuery,
	createProductsTableQuery,
	createCategoryProductTableQuery,
	createCartTableQuery,
	createPurchasingHistoryTableQuery,
	createCheckoutTableQuery,
	createOrdersTableQuery
}