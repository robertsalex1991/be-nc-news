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
      return comment[0];
    });
};

const fetchAllComments = (article_id, query) => {
  return fetchArticlesById(article_id).then(() => {
    return connection
      .select("comment_id", "votes", "created_at", "author", "body")
      .from("comments")
      .where({ article_id: article_id })
      .orderBy(query.sort_by || "created_at", query.order || "desc")
      .returning("*");
  });
};

const patchCommentsById = (comment_id, votes) => {
  return connection
    .increment("votes", votes)
    .from("comments")
    .where({ comment_id: comment_id })
    .returning("*")
    .then(comment => {
      if (comment.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `no comments found for comment id ${comment_id}`
        });
      }
      if (votes === undefined) {
        return Promise.reject({
          status: 400,
          msg: `Bad Request: no information sent`
        });
      }
      return comment[0];
    });
};

const deleteCommentsById = comment_id => {
  return connection("comments")
    .where({ comment_id: comment_id })
    .del()
    .then(rowsDeleted => {
      if (rowsDeleted === 0) {
        return Promise.reject({
          status: 404,
          msg: "this comment doesn't exist"
        });
      }
    });
};

module.exports = {
  insertComment,
  fetchAllComments,
  patchCommentsById,
  deleteCommentsById
};
