const express = require('express');
const router = express.Router();
const { Database } = require('../db/databaseQueries');

/**
 * @swagger
 * components:
 *      schemas:
 *          Add_Product_Cart_Object:
 *              type: object
 *              properties:
 *                  userId:
 *                      type: integer
 *                      example: 8
 *                  productId:
 *                      type: integer
 *                      example: 2
 *                  totalUnits:
 *                      type: integer
 *                      example: 12
 *          Get_Products_Data_From_Cart:
 *              type: object
 *              properties:
 *                  msg:
 *                      type: string
 *                      example: Cart selected for user
 *                  cartData:
 *                      $ref: '#/components/schemas/Add_Product_Cart_Object'
 *              xml:
 *                  name: cart_data          
 */

/**
 * @swagger
 * /cart:
 *      post:
 *          tags:
 *              - Cart
 *          description: Add product to cart
 *          requestBody:
 *              description: Get product id and totalUnits to add product to cart
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Add_Product_Cart_Object'
 *                  application/xml:
 *                      schema:
 *                          $ref: '#/components/schemas/Add_Product_Cart_Object'
 *          responses:
 *              200:
 *                  description: Product quantity has been udpated in the cart
 *              201:
 *                  description: Product was added to cart table
 *              400:
 *                  description: User id was not found
 *              401:
 *                  description: Product id was not found
 *              402:
 *                  description: Product has less than ${totalUnits} units
 *              403:
 *                  description: Product total in the cart can't be zero. Do you want to delete this product from cart?
 *              404:
 *                  description: Product does not have that many units
 *              405:
 *                  description: Total units for product needs to be greater than zero to be added to cart
 *              500:
 *                  description: User is not logged in
 */

router.post('/', async (req, res, next) => {
    // check if user is not logged in
    if(!req.session.passport) {
        return res.status(500).json({msg: `User is not logged in`});    
    } else {
        const { productId, totalUnits } = req.body;
        const userId = req.session.passport.user.userId;
        const productAlreadyInCart = await Database.selectProductInCart(userId, productId);
        
        const validUserId = await Database.selectUserById(userId);
        if(!validUserId) {
            return res.status(400).json(`User id was not found`);
        }
        
        const validProductId = await Database.checkIfProductAlreadyExists(productId);
        if(!validProductId) {
            return res.status(401).json(`Product id was not found`);
        }
        
        const getProductData = await Database.getProductById(productId);
        const totalProductQty = getProductData.total_available;
        if(totalUnits > totalProductQty) {
            return res.status(402).json(`Product has less than ${totalUnits} units`)
        }

        if(productAlreadyInCart) {
            console.log(productAlreadyInCart)
            const newAmount = productAlreadyInCart.total_units + totalUnits;
            if(newAmount < 1) {
                return res.status(403).json(`Product total in the cart can't be zero. Do you want to delete this product from cart?`);
            }
            if (newAmount > totalProductQty) {
                return res.status(404).json(`Product does not have that many units`);
            }
            const updateCart = await Database.updateProductQuanityInCart(userId, productId, newAmount);
            return res.status(200).json(`Product ${productId} quantity has been udpated in the cart`);
        } else {
            if(totalUnits < 1) {
                return res.status(405).json(`Total units for product needs to be greater than zero to be added to cart`);
            }
            const addToCartTable = await Database.addProductToCart(userId, productId, totalUnits);
            return res.status(201).json(`Product ${productId} was added to cart table`);
        }
    }
});

/**
 * @swagger
 * /cart:
 *      get:
 *          tags:
 *              - Cart
 *          description: Get user's cart
 *          produces:
 *              - application/json
 *          responses:
 *              200:
 *                  description: Cart selected for user
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Get_Products_Data_From_Cart'
 *                      application/xml:
 *                          schema:
 *                              $ref: '#/components/schemas/Get_Products_Data_From_Cart'
 *              400:
 *                  description: User was not found
 *              500:
 *                  description: User is not logged in
 */

router.get('/', async (req, res, next) => {
    // check if user is not logged in
    if(!req.session.passport) {
        return res.status(500).json({msg: `User is not logged in`});    
    } else {
        const userId = req.session.passport.user.userId;
        const validUserId = await Database.selectUserById(userId);
        
        if(!validUserId) {
            return res.status(400).json(`User was not found`);
        }
        
        const userCartData = await Database.selectCartProducts(userId);
        
        return res.status(200).json({msg: `Cart selected for user`, cart: userCartData});
    }
});

/**
 * @swagger
 * /cart/:userId/:productId:
 *      delete:
 *          tags:
 *              - Cart
 *          description: Delete product from cart
 *          parameters:
 *              - name: userId
 *                in: path
 *                description: Get user id
 *                required: true
 *              - name: productId
 *                in: path
 *                description: Get product id
 *                required: true
 *          responses:
 *              200:
 *                  description: Product was deleted from user userId cart
 *              400:
 *                  description: User id was not found
 *              401:
 *                  description: Product id was not found
 *              402:
 *                  description: No products in the cart
 *              500:
 *                  description: User is not logged in
 */

router.delete('/:userId/:productId', async (req, res, next) => {
    // check if user is not logged in
    if(!req.session.passport) {
        return res.status(500).json({msg: `User is not logged in`});
    } else {
        const userId = Number(req.params.userId);
        const validUserId = await Database.selectUserById(userId);
        if(!validUserId) {
            return res.status(400).json(`User id was not found`);
        }
        
        const productId = Number(req.params.productId);
        const validProductId = await Database.checkIfProductAlreadyExists(productId);
        if(!validProductId) {
            return res.status(401).json(`Product id was not found`);
        }

        const productAlreadyInCart = await Database.selectProductInCart(userId, productId);
        if(!productAlreadyInCart) {
            return res.status(402).json(`No products in the cart`);
        }
        
        const deleteProductFromCart = await Database.deleteProductFromCart(userId, productId)
        return res.status(200).json(`Product was deleted from user userId cart`)
    }
});

/**
 * @swagger
 * /cart/:userId/:
 *      delete:
 *          tags:
 *              - Cart
 *          description: Delete user's cart
 *          parameters:
 *              - name: userId
 *                in: path
 *                description: Get user id
 *                required: true
 *          responses:
 *              200:
 *                  description: All products deleted from user's' cart
 *              400:
 *                  description: User id was not found
 *              401:
 *                  description: Product id was not found
 *              402:
 *                  description: No products in the cart
 *              500:
 *                  description: User is not logged in
 */

router.delete('/:userId', async (req, res, next) => {
    // check if user is not logged in
    if(!req.session.passport) {
        return res.status(500).json({msg: `User is not logged in`});
    } else {
        const validUserId = await Database.selectUserById(userId);
        if(!validUserId && userId !== 0) {
            return res.status(400).json(`User id was not found`);
        }
        
        const userId = Number(req.params.userId);
        if(!validUserId) {
            return res.status(402).json(`User id ${userId} was not found`);
        }
        
        const productsInUserCart = await Database.selectCartProducts(userId);
        if(productsInUserCart.length === 0) {
            return res.status(403).json(`No products in the user ${userId} cart`);
        }
        const deleteProductFromCart = await Database.deleteAllProductsFromCart(userId);
        return res.status(200).json({msg: `All products deleted from user cart`, cart: productsInUserCart});
    }
});

module.exports = router;