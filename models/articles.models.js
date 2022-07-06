const db = require("../db/connection");

fetchArticle = (article_id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.comment_id)::int AS comment_count
    FROM articles 
    LEFT JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`,
      [article_id]
    )
    .then((article) => {
      if (!article.rows[0]) {
        return Promise.reject({
          status: 404,
          msg: "Bad path. Article with given id not found",
        });
      }
      return article.rows[0];
    });
};

patchArticle = (article_id, requestBody) => {
  if (!requestBody.inc_votes || typeof requestBody.inc_votes !== "number") {
    return Promise.reject({
      status: 400,
      msg: "Bad request. Request must be an object including an inc_votes key with a number value",
    });
  } else {
    return db
      .query(
        "UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *;",
        [article_id, requestBody.inc_votes]
      )
      .then((article) => {
        if (!article.rows[0]) {
          return Promise.reject({
            status: 404,
            msg: "Bad path. Article with given id not found",
          });
        }
        return article.rows[0];
      });
  }
};

fetchAllArticles = () => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes
      , COUNT(comments.comment_id)::int AS comment_count
  FROM articles 
  LEFT JOIN comments ON comments.article_id = articles.article_id
  GROUP BY articles.article_id
  ORDER BY created_at DESC;`
    )
    .then((articles) => {
      return articles.rows;
    });
};

module.exports = { fetchArticle, patchArticle, fetchAllArticles };
