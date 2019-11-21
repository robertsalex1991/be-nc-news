const {
  fetchArticles,
  fetchArticlesById,
  patchArticleById
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
  console.log(article);
  fetchArticlesById(article)
    .then(articles => {
      res.status(200).send(articles);
    })
    .catch(next);
};

exports.updateArticlesById = (req, res, next) => {
  const article = req.params.article_id;
  const votes = req.body.inc_votes;
  patchArticleById(article, votes)
    .then(articles => {
      res.status(200).send(articles);
    })
    .catch(next);
};
