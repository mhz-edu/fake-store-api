const Cart = require("../model/cart");
const jwt = require("jsonwebtoken");
const User = require("../model/user");

module.exports.getAllCarts = (req, res) => {
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;
  const startDate = req.query.startdate || new Date("1970-1-1");
  const endDate = req.query.enddate || new Date();

  console.log(startDate, endDate);

  Cart.find({
    date: { $gte: new Date(startDate), $lt: new Date(endDate) },
  })
    .select("-_id -products._id")
    .limit(limit)
    .sort({ id: sort })
    .then((carts) => {
      res.json(carts);
    })
    .catch((err) => console.log(err));
};

module.exports.getCartsbyUserid = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "secret_key");
    const user = await User.findOne({
      _id: decoded._id,
      // "tokens.token": token,
    });

    // If user not found, throw error
    if (!user) {
      throw new Error("No user found");
    }
    const userId = decoded._id;
    const startDate = req.query.startdate || new Date("1970-1-1");
    const endDate = req.query.enddate || new Date();
    Cart.find({ userId })
      .select("-_id -products._id -userId")
      .then((carts) => {
        res.json(carts);
      })
      .catch((err) => console.log(err));
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports.getSingleCart = (req, res) => {
  const id = req.params.id;
  Cart.findOne({
    id,
  })
    .select("-_id -products._id")
    .then((cart) => res.json(cart))
    .catch((err) => console.log(err));
};

module.exports.addCart = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "secret_key");
    const user = await User.findOne({
      _id: decoded._id,
      // "tokens.token": token,
    });
    // If user not found, throw error
    if (!user) {
      throw new Error({ error: "No user found" });
    }
    const userId = decoded._id;
    const date = req.query.date || new Date();

    if (typeof req.body == undefined) {
      res.json({
        status: "error",
        message: "data is undefined",
      });
    } else {
      let cartCount = 0;
      Cart.find({
        userId,
      })
        .then((carts) => {
          const cart = {
            id: carts.length + 1,
            userId: userId,
            date: date,
            products: req.body.products || [],
          };
          if (carts.length > 0) {
            res.json([...carts].pop());
            return;
          }
          const cartInstance = new Cart(cart);
          cartInstance
            .save()
            .then((cart) => {
              res.json(cart);
            })
            .catch((err) => res.status(400).json(err));
        })
        .catch((err) => console.log(err));
    }
    // res.json({ ...req.body, id: Cart.find().count() + 1 });
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports.editCart = (req, res) => {
  if (typeof req.body == undefined || req.params.id == null) {
    res.json({
      status: "error",
      message: "something went wrong! check your sent data",
    });
  } else {
    res.json({
      id: parseInt(req.params.id),
      userId: req.body.userId,
      date: req.body.date,
      products: req.body.products,
    });
  }
};

module.exports.deleteCart = (req, res) => {
  if (req.params.id == null) {
    res.json({
      status: "error",
      message: "cart id should be provided",
    });
  } else {
    Cart.findOne({ id: req.params.id })
      .select("-_id -products._id")
      .then((cart) => {
        res.json(cart);
      })
      .catch((err) => console.log(err));
  }
};
