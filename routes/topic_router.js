const topicRouter = require("express").Router();
const { getTopics } = require("../controllers/topic_controller");
const { handleDisallowedMethod } = require("../error_handling/error_handler");

topicRouter
  .route("/")
  .get(getTopics)
  .all(handleDisallowedMethod);

module.exports = { topicRouter };
