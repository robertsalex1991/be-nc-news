const artIdCommentRouter = require("express").Router({ mergeParams: true });
const commentRouter = require("express").Router();

const {
  postComment,
  getAllComments,
  updateCommentsById,
  deleteComments
} = require("../controllers/comment_controller");

const { handleDisallowedMethod } = require("../error_handling/error_handler");

commentRouter
  .route("/:comment_id")
  .patch(updateCommentsById)
  .delete(deleteComments)
  .all(handleDisallowedMethod);

artIdCommentRouter
  .route("/")
  .post(postComment)
  .get(getAllComments)
  .all(handleDisallowedMethod);

module.exports = { commentRouter, artIdCommentRouter };
