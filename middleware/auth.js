const jwt = require("jsonwebtoken");
const User = require("../model/user");

module.exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "secret_key");
    const user = await User.findOne({
      _id: decoded._id,
      // "tokens.token": token,
    });
    // If user not found, throw error
    req.userData = decoded;
    if (!user) {
      throw "No user found";
    }
    next();
  } catch (err) {
    res.status(401).json({ error: new Error({ error: "No user found" }) });
  }
};
