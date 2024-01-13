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
 *          Error_UserIsNotLoggedIn:
 *              type: object
 *              properties:
 *                  error:
 *                      type: string
 *                      example: User is not logged in
 *          Error_InsufficientProductUnits:
 *              type: object
 *              properties:
 *                  error:
 *                      type: string
 *                      example: Product has less than ${totalUnits} units
 *          Error_QuantityIsZero:
 *              type: object
 *              properties:
 *                  error:
 *                      type: string
 *                      example: Product total in the cart can't be zero. Do you want to delete this product from cart?
 *          Error_ProductIdNotFound:
 *              type: object
 *              properties:
 *                  error:
 *                      type: string
 *                      example: Product id was not found
 *          Error_NoProductsInCart:
 *              type: object
 *              properties:
 *                  error:
 *                      type: string
 *                      example: No products in the cart
 *          Error_ProductIdParamNotProvided:
 *              type: object
 *              properties:
 *                  error:
 *                      type: string
 *                      example: ProductId parameter was not provided
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
 *                  description: Bad Request - multiple responses
 *                  content:
 *                      application/json:
 *                          schema:
 *                              oneOf:
 *                                  - $ref: '#/components/schemas/Error_InsufficientProductUnits'
 *                                  - $ref: '#/components/schemas/Error_QuantityIsZero'
 *                      application/xml:
 *                          schema:
 *                              oneOf:
 *                                  - $ref: '#/components/schemas/Error_InsufficientProductUnits'
 *                                  - $ref: '#/components/schemas/Error_QuantityIsZero'
 *              401:
 *                  description: User is not logged in
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Error_UserIsNotLoggedIn'
 *                      application/xml:
 *                          schema:
 *                              $ref: '#/components/schemas/Error_UserIsNotLoggedIn'
 *              404:
 *                  description: Product id was not found
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Error_ProductIdNotFound'
 *                      application/xml:
 *                          schema:
 *                              $ref: '#/components/schemas/Error_ProductIdNotFound'
 */

router.post('/', async (req, res, next) => {
    // check if user is not logged in
    if(!req.session.passport) {
        return res.status(401).json({ error: `User is not logged in` });
    } else {
        const { productId, totalUnits } = req.body;
        const userId = req.session.passport.user.userId;
        const productAlreadyInCart = await Database.selectProductInCart(userId, productId);
        
        const validProductId = await Database.checkIfProductAlreadyExists(productId);
        if(!validProductId) {
            return res.status(404).json({ error: `Product id was not found` });
        }
        
        const getProductData = await Database.getProductById(productId);
        const totalProductQty = getProductData.quantity;
        if(totalUnits > totalProductQty) {
            return res.status(400).json({ error: `Product does not have that many units` });
        }

        if(productAlreadyInCart) {
            console.log(productAlreadyInCart)
            const newAmount = productAlreadyInCart.quantity + totalUnits;
            if(newAmount < 1) {
                return res.status(400).json({ error: `Product total in the cart can't be zero. Do you want to delete this product from cart?` });
            }
            if (newAmount > totalProductQty) {
                return res.status(400).json({ error: `Product does not have that many units` });
            }
            const updateCart = await Database.updateProductQuanityInCart(userId, productId, newAmount);
            return res.status(200).json({ message: `Product ${productId} quantity has been udpated in the cart` });
        } else {
            if(totalUnits < 1) {
                return res.status(400).json({ error: `Product total in the cart can't be zero. Do you want to delete this product from cart?` });
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
 *              500:
 *                  description: User is not logged in
 */

router.get('/', async (req, res, next) => {
    // check if user is not logged in
    if(!req.session.passport) {
        return res.status(500).json({ error: `User is not logged in` });
    } 

    const userId = req.session.passport.user.userId;
    
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
 *                  description: ProductId parameter was not provided
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Error_ProductIdParamNotProvided'
 *                      application/xml:
 *                          schema:
 *                              $ref: '#/components/schemas/Error_ProductIdParamNotProvided'
 *              401:
 *                  description: User is not logged in
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Error_UserIsNotLoggedIn'
 *                      application/xml:
 *                          schema:
 *                              $ref: '#/components/schemas/Error_UserIsNotLoggedIn'
 *              404:
 *                  description: Not Found - multiple responses
 *                  content:
 *                      application/json:
 *                          schema:
 *                              oneOf:
 *                                  - $ref: '#/components/schemas/Error_ProductIdNotFound'
 *                                  - $ref: '#/components/schemas/Error_NoProductsInCart'
 *                      application/xml:
 *                          schema:
 *                              oneOf:
 *                                  - $ref: '#/components/schemas/Error_ProductIdNotFound'
 *                                  - $ref: '#/components/schemas/Error_NoProductsInCart'
 */

router.delete('/delete-product', async (req, res, next) => {
    // Check if user is not logged in
    if (!req.session.passport) {
      return res.status(401).json({ error: 'User is not logged in' });
    }
  
    // Check if productId query param is not provided  
    if (!req.query.productId) {
      return res.status(400).json({ error: 'ProductId parameter was not provided' });
    }
  
    const userId = req.session.passport.user.userId;
    const productId = Number(req.query.productId);
    
    // Check if the product ID is valid
    const validProductId = await Database.checkIfProductAlreadyExists(productId);
    if (!validProductId) {
      return res.status(404).json({ error: 'Product id was not found' });
    }
    
    // Check if the product is already in the cart
    const productAlreadyInCart = await Database.selectProductInCart(userId, productId);
    if (!productAlreadyInCart) {
        return res.status(404).json({ error: 'No products in the cart' });
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
 *              401:
 *                  description: User is not logged in
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Error_UserIsNotLoggedIn'
 *                      application/xml:
 *                          schema:
 *                              $ref: '#/components/schemas/Error_UserIsNotLoggedIn'
 *              404:
 *                  description: No products in the cart
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Error_NoProductsInCart'
 *                      application/xml:
 *                          schema:
 *                              $ref: '#/components/schemas/Error_NoProductsInCart'
 */

router.delete('/delete-cart', async (req, res, next) => {
    // check if user is not logged in
    if(!req.session.passport) {
        return res.status(401).json({ error: `User is not logged in` });
    } else {
        const userId = req.session.passport.user.userId;
        
        const productsInUserCart = await Database.selectCartProducts(userId);
        if(productsInUserCart.length === 0) {
            return res.status(404).json({ error: `No products in the cart` });
        }
        const deleteProductFromCart = await Database.deleteAllProductsFromCart(userId);
        return res.status(200).json({ message: `All products deleted from user cart` });
    }
});

module.exports = router;