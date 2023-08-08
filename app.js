const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const registerRouter = require('./routes/registerRouter');

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('Something broke!');
});

app.use('/register', registerRouter);

app.get('/', (req, res, next) => {
    res.send({info: `Ecommerce app is running!`});
});

app.get('/error', (req, res, next) => {
    return res.sendFile('error.html', { root: __dirname });
});

app.listen(port, () => {
    console.log(`Ecommerce app is running on port ${port}`);
});