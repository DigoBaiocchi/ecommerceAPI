const express = require('express');
const router = express.Router();
const { Database } = require('../db/databaseQueries');

/**
 * @swagger
 * /products:
 *      get:
 *          tags:
 *              - Products
 *          description: Get all the products
 *          produces:
 *              - application/json
 *          responses:
 *              200:
 *                  description: All products are loaded
 *                  schema:
 *                      $ref: '#definitions/products'
 *              400:
 *                  description: No products in the database
 *                  schema:
 *                      $ref: '#definitions/products'
 */

router.get('/', async (req, res, next) => {
    const getAllProducts = await Database.getAllProducts();
    if (getAllProducts.length !== 0) {
        return res.status(200).json({msg: "All products are loaded", data: getAllProducts});
    }
    return res.status(400).json({msg: "No products in the database"});
});

/**
 * @swagger
 * /products/:name:
 *      get:
 *          tags:
 *              - Products
 *          description: Get product data
 *          produces:
 *              - application/json
 *          responses:
 *              200:
 *                  description: Product productName data was loaded
 *                  schema:
 *                      $ref: '#definitions/products'
 *              400:
 *                  description: No product productName in the database
 *                  schema:
 *                      $ref: '#definitions/products'
 */

router.get('/:name', async (req, res, next) => {
    const { name } = req.params;
    const productData = await Database.getProductByName(name);
    if (!productData) {
        return res.status(400).json({msg: `No product ${name} was found`});
    }
    return res.status(200).json({msg: `Product ${name} data is loaded`, data: productData});
});

/**
 * @swagger
 * /products/add-product:
 *      post:
 *          tags:
 *              - Products
 *          description: Add product to database
 *          produces:
 *              - application/json
 *          responses:
 *              200:
 *                  description: Product was successfully added
 *                  schema:
 *                      $ref: '#definitions/products'
 *              400:
 *                  description: Product not added. Missing required information
 *                  schema:
 *                      $ref: '#definitions/products'
 *              401:
 *                  description: Product already exists
 *                  schema:
 *                      $ref: '#definitions/products'
 */

router.post('/add-product', async (req, res, next) => {
    const { categoryId, name, quantity, description, price } = req.body;
    
    if (!name || !quantity || !description || !price) {
        return res.status(400).json({msg: 'Product not added. Missing required information'});
    }
    const existentProduct = await Database.checkIfProductAlreadyExists(name);
    if (existentProduct) {
        return res.status(401).json({msg: `Product ${name} already exists`})
    }
    const addProduct = await Database.addProduct(categoryId, name, quantity, description, price);
    return res.status(200).json({msg: `Product ${name} successfully added`});
});

/**
 * @swagger
 * /products/edit-product:
 *      put:
 *          tags:
 *              - Products
 *          description: Update product in the database
 *          produces:
 *              - application/json
 *          responses:
 *              200:
 *                  description: Product was successfully updated
 *                  schema:
 *                      $ref: '#definitions/products'
 *              400:
 *                  description: Product id was not found
 *                  schema:
 *                      $ref: '#definitions/products'
 *              401:
 *                  description: Product not updated. Missing required information
 *                  schema:
 *                      $ref: '#definitions/products'
 */

router.put('/edit-product', async (req, res, next) => {
    const { id, name, quantity, description, price } = req.body;
    
    if(!name || !quantity || !description || !price) {
        return res.status(401).json({msg: 'Product not updated. Missing required information'});
    }
    
    const existentProduct = await Database.checkIfProductAlreadyExists(id);
    if(!existentProduct) {
        return res.status(400).json({msg: `Product with id ${id} was not found`});
    }
    const updateProductData = await Database.updateProduct(id, name, quantity, description, price);
    return res.status(200).json({msg: `Product with id ${id} info updated`});
});

/**
 * @swagger
 * /delete-product/:name:
 *      delete:
 *          tags:
 *              - Products
 *          description: Delete product from the database
 *          produces:
 *              - application/json
 *          responses:
 *              200:
 *                  description: Product has been deleted
 *                  schema:
 *                      $ref: '#definitions/products'
 *              400:
 *                  description: Product was not found
 *                  schema:
 *                      $ref: '#definitions/products'
 */

router.delete('/delete-product/:name', async (req, res, next) => {
    const { name } = req.params;
    const existentProduct = await Database.checkIfProductAlreadyExists(name);
    if(!existentProduct) {
        return res.status(400).json({msg: 'Product was not found'})
    }
    const deleteProduct = await Database.deleteProduct(name);
    return res.status(200).json({msg: 'Product has been deleted'});
});

module.exports = router;