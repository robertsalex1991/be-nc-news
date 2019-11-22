const artIdCommentRouter = require("express").Router({ mergeParams: true });
const commentRouter = require("express").Router();

const {
  postComment,
  getAllComments,
  updateCommentsById,
  deleteComments
} = require("../controllers/comment_controller");

commentRouter
  .route("/:comment_id")
  .patch(updateCommentsById)
  .delete(deleteComments);

artIdCommentRouter
  .route("/")
  .post(postComment)
  .get(getAllComments);

module.exports = { commentRouter, artIdCommentRouter };
