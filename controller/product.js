const Product = require("../model/product");

module.exports.getAllProducts = (req, res) => {
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;

  Product.find()
    .select(["-_id"])
    .limit(limit)
    .sort({ id: sort })
    .then((products) => {
      res.json(products);
    })
    .catch((err) => console.log(err));
};

module.exports.getProduct = (req, res) => {
  const id = req.params.id;

  Product.findOne({
    id,
  })
    .select(["-_id"])
    .then((product) => {
      if (product == null) {
        res.status(400);
        res.json({
          status: "error",
          message: "cannot find product",
        });
        return;
      }
      res.json(product);
    })
    .catch((err) => console.log(err));
};

module.exports.getProductCategories = (req, res) => {
  Product.distinct("category")
    .then((categories) => {
      res.json(categories);
    })
    .catch((err) => console.log(err));
};

module.exports.getProductsInCategory = (req, res) => {
  const category = req.params.category;
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;

  Product.find({
    category,
  })
    .select(["-_id"])
    .limit(limit)
    .sort({ id: sort })
    .then((products) => {
      res.json(products);
    })
    .catch((err) => console.log(err));
};

module.exports.addProduct = (req, res) => {
  if (typeof req.body == undefined) {
    res.json({
      status: "error",
      message: "data is undefined",
    });
  } else {
    let productCount = 0;
    Product.find()
      .countDocuments(function (err, count) {
        productCount = count;
      })
      .then(() => {
        const product = {
          id: productCount + 1,
          title: req.body.title,
          price: req.body.price,
          description: req.body.description,
          image: req.body.image,
          category: req.body.category,
        };
        const productInstance = new Product(product);
        productInstance
          .save()
          .then((product) => res.json(product))
          .catch((err) => console.log(err));
      });
  }
};

module.exports.editProduct = (req, res) => {
  if (typeof req.body == undefined || req.params.id == null) {
    res.json({
      status: "error",
      message: "something went wrong! check your sent data",
    });
  } else {
    const updatedProduct = {
      // id: parseInt(req.params.id),
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      image: req.body.image,
      category: req.body.category,
    };
    Product.findOneAndUpdate({ id: req.params.id }, updatedProduct)
      .then((product) => {
        if (product == null) {
          res.status(400);
          res.json({
            status: "error",
            message: "cannot find product",
          });
          return;
        }
        res.json(product);
      })
      .catch((err) => console.log(err));
  }
};

module.exports.deleteProduct = async (req, res) => {
  if (req.params.id == null) {
    res.json({
      status: "error",
      message: "cart id should be provided",
    });
  } else {
    const product = await Product.findOne({
      id: req.params.id,
    })
      .select(["-_id"])
      .catch((err) => console.log(err));
    if (product == null) {
      res.status(400);
      res.json({
        status: "error",
        message: "cannot find product",
      });
      return;
    }
    res.json(product);
  }
};
