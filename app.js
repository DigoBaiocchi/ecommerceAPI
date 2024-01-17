const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
require('./strategies/local');
const session = require('express-session');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const { Database } = require('./db/databaseQueries');
const config = require('./utils/config');
const port = config.PORT || 3000;

const registerRouter = require('./routes/registerRouter');
const authRouter = require('./routes/authRouter');
const categoriesRouter = require('./routes/categoriesRouter');
const productsRouter = require('./routes/productsRouter');
const userRouter = require('./routes/userRouter');
const cartRouter = require('./routes/cartRouter');
const checkoutRouter = require('./routes/checkoutRouter');
const orderRouter = require('./routes/ordersRouter');

const options = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'ecommerce API',
            version: '1.0.0',
            description: 'Ecommerce rest API with openAPI'
        },
        host: `localhost:${port}/`,
        basePath: '/',
        servers:[
            {
                url: `http://localhost:${port}/`
            }
        ]
    },
    apis: ['./routes/*.js'],
};

const openapiSpecification = swaggerJSDoc(options);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(openapiSpecification));

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use(
    session({
        secret: "secret-key",
        cookie: { maxAge: 1000 * 60 * 60 * 24 },
        resave: false,
        saveUninitialized: false,
        secure: true
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('Something broke!');
});

app.use('/register', registerRouter);
app.use('/auth', authRouter);
app.use('/categories', categoriesRouter);
app.use('/products', productsRouter);
app.use('/user', userRouter);
app.use('/cart', cartRouter);
app.use('/checkout', checkoutRouter);
app.use('/orders', orderRouter);

app.get('/swagger.json', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(openapiSpecification)
});

app.get('/', (req, res, next) => {
    res.send({info: `Ecommerce app is running!`});
});

app.get('/error', (req, res, next) => {
    return res.sendFile('error.html', { root: __dirname });
});

app.listen(port, () => {
    Database.createTables();
    console.log(`Ecommerce app is running on port ${port}`);
});

module.exports = app;