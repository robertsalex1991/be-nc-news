const {
  fetchUsers,
  fetchUsersByUsername,
  insertUser
} = require("../models/user_models");

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
      res.status(200).send({ user });
    })
    .catch(next);
};

exports.postUser = (req, res, next) => {
  const newUser = req.body;
  insertUser(newUser)
    .then(user => {
      res.status(201).send({ user });
    })
    .catch(next);
};
