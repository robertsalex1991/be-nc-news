const articleRouter = require("express").Router();
const { artIdCommentRouter } = require("./comment_router");
const {
  getArticles,
  getArticlesById,
  updateArticlesById,
  deleteArticle,
  postArticle
} = require("../controllers/article_controller");
const { handleDisallowedMethod } = require("../error_handling/error_handler");

articleRouter
  .route("/")
  .get(getArticles)
  .post(postArticle)
  .all(handleDisallowedMethod);

articleRouter
  .route("/:article_id")
  .get(getArticlesById)
  .patch(updateArticlesById)
  .delete(deleteArticle)
  .all(handleDisallowedMethod);

articleRouter.use("/:article_id/comments", artIdCommentRouter);

module.exports = { articleRouter };
