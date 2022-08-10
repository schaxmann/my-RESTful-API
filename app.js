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
const {
  getComments,
  addComment,
  removeComment,
  getAllComments,
  getOneComment,
} = require("./controllers/comments.controllers");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticle);
app.patch("/api/articles/:article_id", updateArticle);

app.get("/api/articles/:article_id/comments", getComments);
app.post("/api/articles/:article_id/comments", addComment);

app.get("/api/users", getUsers);

app.get("/api/comments", getAllComments);
app.get("/api/comments/:comment_id", getOneComment);
app.delete("/api/comments/:comment_id", removeComment);

app.get("/api", getOneComment);

app.use("*", handleBadPaths);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;
