const {
  topicData,
  articleData,
  commentData,
  userData
} = require("../data/index.js"); //all data//

const { formatDates, formatComments, makeRefObj } = require("../utils/utils"); //util

exports.seed = function(knex) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      const topicsInsertions = knex("topics")
        .insert(topicData)
        .returning("*");
      const usersInsertions = knex("users")
        .insert(userData)
        .returning("*");
      return Promise.all([topicsInsertions, usersInsertions]);
    })
    .then(() => {
      const fixedArticles = formatDates(articleData);
      return knex("articles")
        .insert(fixedArticles)
        .returning("*");
    })
    .then(articleRows => {
      const articleRef = makeRefObj(articleRows, "title", "article_id");
      const formattedComments = formatComments(commentData, articleRef);
      return knex("comments").insert(formattedComments);
    });
};
