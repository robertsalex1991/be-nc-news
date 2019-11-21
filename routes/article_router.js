const articleRouter = require("express").Router();
const { commentRouter } = require("./comment_router");
const {
  getArticles,
  getArticlesById,
  updateArticlesById
} = require("../controllers/article_controller");

articleRouter.route("/").get(getArticles);
articleRouter
  .route("/:article_id")
  .get(getArticlesById)
  .patch(updateArticlesById);

articleRouter.use("/:article_id/comments", commentRouter);

module.exports = { articleRouter };
