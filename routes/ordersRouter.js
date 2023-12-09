const express = require('express');
const router = express.Router();
const { Database } = require('../db/databaseQueries');

/**
 * @swagger
 * /orders:
 *      get:
 *          tags:
 *              - Orders
 *          description: Get all the orders
 *          produces:
 *              - application/json
 *          responses:
 *              200:
 *                  description: Get all the orders
 *                  schema:
 *                      $ref: '#definitions/orders'
 */

router.get('/', async (req, res, next) => {
    const orders = await Database.getAllOrders();
    return res.status(200).json({msg: `All orders are loaded`, data: orders});
});

/**
 * @swagger
 * /orders/:userId:
 *      get:
 *          tags:
 *              - Orders
 *          description: Get all the orders from user
 *          produces:
 *              - application/json
 *          responses:
 *              200:
 *                  description: All orders for user were loaded
 *                  schema:
 *                      $ref: '#definitions/orders'
 *              400:
 *                  description: User id does not exists
 *                  schema:
 *                      $ref: '#definitions/orders'
 */

router.get('/:userId', async (req, res, next) => {
    const userId = Number(req.params.userId);
    const validUser = await Database.selectUserById(userId);;
    
    if(!validUser) {
        return res.status(400).json({msg: `User id ${userId} does not exists`});
    }
    
    const userOrders = await Database.getAllUserOrders(userId);
    return res.status(200).json({msg: `All orders for user ${userId} were loaded`, data: userOrders});
});

/**
 * @swagger
 * /orders/:userId/:orderId:
 *      get:
 *          tags:
 *              - Orders
 *          description: Get order from user by order id
 *          produces:
 *              - application/json
 *          responses:
 *              200:
 *                  description: Order orderId has been selected for user 
 *                  schema:
 *                      $ref: '#definitions/orders'
 *              400:
 *                  description: User id was not found
 *                  schema:
 *                      $ref: '#definitions/orders'
 *              401:
 *                  description: Order number was not found
 *                  schema:
 *                      $ref: '#definitions/orders'
 */

router.get('/:userId/:orderId', async (req, res, next) => {
    const userId = Number(req.params.userId);
    const orderId = Number(req.params.orderId);
    
    const validUser = await Database.selectUserById(userId);
    if(!validUser) {
        return res.status(400).json({msg: `User id ${userId} was not found`})
    }
    
    const validOrder = await Database.getOrderData(userId, orderId);
    console.log(validOrder)
    if(validOrder.length === 0) {
        return res.status(401).json({msg: `Order number ${orderId} was not found`})
    }
    
    return res.status(200).json({msg: `Order ${orderId} has been selected for user ${userId}`, data: validOrder});
});

/**
 * @swagger
 * /orders/:userId/:orderId:
 *      patch:
 *          tags:
 *              - Orders
 *          description: Update order info
 *          produces:
 *              - application/json
 *          responses:
 *              200:
 *                  description: Order orderId has been updated for user
 *                  schema:
 *                      $ref: '#definitions/orders'
 *              400:
 *                  description: User id was not found
 *                  schema:
 *                      $ref: '#definitions/orders'
 *              401:
 *                  description: Order number was not found
 *                  schema:
 *                      $ref: '#definitions/orders'
 *              402:
 *                  description: No order status was provided
 *                  schema:
 *                      $ref: '#definitions/orders'
 */

router.patch('/:userId/:orderId', async (req, res, next) => {
    const userId = Number(req.params.userId);
    const orderId = Number(req.params.orderId);
    const { orderStatus } = req.body;
    
    if(!orderStatus) {
        return res.status(402).json({msg: `No order status was provided`});
    }
    
    const validUser = await Database.selectUserById(userId);
    if(!validUser) {
        return res.status(400).json({msg: `User id ${userId} was not found`});
    }
    
    const validOrder = await Database.getOrderData(userId, orderId);
    
    if(validOrder.length === 0) {
        return res.status(401).json({msg: `Order number ${orderId} was not found`});
    }
    
    const updateOrderStatus = await Database.updateOrderStatus(orderId, userId, orderStatus);
    
    return res.status(200).json({msg: `Order ${orderId} has been updated for user ${userId}`});
});

/**
 * @swagger
 * /orders/:userId/:orderId:
 *      delete:
 *          tags:
 *              - Orders
 *          description: Delete order
 *          produces:
 *              - application/json
 *          responses:
 *              200:
 *                  description: Order number was deleted
 *                  schema:
 *                      $ref: '#definitions/orders'
 *              400:
 *                  description: User id was not found
 *                  schema:
 *                      $ref: '#definitions/orders'
 *              401:
 *                  description: Order number was not found
 *                  schema:
 *                      $ref: '#definitions/orders'
 */

router.delete('/:userId/:orderId', async (req, res, next) => {
    const userId = Number(req.params.userId);
    const orderId = Number(req.params.orderId);
    
    const validUser = await Database.selectUserById(userId);
    if(!validUser) {
        return res.status(400).json({msg: `User id ${userId} was not found`});
    }
    
    const validOrder = await Database.getOrderData(userId, orderId);
    
    if(validOrder.length === 0) {
        return res.status(401).json({msg: `Order number ${orderId} was not found`});
    }
    
    const deleteOrder = await Database.deleteOrder(orderId, userId);
    
    return res.status(200).json({msg: `Order number ${orderId} was deleted`});
});

/**
 * @swagger
 * /orders/:userId/:
 *      delete:
 *          tags:
 *              - Orders
 *          description: Delete all order from user
 *          produces:
 *              - application/json
 *          responses:
 *              200:
 *                  description: All user's orders were deleted
 *                  schema:
 *                      $ref: '#definitions/orders'
 *              400:
 *                  description: User id was not found
 *                  schema:
 *                      $ref: '#definitions/orders'
 */

router.delete('/:userId', async (req, res, next) => {
    const userId = Number(req.params.userId);

    const validUser = await Database.selectUserById(userId);
    if(!validUser) {
        return res.status(400).json({msg: `User id ${userId} was not found`});
    }

    const deleteAllUserOrders = await Database.deleteAllUserOrders(userId);

    return res.status(200).json({msg: `All user's ${userId} orders were deleted`});
});

module.exports = router;