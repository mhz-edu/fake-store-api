const Cart = require("../model/cart");

module.exports.deleteCartById = ({ userId }) =>
  Cart.findOneAndDelete({ userId });

module.exports.editCartById = ({ userId, products }) =>
  Cart.findOneAndUpdate({ userId }, { products }, { new: true });

module.exports.getUserCart = ({ userId }) =>
  Cart.find({ userId }).select("-_id -products._id -userId");

module.exports.getCarts = ({ startDate, endDate, limit, sort }) =>
  Cart.find({
    date: { $gte: new Date(startDate), $lt: new Date(endDate) },
  })
    .select("-_id -products._id")
    .limit(limit)
    .sort({ id: sort });
module.exports.getCartItems = ({ userId }) =>
  Cart.aggregate()
    .match({ userId })
    .lookup({
      from: "products",
      localField: "products.productId",
      foreignField: "id",
      as: "lineItems",
    })
    .project({
      __v: 0,
      _id: 0,
      "products._id": 0,
      "lineItems._id": 0,
      "lineItems.__v": 0,
    });
module.exports.createCartForUser = ({ cart }) => {
  const cartInstance = new Cart(cart);
  return cartInstance.save();
};
