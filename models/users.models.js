const db = require("../db/connection");

fetchUsers = () => {
  return db.query(`SELECT * FROM users;`).then((users) => {
    return users.rows;
  });
};

module.exports = { fetchUsers };
