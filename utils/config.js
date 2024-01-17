const dotenv = require('dotenv');
dotenv.config({ path: '.env.development.local' });

const config = {
    DATABASE_URL: process.env.DATABASE_URL,
    PORT: process.env.PORT
};

module.exports = config;