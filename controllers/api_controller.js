const endPointsJSON = require("../endpoints.json");

exports.getAvailableEndpoints = (req, res, next) => {
  const endpoints = endPointsJSON;
  res.status(200).json({ endpoints });
};
