const { fetchUsers, fetchUsersByUsername } = require("../models/user_models");

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then(users => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUsersById = (req, res, next) => {
  const { username } = req.params;
  fetchUsersByUsername(username)
    .then(user => {
      console.log(user);
      res.status(200).send({ user });
    })
    .catch(next);
};
