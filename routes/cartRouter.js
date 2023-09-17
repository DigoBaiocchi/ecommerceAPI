const express = require('express');
const router = express.Router();
const { Database } = require('../db/databaseQueries');

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}


localStorage.clear();

let cart = [];

router.post('/', async (req, res, next) => {
    const { productId, totalUnits } = req.body;
    let userId = 0;
    const validProductId = await Database.checkIfProductAlreadyExists(productId);
    const getProductData = await Database.getProductById(productId);
    const totalProductQty = getProductData.total_available;
    let productAlreadyInCart = 0;

    // check if user is logged in
    if(!req.session.passport) {
        userId = 0;
        cart = [];
        // check if any product was added to temp cart
        if(localStorage.getItem('cart')) {
            cart = JSON.parse(localStorage.getItem('cart'));
            productAlreadyInCart = cart.filter(product => product.productId === productId);
        }

        if(!validProductId) {
            return res.status(400).json(`No product id ${productId} was found`);
        }

        if(totalUnits > totalProductQty) {
            return res.status(400).json(`Product has less than ${totalUnits} units`);
        }

        if(!productAlreadyInCart || productAlreadyInCart.length === 0) {
            if(totalUnits < 1) {
                return res.status(400).json(`Total units for product ${productId} needs to be greater than zero to be added to cart`);
            }
        }
        
        if(productAlreadyInCart && productAlreadyInCart.length !== 0) {
            const newAmount = productAlreadyInCart[0].quantity + totalUnits;
            if(newAmount < 1) {
                return res.status(400).json(`Product ${productId} total in the cart can't be zero. Do you want to delete this product ${productId} from cart?`);
            }
            if(newAmount > totalProductQty) {
                return res.status(400).json(`Products has less than ${newAmount} units`);
            }
            for (let i = 0; i < cart.length; i++) {
                if (cart[i].productId === productId) {
                    cart[i].quantity = newAmount;
                }
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            console.log(localStorage.getItem('cart'));
            
            return res.status(200).json({data: req.session.cart, msg: `Product ${productId} quantity has been updated`});
        }

        cart.push({'userId': userId, 'productId': productId, 'quantity': totalUnits});
        
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log(localStorage.getItem('cart'));
        return res.status(201).json({msg: `Product ${userId} has added to the cart`, cart: req.session});
        
    } else /*if(req.session.passport)*/{
        userId = req.session.passport.user.userId;
        productAlreadyInCart = await Database.selectProductInCart(userId, productId);
        
        const validUserId = await Database.selectUserById(userId);
        if(!validUserId) {
            return res.status(400).json(`No user id ${userId} was found`);
        }

        if(!validProductId) {
            return res.status(400).json(`No product id ${productId} was found`);
        }

        if(totalUnits > totalProductQty) {
            return res.status(400).json(`Product has less than ${totalUnits} units`)
        }

        if(productAlreadyInCart) {
            console.log(productAlreadyInCart)
            const newAmount = productAlreadyInCart.total_units + totalUnits;
            if(newAmount < 1) {
                return res.status(400).json(`Product ${productId} total in the cart can't be zero. Do you want to delete this product ${productId} from cart?`);
            }
            if (newAmount > totalProductQty) {
                return res.status(400).json(`Products has less than ${newAmount} units`);
            }
            const updateCart = await Database.updateProductQuanityInCart(userId, productId, newAmount);
            return res.status(200).json(`Product ${productId} quantity has been udpated in the cart`);
        } else {
            if(totalUnits < 1) {
                return res.status(400).json(`Total units for product ${productId} needs to be greater than zero to be added to cart`);
            }
            const addToCartTable = await Database.addProductToCart(userId, productId, totalUnits);
            return res.status(201).json(`Product ${productId} was added to cart table`);
        }
    }
});

router.get('/', async (req, res, next) => {
    const { userId } = req.body;
    const validUserId = await Database.selectUserById(userId);

    if(!validUserId) {
        return res.status(400).json(`User ${userId} was not found`);
    }

    const userCartData = await Database.selectCartProducts(userId);

    return res.status(200).json({msg: `Cart selected for user ${userId}`, cart: userCartData});
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