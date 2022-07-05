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

module.exports = { fetchArticle };
