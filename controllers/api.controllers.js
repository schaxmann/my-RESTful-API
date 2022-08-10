const endpoints = require("../endpoints.json");

const getApi = (req, res, next) => {
  res
    .status(200)
    .send({ endpoints })
    .catch((err) => {
      next(err);
    });
};

module.exports = getApi;
