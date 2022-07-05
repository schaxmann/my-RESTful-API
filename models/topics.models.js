const db = require("../db/connection");

fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((topics) => {
    return topics.rows;
  });
};

module.exports = { fetchTopics };
