const db = require("../db/connection");

fetchArticle = (article_id) => {
  if (isNaN(Number(article_id))) {
    return Promise.reject({
      status: 400,
      msg: "Bad request. Article ID should be a number",
    });
  } else {
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
  }
};

patchArticle = (article_id, requestBody) => {
  if (isNaN(Number(article_id))) {
    return Promise.reject({
      status: 400,
      msg: "Bad request. Article ID should be a number",
    });
  } else if (
    !requestBody.inc_votes ||
    typeof requestBody.inc_votes !== "number"
  ) {
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

fetchAllArticles = (queries) => {
  const sortBy = queries.sort_by || "created_at";
  const order = queries.order || "desc";
  const topic = queries.topic;

  if (
    ![
      "author",
      "title",
      "article_id",
      "topic",
      "created_at",
      "votes",
      "comment_count",
    ].includes(sortBy.toLowerCase())
  ) {
    return Promise.reject({
      status: 400,
      msg: "Bad request. Invalid sort query",
    });
  }

  if (!["asc", "desc"].includes(order.toLowerCase())) {
    return Promise.reject({
      status: 400,
      msg: "Bad request. Invalid order query",
    });
  }

  if (!topic) {
    return db
      .query(
        `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes
      , COUNT(comments.comment_id)::int AS comment_count
  FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id
  GROUP BY articles.article_id
  ORDER BY ${sortBy} ${order};`
      )
      .then((articles) => {
        return articles.rows;
      });
  }

  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes
      , COUNT(comments.comment_id)::int AS comment_count
  FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id
  WHERE articles.topic = $1
  GROUP BY articles.article_id
  ORDER BY ${sortBy} ${order};`,
      [topic.toLowerCase()]
    )
    .then((articles) => {
      return articles.rows;
    });
};

module.exports = { fetchArticle, patchArticle, fetchAllArticles };
