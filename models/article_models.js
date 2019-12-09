const connection = require("../db/connection");

const fetchArticles = query => {
  return (
    connection
      .select("articles.*")
      .from("articles")
      .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
      .count("comment_id AS comment_count")
      .groupBy("articles.article_id")
      .orderBy(query.sort_by || "created_at", query.order || "desc")
      .modify(modFunc => {
        if (query.author) {
          modFunc.where("articles.author", query.author);
        }
        if (query.topic) {
          modFunc.where("articles.topic", query.topic);
        }
      })
      .returning("*")
      //first remove all the js in the if block and think about how this would be done in sql
      //  second make sure to use .modify and read the notes instead of all the if statements

      .then(joined => {
        if (joined.length === 0) {
          return Promise.reject({
            status: 404,
            msg: `your search query cannot be found`
          });
        }

        return joined;
      })
  );
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
