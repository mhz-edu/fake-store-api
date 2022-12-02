const Product = require("../model/product");
const {
  findProducts,
  findOneProduct,
  findCategories,
  findProductCount,
  createNewProduct,
  editProductById,
} = require("../service/product");

module.exports.getAllProducts = (req, res) => {
  const limit = Number(req.query.limit) || 0;
  const offset = Number(req.query.offset) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;
  findProducts({ limit, offset, sort })
    .then((products) => {
      res.json(products);
    })
    .catch((err) => console.log(err));
};

module.exports.getProduct = (req, res) => {
  const id = req.params.id;

  findOneProduct({ id })
    .then((product) => res.json(product))
    .catch((err) => {
      console.log(err);
      res.status(err.code).json(err);
    });
};

module.exports.getProductCategories = (req, res) => {
  findCategories()
    .then((categories) => {
      res.json(categories);
    })
    .catch((err) => console.log(err));
};

module.exports.getProductsInCategory = (req, res) => {
  const category = req.params.category;
  const limit = Number(req.query.limit) || 0;
  const offset = Number(req.query.offset) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;
  findProducts({ category, limit, offset, sort })
    .then((products) => {
      res.json(products);
    })
    .catch((err) => console.log(err));
};

module.exports.addProduct = (req, res) => {
  if (typeof req.body == undefined) {
    res.status(400).json({
      status: "error",
      message: "data is undefined",
    });
  } else {
    findProductCount().then((count) => {
      const product = {
        id: count + 1,
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        image: req.body.image,
        category: req.body.category,
      };
      createNewProduct(product)
        .then((product) => res.json(product))
        .catch((err) => console.log(err));
    });
  }
};

module.exports.editProduct = (req, res) => {
  if (typeof req.body == undefined || req.params.id == null) {
    res.status(400).json({
      status: "error",
      message: "something went wrong! check your sent data",
    });
    return;
  }
  const updatedProduct = {
    // id: parseInt(req.params.id),
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    image: req.body.image,
    category: req.body.category,
  };

  editProductById(id, updatedProduct)
    .then((product) => res.json(product))
    .catch((err) => {
      console.log(err);
      res.status(err.code).json(err);
    });
};

module.exports.deleteProduct = async (req, res) => {
  if (req.params.id == null) {
    res.status(400).json({
      status: "error",
      message: "cart id should be provided",
    });
  } else {
    const product = await deleteProductById({ id }).catch((err) =>
      console.log(err)
    );
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
