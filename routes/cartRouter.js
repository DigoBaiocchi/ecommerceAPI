const express = require('express');
const router = express.Router();
const { Database } = require('../db/databaseQueries');

router.post('/', async (req, res, next) => {
    const { userId, productId, totalUnits } = req.body;
    
    const validUserId = await Database.selectUserById(userId);
    if(!validUserId) {
        return res.status(400).json(`No user id ${userId} was found`);
    }

    const validProductId = await Database.checkIfProductAlreadyExists(productId);
    if(!validProductId) {
        return res.status(400).json(`No product id ${productId} was found`);
    }

    const getProductData = await Database.getProductById(productId);
    const totalProductQty = getProductData.total_available;
    if(totalUnits < 1 || totalUnits > totalProductQty) {
        return res.status(400).json(`Product has less than ${totalUnits} units`)
    }

    const addProductToCart = await Database.addProductToCart(userId, productId, totalProductQty);
    return res.status(201).json(`Product ${userId} has added to the cart`);
});

router.get('/', async (req, res, next) => {
    const { userId } = req.body;
    const validUserId = await Database.selectUserById(userId);

    if(!validUserId) {
        return res.status(400).json(`User ${userId} was not found`);
    }

    const userCartData = await Database.selectCartProducts(userId);

    return res.status(200).json(`Cart selected for user ${userId}`);
});

router.put('/', async (req, res, next) => {
    const { userId, productId, totalUnits } = req.body;

    const validUserId = await Database.selectUserById(userId);
    if(!validUserId) {
        return res.status(400).json(`User id ${userId} was not found`);
    }

    const validProductId = await Database.checkIfProductAlreadyExists(productId);
    if(!validProductId) {
        return res.status(400).json(`Product id ${productId} was not found`);
    }

    const getProductData = await Database.getProductById(productId);
    const totalProductQty = getProductData.total_available;
    if(totalUnits < 1 || totalUnits > totalProductQty) {
        return res.status(400).json(`Product has less than ${totalUnits} units`)
    }

    const updateCartProductQuantity = await Database.updateProductQuanityInCart(userId, productId, totalUnits)

    return res.status(200).json(`Quantity for product id ${productId} was updated in the cart`);
});

router.delete('/:userId/:productId', async (req, res, next) => {
    const userId = Number(req.params.userId);
    const productId = Number(req.params.productId);

    const validUserId = await Database.selectUserById(userId);
    if(!validUserId) {
        return res.status(400).json(`User id ${userId} was not found`);
    }

    const validProductId = await Database.checkIfProductAlreadyExists(productId);
    if(!validProductId) {
        return res.status(400).json(`Product id ${productId} was not found`);
    }

    const deleteProductFromCart = await Database.deleteProductFromCart(userId, productId)
    return res.status(200).json(`Product id ${productId} delete from user ${userId} cart`)
});

module.exports = router;