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
        return res.status(500).json({ error: `User is not logged in` });
    } else {
        const { productId, totalUnits } = req.body;
        const userId = req.session.passport.user.userId;
        const productAlreadyInCart = await Database.selectProductInCart(userId, productId);
        
        const validUserId = await Database.selectUserById(userId);
        if(!validUserId) {
            return res.status(400).json({ error: `User id was not found` });
        }
        
        const validProductId = await Database.checkIfProductAlreadyExists(productId);
        if(!validProductId) {
            return res.status(401).json({ error: `Product id was not found` });
        }
        
        const getProductData = await Database.getProductById(productId);
        const totalProductQty = getProductData.total_available;
        if(totalUnits > totalProductQty) {
            return res.status(402).json({ error: `Product has less than ${totalUnits} units` })
        }

        if(productAlreadyInCart) {
            console.log(productAlreadyInCart)
            const newAmount = productAlreadyInCart.total_units + totalUnits;
            if(newAmount < 1) {
                return res.status(403).json({ error: `Product total in the cart can't be zero. Do you want to delete this product from cart?` });
            }
            if (newAmount > totalProductQty) {
                return res.status(404).json({ error: `Product does not have that many units` });
            }
            const updateCart = await Database.updateProductQuanityInCart(userId, productId, newAmount);
            return res.status(200).json({ message: `Product ${productId} quantity has been udpated in the cart` });
        } else {
            if(totalUnits < 1) {
                return res.status(405).json({ error: `Total units for product needs to be greater than zero to be added to cart` });
            }
            const addToCartTable = await Database.addProductToCart(userId, productId, totalUnits);
            return res.status(201).json({ message: `Product ${productId} was added to cart table` });
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
        return res.status(500).json({ error: `User is not logged in` });
    } 

    const userId = req.session.passport.user.userId;
    const validUserId = await Database.selectUserById(userId);
    if(!validUserId) {
        return res.status(400).json({ error: `User was not found`});
    }
    
    const userCartData = await Database.selectCartProducts(userId);
    
    return res.status(200).json({ message: `Cart selected for user`, cart: userCartData });
});

/**
 * @swagger
 * /cart/delete-product:
 *      delete:
 *          tags:
 *              - Cart
 *          description: Delete product from cart
 *          parameters:
 *              - name: productId
 *                in: query
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

router.delete('/delete-product', async (req, res, next) => {
    // Check if user is not logged in
    if (!req.session.passport) {
      return res.status(500).json({ error: 'User is not logged in' });
    }
  
    // Check if productId query param is not provided  
    if (!req.query.productId) {
      return res.status(402).json({ error: 'ProductId parameter was not provided' });
    }
  
    const userId = req.session.passport.user.userId;
  
    // Check if the user ID is valid
    const validUserId = await Database.selectUserById(userId);
    if (!validUserId) {
      return res.status(400).json({ error: 'User id was not found' });
    }
  
    // Check if the product ID is valid
    const productId = Number(req.query.productId);
    const validProductId = await Database.checkIfProductAlreadyExists(productId);
  
    if (!validProductId) {
      return res.status(404).json({ error: 'Product id was not found' });
    }
  
    // Check if the product is already in the cart
    const productAlreadyInCart = await Database.selectProductInCart(userId, productId);
    if (!productAlreadyInCart) {
      return res.status(402).json({ error: 'No products in the cart' });
    }
  
    // Delete the product from the cart
    const deleteProductFromCart = await Database.deleteProductFromCart(userId, productId);
  
    return res.status(200).json({ message: 'Product was deleted from user cart' });
  });  

/**
 * @swagger
 * /cart/delete-cart:
 *      delete:
 *          tags:
 *              - Cart
 *          description: Delete user's cart
 *          responses:
 *              200:
 *                  description: All products deleted from user's' cart
 *              400:
 *                  description: User id was not found
 *              401:
 *                  description: No products in the cart
 *              500:
 *                  description: User is not logged in
 */

router.delete('/delete-cart', async (req, res, next) => {
    // check if user is not logged in
    if(!req.session.passport) {
        return res.status(500).json({ error: `User is not logged in` });
    } else {
        const userId = req.session.passport.user.userId;
        const validUserId = await Database.selectUserById(userId);
        if(!validUserId) {
            return res.status(400).json({ error: `User id was not found` });
        }
        
        const productsInUserCart = await Database.selectCartProducts(userId);
        if(productsInUserCart.length === 0) {
            return res.status(401).json({ error: `No products in the cart` });
        }
        const deleteProductFromCart = await Database.deleteAllProductsFromCart(userId);
        return res.status(200).json({ message: `All products deleted from user cart` });
    }
});

module.exports = router;