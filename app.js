const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const {
  handleBadPaths,
  handleServerErrors,
} = require("./controllers/errors.controllers");

const app = express();

app.get("/api/topics", getTopics);

app.use("*", handleBadPaths);

app.use(handleServerErrors);

module.exports = app;
