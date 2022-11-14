const User = require("../model/user");
const {
  getUsers,
  findCurrentUser,
  findOneUser,
  createNewUser,
  countUsers,
  updateUserById,
  deleteUserById,
} = require("../service/user");

module.exports.getAllUser = (req, res) => {
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;

  getUsers({ limit, sort })
    .then((users) => {
      res.json(users);
    })
    .catch((err) => console.log(err));
};

module.exports.getUser = (req, res) => {
  const id = req.params.id;

  findOneUser({ id })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => console.log(err));
};

module.exports.getUserInfo = async (req, res) => {
  const userId = req.userData._id;

  const userInfo = await findCurrentUser({ userId });
  res.json(userInfo);
};

module.exports.addUser = async (req, res) => {
  if (typeof req.body == undefined) {
    res.json({
      status: "error",
      message: "data is undefined",
    });
  } else {
    let userCount = 0;

    countUsers()
      .then((count) => {
        userCount = count;
        const newUser = {
          id: userCount + 1,
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
          name: {
            firstname: req.body.name?.firstname,
            lastname: req.body.name?.lastname,
          },
          address: {
            city: req.body.address?.city ?? null,
            street: req.body.address?.street ?? null,
            number: req.body.number,
            zipcode: req.body.zipcode,
            geolocation: {
              lat: req.body.address?.geolocation?.lat ?? null,
              long: req.body.address?.geolocation?.long ?? null,
            },
          },
          phone: req.body.phone,
          isDeleted: false,
        };
        return createNewUser(newUser);
      })
      .then((user) => {
        res.json(user);
      })
      .catch((error) => {
        console.log(error);
        res.status(400);
        res.json(error);
      });

    //res.json({id:User.find().count()+1,...req.body})
  }
};

module.exports.editUser = (req, res) => {
  if (typeof req.body == undefined || req.params.id == null) {
    res.json({
      status: "error",
      message: "something went wrong! check your sent data",
    });
  } else {
    const updatedUser = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      name: {
        firstname: req.body.name?.firstname,
        lastname: req.body.name?.lastname,
      },
      address: {
        city: req.body.address?.city,
        street: req.body.address?.street,
        number: req.body.number,
        zipcode: req.body.zipcode,
        geolocation: {
          lat: req.body.address?.geolocation?.lat,
          long: req.body.address?.geolocation?.long,
        },
      },
      phone: req.body.phone,
    };
    updateUserById({ id: req.params.id, updatedUser })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  }
};

module.exports.deleteUser = (req, res) => {
  if (req.params.id == null) {
    res.json({
      status: "error",
      message: "cart id should be provided",
    });
  } else {
    deleteUserById({ id: req.params.id })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => console.log(err));
  }
};
