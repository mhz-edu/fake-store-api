const Product = require("../model/product");

module.exports.findProducts = ({ limit, offset, sort, category }) => {
  const queryItems = {};
  if (category) queryItems.category = category;
  return Product.find(queryItems)
    .select(["-_id"])
    .skip(offset)
    .limit(limit)
    .sort({ id: sort });
};
module.exports.findOneProduct = ({ id }) => {
  return Product.findOne({
    id,
  })
    .select(["-_id"])
    .then((product) => {
      if (product == null) {
        throw { code: 400, status: "error", message: "cannot find product" };
      }
      return product;
    });
};
module.exports.findCategories = () => Product.distinct("category");
module.exports.findProductCount = () => {
  return Product.find()
    .find()
    .sort({ id: -1 })
    .limit(1)
    .then((fields) => {
      return fields[0].id;
    });
};
module.exports.createNewProduct = (product) => {
  const productInstance = new Product(product);
  return productInstance.save();
};
module.exports.editProductById = (id, updatedProduct) => {
  return Product.findOneAndUpdate({ id: id }, updatedProduct).then(
    (product) => {
      if (product == null) {
        throw { code: 400, status: "error", message: "cannot find product" };
      }
      return product;
    }
  );
};
module.exports.deleteProductById = ({ id }) => {
  return Product.findOneAndDelete({
    id: id,
  }).then((product) => {
    if (product == null) {
      throw { code: 400, status: "error", message: "cannot find product" };
    }
    return product;
  });
};
