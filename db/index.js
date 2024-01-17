const config = require('../utils/config');

const { Pool } = require('pg');
const pool = new Pool({
    connectionString: config.DATABASE_URL
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