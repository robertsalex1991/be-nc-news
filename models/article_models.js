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
  console.log(votes);
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
