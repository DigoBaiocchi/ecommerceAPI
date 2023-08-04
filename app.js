const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.get('/', (req, res, next) => {
    res.json({info: 'Ecommerce app is running here!'});
});

app.listen(port, () => {
    console.log(`Ecommerce app is running on port ${port}`);
});