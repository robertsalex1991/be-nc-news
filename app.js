const express = require("express");
const app = express();
app.use(express.json());

const { apiRouter } = require("./routes/api_router");
const {
  handleNotFound,
  handleCustomErrors,
  handlePSQLErrors,
  handleServerError
} = require("./error_handling/error_handler");

app.use("/api", apiRouter);

app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use("/*", handleNotFound);
app.use(handleServerError);
module.exports = app;
