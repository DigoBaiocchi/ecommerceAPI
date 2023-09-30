const express = require('express');
const router = express.Router();
const { Database } = require('../db/databaseQueries');

router.get('/', async (req, res, next) => {
    const orders = await Database.getAllOrders();
    return res.status(200).json(`All orders are loaded`);
});

router.get('/:userId', async (req, res, next) => {
    const userId = Number(req.params.userId);
    const validUser = await Database.selectUserById(userId);;

    if(!validUser) {
        return res.status(400).json(`User id ${userId} does not exists`)
    }

    const userOrders = await Database.getAllUserOrders(userId);
    return res.status(200).json(`All orders for user ${userId} were loaded`);
});

router.get('/:userId/:orderId', async (req, res, next) => {
    const userId = Number(req.params.userId);
    const orderId = Number(req.params.orderId);

    const validUser = await Database.selectUserById(userId);
    if(!validUser) {
        return res.status(400).json(`User id ${userId} was not found`)
    }

    const validOrder = await Database.getOrderData(userId, orderId);
    console.log(validOrder)
    if(validOrder.length === 0) {
        return res.status(400).json(`Order number ${orderId} was not found`)
    }

    return res.status(200).json(`Order ${orderId} has been selected for user ${userId}`);
});

router.patch('/:userId/:orderId', async (req, res, next) => {
    const userId = Number(req.params.userId);
    const orderId = Number(req.params.orderId);
    const { orderStatus } = req.body;

    if(!orderStatus) {
        return res.status(400).json(`No order status was provided`);
    }

    const validUser = await Database.selectUserById(userId);
    if(!validUser) {
        return res.status(400).json(`User id ${userId} was not found`)
    }

    const validOrder = await Database.getOrderData(userId, orderId);
    
    if(validOrder.length === 0) {
        return res.status(400).json(`Order number ${orderId} was not found`)
    }
    
    const updateOrderStatus = await Database.updateOrderStatus(orderId, userId, orderStatus);
    
    return res.status(200).json(`Order ${orderId} has been updated for user ${userId}`);
});

router.delete('/:userId/:orderId', async (req, res, next) => {
    const userId = Number(req.params.userId);
    const orderId = Number(req.params.orderId);

    const validUser = await Database.selectUserById(userId);
    if(!validUser) {
        return res.status(400).json(`User id ${userId} was not found`)
    }

    const validOrder = await Database.getOrderData(userId, orderId);
    
    if(validOrder.length === 0) {
        return res.status(400).json(`Order number ${orderId} was not found`)
    }

    const deleteOrder = await Database.deleteOrder(orderId, userId);

    return res.status(200).json(`Order number ${orderId} was deleted`);
});

router.delete('/:userId', async (req, res, next) => {
    const userId = Number(req.params.userId);

    const validUser = await Database.selectUserById(userId);
    if(!validUser) {
        return res.status(400).json(`User id ${userId} was not found`)
    }

    const deleteAllUserOrders = await Database.deleteAllUserOrders(userId);

    return res.status(200).json(`All user's ${userId} orders were deleted`);
});

module.exports = router;