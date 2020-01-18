const topicRouter = require("express").Router();
const { getTopics, postTopic } = require("../controllers/topic_controller");
const { handleDisallowedMethod } = require("../error_handling/error_handler");

topicRouter
  .route("/")
  .get(getTopics)
  .post(postTopic)
  .all(handleDisallowedMethod);

module.exports = { topicRouter };
