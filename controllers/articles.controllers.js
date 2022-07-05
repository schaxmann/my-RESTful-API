const { fetchArticle, patchArticle } = require("../models/articles.models");

getArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticle(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

updateArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  patchArticle(article_id, inc_votes)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getArticle, updateArticle };
