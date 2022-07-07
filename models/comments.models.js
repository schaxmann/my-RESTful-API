const db = require("../db/connection");
const { fetchArticle } = require("./articles.models");

fetchComments = (article_id) => {
  return fetchArticle(article_id).then(() => {
    return db
      .query(
        `SELECT comment_id, votes, created_at, author, body
      FROM comments 
      WHERE article_id = $1`,
        [article_id]
      )
      .then((comments) => {
        return comments.rows;
      });
  });
};

module.exports = { fetchComments };
