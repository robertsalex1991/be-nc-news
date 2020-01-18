const userRouter = require("express").Router();
const {
  getUsers,
  getUsersById,
  postUser
} = require("../controllers/user_controller");
const { handleDisallowedMethod } = require("../error_handling/error_handler");

userRouter
  .route("/")
  .get(getUsers)
  .post(postUser)
  .all(handleDisallowedMethod);

userRouter
  .route("/:username")
  .get(getUsersById)
  .all(handleDisallowedMethod);

// userRouter.use("/*", handleNotFound);

module.exports = { userRouter };
