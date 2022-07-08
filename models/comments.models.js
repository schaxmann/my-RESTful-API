const db = require("../db/connection");
const { fetchArticle } = require("./articles.models");

fetchComments = (article_id) => {
  return fetchArticle(article_id).then(() => {
    return db
      .query(
        `SELECT *
      FROM comments 
      WHERE article_id = $1`,
        [article_id]
      )
      .then((comments) => {
        return comments.rows;
      });
  });
};

postComment = (article_id, requestBody) => {
  const username = requestBody.username;
  const body = requestBody.body;
  if (!requestBody.username || !requestBody.body) {
    return Promise.reject({
      status: 400,
      msg: "Bad request. Request must be an object including username and body properties",
    });
  }
  return fetchArticle(article_id)
    .then(() => {
      return db.query(`SELECT * FROM users WHERE username=$1`, [username]);
    })
    .then((userCheck) => {
      if (userCheck.rows.length === 0) {
        return Promise.reject({
          status: 400,
          msg: "Bad request. User is not registered",
        });
      }
    })
    .then(() => {
      return db
        .query(
          `INSERT INTO comments (author, body, article_id)
        VALUES ((SELECT username FROM users WHERE username=$1), $2, (SELECT article_id FROM articles WHERE article_id=$3))
        RETURNING *;`,
          [username, body, article_id]
        )
        .then((comment) => {
          return comment.rows[0];
        });
    });
};

module.exports = { fetchComments, postComment };
