const db = require("../db/connection");

fetchArticle = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
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

module.exports = { fetchArticle, patchArticle };
