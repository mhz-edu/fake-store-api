const express = require('express')
const router = express.Router()
const cart = require('../controller/cart')

router.get('/',cart.getAllCarts)
router.get('/user/get',cart.getCartsbyUserid)
router.get('/get',cart.getSingleCart)

router.post('/',cart.addCart)
//router.post('/:id',cart.addtoCart)

router.put('/addToCart',cart.editCart)
router.patch('/addToCart',cart.editCart)
router.delete('/removeCart',cart.deleteCart)

module.exports = router
