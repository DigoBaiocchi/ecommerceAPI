const express = require('express');
const router = express.Router();
const { Database } = require('../db/databaseQueries');

const checkProductIsValid = async (req, res, next) => {
    const { productId } = req.params;
    const product = await Database.getItemById("products", productId);
    if (!product) {
        return res.status(400).json({ error: `Product was not found` });
    } else {
        req.productData = product;
        next();
    }
};

const checkingRequiredInformation = (req, res, next) => {
    const { name, quantity, description, price } = req.body;
    if (!name || !quantity || !description || !price) {
        return res.status(401).json({ error: 'Missing required information' });
    } else {
        next();
    }
};

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
    
    return res.status(200).json({ message: "All products are loaded", data: getAllProducts });
    
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

router.get('/:productId', checkProductIsValid, async (req, res, next) => {
    return res.status(200).json({ message: `Product data was loaded`, data: req.productData });
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
 *                  description: Missing required information
 *              401:
 *                  description: Product already exists
*/

router.post('/add-product', checkingRequiredInformation, async (req, res, next) => {
    // check if product name was already exists in database
    const validProductName = await Database.getItemByName("products", req.body.name);
    if (validProductName) {
        return res.status(400).json({ error: `Product already exists` })
    }
    
    const addProduct = await Database.addProduct(
        req.body.categoryId, 
        req.body.name, 
        req.body.quantity, 
        req.body.description, 
        req.body.price
    );

    return res.status(200).json({ message: `Product was successfully added` });
});

/**
 * @swagger
 * /products/edit-product:
 *      put:
 *          tags:
 *              - Products
 *          description: Update product in the database
 *          parameters:
 *              - name: productName
 *                in: path
 *                description: name of product to be deleted
 *                required: true
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
 *                  description: Product was not found
 *              401:
 *                  description: Missing required information
*/

router.put('/edit-product/:productId', checkProductIsValid, checkingRequiredInformation, async (req, res, next) => {
    const updateProductData = await Database.updateProduct(
        req.productData.id, 
        req.body.name, 
        req.body.quantity, 
        req.body.description, 
        req.body.price
    );
    
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

router.delete('/delete-product/:productId', checkProductIsValid, async (req, res, next) => {
    const deleteProduct = await Database.deleteProduct(req.productData.id);
    
    return res.status(200).json({ message: 'Product has been deleted' });
});

module.exports = router;