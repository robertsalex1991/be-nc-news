const {
  fetchArticles,
  fetchArticlesById,
  patchArticleById,
  deleteArticleById,
  insertArticle
} = require("../models/article_models");

exports.getArticles = (req, res, next) => {
  let query = req.query;
  fetchArticles(query)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticlesById = (req, res, next) => {
  const article = req.params.article_id;
  fetchArticlesById(article)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.updateArticlesById = (req, res, next) => {
  const article = req.params.article_id;
  const votes = req.body.inc_votes;
  patchArticleById(article, votes)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.deleteArticle = (req, res, next) => {
  const article_id = req.params.article_id;
  deleteArticleById(article_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const newArticle = req.body;
  insertArticle(newArticle)
    .then(article => {
      res.status(201).send({ article });
    })
    .catch(next);
};
