const User = require("../model/user");
const jwt = require("jsonwebtoken");

module.exports.getAllUser = (req, res) => {
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;

  User.find()
    .select(["-_id"])
    .limit(limit)
    .sort({
      id: sort,
    })
    .then((users) => {
      res.json(users);
    })
    .catch((err) => console.log(err));
};

module.exports.getUser = (req, res) => {
  const id = req.params.id;

  User.findOne({
    id,
  })
    .select(["-_id"])
    .then((user) => {
      res.json(user);
    })
    .catch((err) => console.log(err));
};

module.exports.getUserInfo = async (req, res) => {
  const userId = req.userData._id;

  const userInfo = await User.findById(userId).select("-_id -__v");
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

    User.find()
      .countDocuments(function (err, count) {
        userCount = count;
      })
      .then(() => {
        const user = new User({
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
        });
        user
          .save()
          .then((user) => {
            res.json(user);
          })
          .catch((error) => {
            console.log(error);
            res.status(400);
            res.json(error);
          });
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
    User.findOneAndUpdate(
      { id: req.params.id },
      {
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
      }
    );
  }
};

module.exports.deleteUser = (req, res) => {
  if (req.params.id == null) {
    res.json({
      status: "error",
      message: "cart id should be provided",
    });
  } else {
    User.findOneAndUpdate({ id: req.params.id }, { isDeleted: true })
      .select(["-_id"])
      .then((user) => {
        res.json(user);
      })
      .catch((err) => console.log(err));
  }
};
