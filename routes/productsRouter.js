const express = require('express');
const router = express.Router();
const { Database } = require('../db/databaseQueries');
const newProductId = '';

router.get('/', async (req, res, next) => {
    const getAllProducts = await Database.getAllProducts();
    if (getAllProducts.length !== 0) {
        return res.status(200).json("All products are loaded");
    }
    return res.status(400).json("No products in the database");
});

router.get('/:name', async (req, res, next) => {
    const { name } = req.params;
    const productData = await Database.getProductByName(name);
    if (!productData) {
        return res.status(400).json(`No product ${name} was found`);
    }
    return res.status(200).json(`Product ${name} data is loaded`);
});

router.post('/add-product', async (req, res, next) => {
    const { categoryId, name, quantity, description, price } = req.body;
    
    if (!name || !quantity || !description || !price) {
        return res.status(400).json('Product not added. Missing required information');
    }
    const existentProduct = await Database.checkIfProductAlreadyExists(name);
    if (existentProduct) {
        return res.status(400).json(`Product ${name} already exists`)
    }
    const addProduct = await Database.addProduct(categoryId, name, quantity, description, price);
    return res.status(200).json(`Product ${name} successfully added`);
});

router.put('/edit-product', async (req, res, next) => {
    const { id, name, quantity, description, price } = req.body;
    
    if(!name || !quantity || !description || !price) {
        return res.status(400).json('Product not updated. Missing required information');
    }

    const existentProduct = await Database.checkIfProductAlreadyExists(id);
    if(!existentProduct) {
        return res.status(400).json(`Product with id ${id} was not found`);
    }
    const updateProductData = await Database.updateProduct(id, name, quantity, description, price);
    return res.status(200).json(`Product with id ${id} info updated`);
});

router.delete('/delete-product/:name', async (req, res, next) => {
    const { name } = req.params;
    const existentProduct = await Database.checkIfProductAlreadyExists(name);
    if(!existentProduct) {
        return res.status(400).json('No product was found')
    }
    const deleteProduct = await Database.deleteProduct(name);
    return res.status(200).json('Product has been deleted');
});

module.exports = router;