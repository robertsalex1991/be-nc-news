const apiRouter = require("express").Router();
const { topicRouter } = require("./topic_router");
const { userRouter } = require("./user_router");
const { articleRouter } = require("./article_router");

const { handleNotFound } = require("../error_handling/error_handler");

apiRouter.use("/topics", topicRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/articles", articleRouter);


apiRouter.use("/*", handleNotFound);

module.exports = { apiRouter };
