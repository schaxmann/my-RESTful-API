const { fetchTopics } = require("../models/topics.models");

getTopics = (req, res) => {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

module.exports = { getTopics };
