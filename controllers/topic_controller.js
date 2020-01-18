const { fetchTopics, insertTopic } = require("../models/topic_models");

exports.getTopics = (req, res, next) => {
  let query = req.query;
  fetchTopics(query)
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.postTopic = (req, res, next) => {
  const newTopic = req.body;
  insertTopic(newTopic)
    .then(topic => {
      res.status(201).send({ topic });
    })
    .catch(next);
};
