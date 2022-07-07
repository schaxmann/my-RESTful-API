const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const {
  handleBadPaths,
  handleServerErrors,
  handleCustomErrors,
} = require("./controllers/errors.controllers");
const {
  getArticle,
  getAllArticles,
  updateArticle,
} = require("./controllers/articles.controllers");
const { getUsers } = require("./controllers/users.controllers");
const { getComments } = require("./controllers/comments.controllers");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticle);
app.patch("/api/articles/:article_id", updateArticle);

app.get("/api/articles/:article_id/comments", getComments);

app.get("/api/users", getUsers);

app.use("*", handleBadPaths);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
