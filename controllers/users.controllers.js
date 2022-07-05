const { fetchUsers } = require("../models/users.models");

getUsers = (req, res) => {
  fetchUsers().then((users) => {
    res.status(200).send({ users });
  });
};

module.exports = { getUsers };
