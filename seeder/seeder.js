const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

const User = require("../model/user");
const Product = require("../model/product");
const { userData } = require("./users");
const { productData } = require("./products");

const dbUrl =
  process.env.NODE_ENV === "prod"
    ? process.env.DATABASE_URL
    : process.env.DATABASE_URL_LOCAL;

const seeder = async (data, model) => {
  const promises = data.map((item) => {
    return new model(item).save();
  });
  return Promise.all(promises);
};

mongoose.set("useFindAndModify", false);
mongoose.set("useUnifiedTopology", true);
mongoose
  .connect(dbUrl, { useNewUrlParser: true })
  .then(() => {
    console.log(`Ready to seed`);
    console.log(`Seeding users`);
    return seeder(userData, User);
  })
  .then(() => {
    console.log(`Seeding products`);
    return seeder(productData, Product);
  })
  .then(() => {
    console.log(`Seeding Done`);
    mongoose.disconnect();
  })
  .catch((err) => {
    console.log(err);
  });
