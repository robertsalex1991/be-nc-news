const {
  insertComment,
  fetchAllComments,
  patchCommentsById,
  deleteCommentsById
} = require("../models/comment_model");

exports.postComment = (req, res, next) => {
  const newComment = req.body;
  const id = req.params.article_id;
  insertComment(newComment, id)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getAllComments = (req, res, next) => {
  const article_id = req.params.article_id;
  const query = req.query;
  fetchAllComments(article_id, query)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.updateCommentsById = (req, res, next) => {
  const comments = req.params.comment_id;
  const votes = req.body.inc_votes;
  patchCommentsById(comments, votes)
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteComments = (req, res, next) => {
  const comment_id = req.params.comment_id;
  deleteCommentsById(comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
