const express = require('express');
const router = express.Router();
const { Database } = require('../db/databaseQueries');

/**
 * @swagger
 * components:
 *      schemas:
 *          Product_Object:
 *              type: object
 *              properties:
 *                  categoryId:
 *                      type: integer
 *                      example: 5
 *                  id:
 *                      type: integer
 *                      example: 10
 *                  name:
 *                      type: string
 *                      example: Cellphone
 *                  quantity:
 *                      type: integer
 *                      example: 300
 *                  description:
 *                      type: string
 *                      example: This is a cellphone
 *                  price:
 *                      type: money
 *                      example: $500.99
 *          All_Products:
 *              type: object
 *              properties:
 *                  msg:
 *                      type: string
 *                      example: All products
 *                  data:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Product_Object'
 *              xml:
 *                  name: product
 *          Product:
 *              type: object
 *              properties:
 *                  msg:
 *                      type: string
 *                      example: Product data was loaded
 *                  data:
 *                      $ref: '#/components/schemas/Product_Object'
 *              xml:
 *                  name: product
 */

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
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/All_Products'
 *                      application/xml:
 *                          schema:
 *                              $ref: '#/components/schemas/All_Products'
 *              400:
 *                  description: No products in the database
 */

router.get('/', async (req, res, next) => {
    const getAllProducts = await Database.getAllProducts();
    if (getAllProducts.length !== 0) {
        return res.status(200).json({ message: "All products are loaded", data: getAllProducts });
    }
    return res.status(400).json({ error: "No products in the database" });
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
 *                  description: Product data was loaded
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Product'
 *                      application/xml:
 *                          schema:
 *                              $ref: '#/components/schemas/Product'
 *              400:
 *                  description: Product was not found
 */

router.get('/:name', async (req, res, next) => {
    const { name } = req.params;
    const productData = await Database.getProductByName(name);
    if (!productData) {
        return res.status(400).json({ error: `Product was not found` });
    }
    return res.status(200).json({ message: `Product data was loaded`, data: productData });
});

/**
 * @swagger
 * /products/add-product:
 *      post:
 *          tags:
 *              - Products
 *          description: Add product to database
 *          requestBody:
 *              description: Update product object
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product_Object'
 *                  application/xml:
 *                      schema:
 *                          $ref: '#/components/schemas/Product_Object'
 *          responses:
 *              200:
 *                  description: Product was successfully added
 *              400:
 *                  description: Product not added. Missing required information+
 *              401:
 *                  description: Product already exists
 */

router.post('/add-product', async (req, res, next) => {
    const { categoryId, name, quantity, description, price } = req.body;
    
    if (!name || !quantity || !description || !price) {
        return res.status(400).json({ error: 'Product not added. Missing required information' });
    }
    const existentProduct = await Database.checkIfProductAlreadyExists(name);
    if (existentProduct) {
        return res.status(401).json({ error: `Product already exists` })
    }
    const addProduct = await Database.addProduct(categoryId, name, quantity, description, price);
    return res.status(200).json({ message: `Product was successfully added` });
});

/**
 * @swagger
 * /products/edit-product:
 *      put:
 *          tags:
 *              - Products
 *          description: Update product in the database
 *          requestBody:
 *              description: Update product object
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product_Object'
 *                  application/xml:
 *                      schema:
 *                          $ref: '#/components/schemas/Product_Object'
 *          responses:
 *              200:
 *                  description: Product was successfully updated
 *              400:
 *                  description: Product id was not found
 *              401:
 *                  description: Product not updated. Missing required information
 */

router.put('/edit-product', async (req, res, next) => {
    const { id, name, quantity, description, price } = req.body;
    
    if(!name || !quantity || !description || !price) {
        return res.status(401).json({ error: 'Product not updated. Missing required information' });
    }
    
    const existentProduct = await Database.checkIfProductAlreadyExists(id);
    if(!existentProduct) {
        return res.status(400).json({ error: `Product with id was not found` });
    }
    const updateProductData = await Database.updateProduct(id, name, quantity, description, price);
    return res.status(200).json({ message: `Product was successfully updated` });
});

/**
 * @swagger
 * /delete-product/:productName:
 *      delete:
 *          tags:
 *              - Products
 *          description: Delete product from the database
 *          parameters:
 *              - name: productName
 *                in: path
 *                description: name of product to be deleted
 *                required: true
 *          responses:
 *              200:
 *                  description: Product has been deleted
 *              400:
 *                  description: Product was not found
 */

router.delete('/delete-product/:productName', async (req, res, next) => {
    const { productName } = req.params;
    const existentProduct = await Database.checkIfProductAlreadyExists(productName);
    if(!existentProduct) {
        return res.status(400).json({ error: 'Product was not found' })
    }
    const deleteProduct = await Database.deleteProduct(productName);
    return res.status(200).json({ message: 'Product has been deleted' });
});

module.exports = router;