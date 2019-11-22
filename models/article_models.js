const connection = require("../db/connection");

const fetchArticles = query => {
  return connection
    .select("articles.*")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
    .count("comment_id AS comment_count")
    .groupBy("articles.article_id")
    .orderBy(query.sort_by || "created_at", query.order || "desc")
    .returning("*")
    .then(joined => {
      if (query.author && query.topic) {
        let arr = joined.filter(article => article.author === query.author);
        let arr2 = arr.filter(article => article.topic === query.topic);
        if (arr2.length === 0) {
          return Promise.reject({
            status: 404,
            msg: `articles by ${query.author} about ${query.topic} cannot be found`
          });
        }
        return arr2;
      }
      if (query.author) {
        let arr = joined.filter(article => article.author === query.author);
        if (arr.length === 0) {
          return Promise.reject({
            status: 404,
            msg: `the author ${query.author} cannot be found`
          });
        }
        return arr;
      }
      if (query.topic) {
        let arr = joined.filter(article => article.topic === query.topic);
        if (arr.length === 0) {
          return Promise.reject({
            status: 404,
            msg: `the topic ${query.topic} cannot be found`
          });
        }
        return arr;
      }
      return joined;
    });
};

const fetchArticlesById = article_id => {
  return connection
    .select("*")
    .from("articles")
    .where({ article_id: article_id })
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `no articles found for article id ${article_id}`
        });
      }
      return article[0];
    });
};

const patchArticleById = (article_id, votes) => {
  return connection
    .increment("votes", votes)
    .from("articles")
    .where({ article_id: article_id })
    .returning("*")
    .then(article => {
      if (article.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `no articles found for article id ${article_id}`
        });
      }
      if (votes === undefined) {
        return Promise.reject({
          status: 400,
          msg: `Bad Request: no information sent`
        });
      }
      return article[0];
    });
};

module.exports = { fetchArticles, fetchArticlesById, patchArticleById };
