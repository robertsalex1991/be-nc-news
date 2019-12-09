const userRouter = require("express").Router();
const { getUsers, getUsersById } = require("../controllers/user_controller");
const { handleDisallowedMethod } = require("../error_handling/error_handler");

userRouter
  .route("/")
  .get(getUsers)
  .all(handleDisallowedMethod);

userRouter
  .route("/:username")
  .get(getUsersById)
  .all(handleDisallowedMethod);

// userRouter.use("/*", handleNotFound);

module.exports = { userRouter };
