const User = require("../model/user");
module.exports.getUsers = ({ limit, sort }) =>
  User.find({ limit, sort, isDeleted: false })
    .select(["-_id -isDeleted"])
    .limit(limit)
    .sort({
      id: sort,
    });
module.exports.findOneUser = ({ id }) =>
  User.findOne({
    id,
  }).select(["-_id -isDeleted"]);
module.exports.findCurrentUser = ({ userId }) =>
  User.findById(userId).select("-_id -__v -isDeleted");

module.exports.countUsers = () => User.find().countDocuments();
module.exports.createNewUser = (data) => {
  const user = new User(data);
  return user.save();
};
module.exports.updateUserById = ({ id, updatedUser }) =>
  User.findOneAndUpdate({ id }, updatedUser, {
    new: true,
  });
module.exports.deleteUserById = ({ id }) =>
  User.findOneAndUpdate(
    { id },
    { isDeleted: true },
    {
      new: true,
    }
  );
