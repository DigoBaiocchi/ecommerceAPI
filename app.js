const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
require('./strategies/local');
const session = require('express-session');
const port = 3000;

const registerRouter = require('./routes/registerRouter');
const authRouter = require('./routes/authRouter');
const categoriesRouter = require('./routes/categoriesRouter');
const productsRouter = require('./routes/productsRouter');

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

app.get('/', (req, res, next) => {
    res.send({info: `Ecommerce app is running!`});
});

app.get('/error', (req, res, next) => {
    return res.sendFile('error.html', { root: __dirname });
});

app.listen(port, () => {
    console.log(`Ecommerce app is running on port ${port}`);
});

module.exports = app;