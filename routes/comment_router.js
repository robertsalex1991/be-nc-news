const commentRouter = require("express").Router({ mergeParams: true });
const {
  postComment,
  getAllComments
} = require("../controllers/comment_controller");

commentRouter
  .route("/")
  .post(postComment)
  .get(getAllComments);

module.exports = { commentRouter };
