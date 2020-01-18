const connection = require("../db/connection");

const fetchTopics = query => {
  const { limit = 3, p = 1 } = query;
  return connection
    .select("*")
    .from("topics")
    .limit(limit)
    .offset((p - 1) * limit)
    .returning("*");
};

const insertTopic = newTopic => {
  if (!newTopic.description) {
    return Promise.reject({
      status: 400,
      msg: "you missed an input category, please try again"
    });
  }
  return connection
    .insert(newTopic)
    .into("topics")
    .returning("*")
    .then(topic => {
      return topic[0];
    });
};

module.exports = { fetchTopics, insertTopic };
