const {
  deleteCartById,
  editCartById,
  getUserCart,
  createCartForUser,
  getCartItems,
} = require("../service/cart");

module.exports.getAllCarts = (req, res) => {
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;
  const startDate = req.query.startdate || new Date("1970-1-1");
  const endDate = req.query.enddate || new Date();
  getCarts({ limit, sort, startDate, endDate })
    .then((carts) => {
      res.json(carts);
    })
    .catch((err) => console.log(err));
};

module.exports.getCartsbyUserid = async (req, res) => {
  const userId = req.userData._id;
  getUserCart({ userId })
    .then((carts) => {
      res.json(carts);
    })
    .catch((err) => console.log(err));
};

module.exports.getSingleCart = async (req, res) => {
  const userId = req.userData._id;
  const cart = await getCartItems({ userId }).catch((err) => console.log(err));

  res.json(cart);
};

module.exports.addCart = async (req, res) => {
  const userId = req.userData._id;
  const date = req.query.date || new Date();

  if (typeof req.body == undefined) {
    res.status(400).json({
      status: "error",
      message: "data is undefined",
    });
  } else {
    getUserCart({ userId })
      .then((carts) => {
        const newCart = {
          id: carts.length + 1,
          userId: userId,
          date: date,
          products: req.body.products || [],
        };
        if (carts.length > 0) {
          res.json([...carts].pop());
          return;
        }
        createCartForUser({ cart: newCart })
          .then((cart) => {
            res.json(cart);
          })
          .catch((err) => res.status(400).json(err));
      })
      .catch((err) => console.log(err));
  }
  // res.json({ ...req.body, id: Cart.find().count() + 1 });
};

module.exports.editCart = async (req, res) => {
  const userId = req.userData._id;
  if (typeof req.body == undefined) {
    res.status(400).json({
      status: "error",
      message: "something went wrong! check your sent data",
    });
  } else {
    editCartById({ userId, products: req.body.products })
      .then((cart) => {
        res.json(cart);
      })
      .catch((err) => res.status(400).json(err));
  }
};

module.exports.deleteCart = async (req, res) => {
  const userId = req.userData._id;
  deleteCartById({ userId }).then(() => {
    res.json("Cart Deleted!");
  });
};
