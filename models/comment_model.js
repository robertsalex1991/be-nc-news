const connection = require("../db/connection");
const { fetchUsersByUsername } = require("../models/user_models");
const { fetchArticlesById } = require("../models/article_models");

const insertComment = (newComment, id) => {
  if (!newComment.body) {
    return Promise.reject({
      status: 400,
      msg: "you missed an input category, please try again"
    });
  }
  newComment.author = newComment.username;
  newComment.article_id = id;
  delete newComment.username;
  return fetchUsersByUsername(newComment.author)
    .then(() => {
      return connection
        .insert(newComment)
        .into("comments")
        .returning("*");
    })
    .then(comment => {
      console.log(comment);
      return comment[0];
    });
};

const fetchAllComments = (article_id, query) => {
  let arr = [];
  return fetchArticlesById(article_id)
    .then(() => {
      return connection
        .select("*")
        .from("comments")
        .orderBy(query.sort_by || "created_at", query.order || "desc");
    })
    .then(comments => {
      for (let i = 0; i < comments.length; i++) {
        if (comments[i].article_id === Number(article_id)) {
          delete comments[i].article_id;
          arr.push(comments[i]);
        }
      }

      return arr;
    });
};

module.exports = { insertComment, fetchAllComments };
