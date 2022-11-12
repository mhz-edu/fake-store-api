const express = require("express");
const router = express.Router();
const user = require("../controller/user");
const { authenticate } = require("../middleware/auth");

router.get("/", user.getAllUser);
router.get("/info", authenticate, user.getUserInfo);
router.get("/:id", user.getUser);
router.post("/", user.addUser);
router.put("/:id", user.editUser);
router.patch("/:id", user.editUser);
router.delete("/:id", user.deleteUser);

module.exports = router;
