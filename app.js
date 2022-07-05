const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const {
  handleBadPaths,
  handleServerErrors,
  handleCustomErrors,
} = require("./controllers/errors.controllers");
const { getArticle } = require("./controllers/articles.controllers");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticle);

app.use("*", handleBadPaths);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
