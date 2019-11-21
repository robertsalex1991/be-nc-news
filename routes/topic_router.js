const topicRouter = require("express").Router();
const { getTopics } = require("../controllers/topic_controller");

topicRouter.route("/").get(getTopics);

module.exports = { topicRouter };
