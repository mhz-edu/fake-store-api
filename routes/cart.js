const express = require("express");
const router = express.Router();
const cart = require("../controller/cart");
const { authenticate } = require("../middleware/auth");

router.get("/", authenticate, cart.getAllCarts);
router.get("/user/get", authenticate, cart.getCartsbyUserid);
router.get("/get", authenticate, cart.getSingleCart);

router.post("/", authenticate, cart.addCart);
//router.post('/:id',authenticate,cart.addtoCart)

router.put("/addToCart", authenticate, cart.editCart);
router.patch("/addToCart", authenticate, cart.editCart);
router.delete("/removeCart", authenticate, cart.deleteCart);

module.exports = router;
