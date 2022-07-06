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
  const requestBody = req.body;
  patchArticle(article_id, requestBody)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

getAllArticles = (req, res, next) => {
  fetchAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getArticle, updateArticle, getAllArticles };
