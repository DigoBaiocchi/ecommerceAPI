const express = require('express');
const router = express.Router();
const { Database } = require('../db/databaseQueries');

router.get('/', (req, res, next) => {
    return res.status(200).json(`All orders are loaded`);
});

router.get('/:userId', (req, res, next) => {
    const userId = Number(req.params.userId);
    const validUser = userId === 6;

    if(!validUser) {
        return res.status(400).json(`User id ${userId} does not exists`)
    }
    return res.status(200).json(`All orders for user ${userId} were loaded`);
});

router.put('/:userId/:orderId', (req, res, next) => {
    const userId = Number(req.params.userId);
    const orderId = Number(req.params.orderId);

    const validUser = userId === 6;
    if(!validUser) {
        return res.status(400).json(`User id ${userId} was not found`)
    }

    const validOrder = orderId === 1;
    if(!validOrder) {
        return res.status(400).json(`Order number ${orderId} was not found`)
    }

    return res.status(200).json(`Order ${orderId} has been updated for user ${userId}`);
});

router.delete('/:userId/:orderId', (req, res, next) => {
    const userId = Number(req.params.userId);
    const orderId = Number(req.params.orderId);

    const validUser = userId === 6;
    if(!validUser) {
        return res.status(400).json(`User id ${userId} was not found`)
    }

    const validOrder = orderId === 1;
    if(!validOrder) {
        return res.status(400).json(`Order number ${orderId} was not found`)
    }

    return res.status(200).json(`Order number ${orderId} was deleted`);
});

router.delete('/:userId', (req, res, next) => {
    const userId = Number(req.params.userId);

    const validUser = userId === 6;
    if(!validUser) {
        return res.status(400).json(`User id ${userId} was not found`)
    }

    return res.status(200).json(`All user's ${userId} orders were deleted`);
});

module.exports = router;