const connection = require("../db/connection");

const fetchArticles = query => {
  const { sort_by, order, author, topic, limit = 10, p = 1 } = query;
  return (
    connection
      .select("articles.*")
      .from("articles")
      .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
      .count("comment_id AS comment_count")
      .groupBy("articles.article_id")
      .orderBy(sort_by || "created_at", order || "desc")
      .modify(modFunc => {
        if (author) {
          modFunc.where("articles.author", author);
        }
        if (topic) {
          modFunc.where("articles.topic", topic);
        }
      })
      .limit(limit)
      .offset((p - 1) * limit)
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
  return (
    connection
      .select("articles.*")
      .from("articles")
      // .leftJoin("comments", "articles.article_id", "=", "comments.article_id")
      // .count("comment_id as comment_count")
      .where({ article_id: article_id })
      .then(article => {
        if (article.length === 0) {
          return Promise.reject({
            status: 404,
            msg: `no articles found for article id ${article_id}`
          });
        }
        return article[0];
      })
  );
};

const patchArticleById = (article_id, votes = 0) => {
  return connection
    .increment("votes", votes)
    .from("articles")
    .where({ article_id: article_id })
    .returning("*")
    .then(article => {
      return article[0];
    });
};

const deleteArticleById = article_id => {
  return connection("articles")
    .where({ article_id: article_id })
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

const insertArticle = newArticle => {
  if (!newArticle.body) {
    return Promise.reject({
      status: 400,
      msg: "you missed an input category, please try again"
    });
  }
  newArticle.author = newArticle.username;
  newArticle.topic = newArticle.slug;
  delete newArticle.username;
  delete newArticle.slug;
  return connection
    .insert(newArticle)
    .into("articles")
    .returning("*")
    .then(article => {
      return article[0];
    });
};

module.exports = {
  fetchArticles,
  fetchArticlesById,
  patchArticleById,
  deleteArticleById,
  insertArticle
};
