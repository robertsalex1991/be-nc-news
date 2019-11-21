const { insertComment, fetchAllComments } = require("../models/comment_model");

exports.postComment = (req, res, next) => {
  const newComment = req.body;
  const id = req.params.article_id;
  insertComment(newComment, id)
    .then(comment => {
      res.status(201).send(comment);
    })
    .catch(next);
};

exports.getAllComments = (req, res, next) => {
  article_id = req.params.article_id;
  query = req.query;
  fetchAllComments(article_id, query)
    .then(comments => {
      res.status(200).send(comments);
    })
    .catch(next);
};
