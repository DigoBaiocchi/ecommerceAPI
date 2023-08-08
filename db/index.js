const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ecommerce',
    password: 'postgres',
    port: 5432,
});

const query = async (text, params, callback) => {
    const start = Date.now();
    const res = await pool.query(text, params, callback);
    const duration = Date.now() - start;
    if (res) {
        console.log('executed query', { text, duration, rows: res.rowCount});
        return res;
    } else {
        console.log('something went wrong!');
    }
};

module.exports = { query };