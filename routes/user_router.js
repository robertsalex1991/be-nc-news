const userRouter = require("express").Router();
const { getUsers, getUsersById } = require("../controllers/user_controller");
const {
  handleNotFound,
  handleCustomErrors
} = require("../error_handling/error_handler");

userRouter.route("/").get(getUsers);
userRouter.route("/:username").get(getUsersById);

userRouter.use("/*", handleNotFound);

module.exports = { userRouter };
