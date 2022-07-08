const { fetchComments, postComment } = require("../models/comments.models");

getComments = (req, res, next) => {
  const { article_id } = req.params;
  fetchComments(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

addComment = (req, res, next) => {
  const { article_id } = req.params;
  const requestBody = req.body;
  postComment(article_id, requestBody)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getComments, addComment };
