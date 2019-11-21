const connection = require("../db/connection");

const fetchUsers = () => {
  return connection.select("*").from("users");
};

const fetchUsersByUsername = username => {
  return connection
    .select("*")
    .from("users")
    .where({ username: username })
    .then(user => {
      if (user.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `no user found for ${username}`
        });
      }
      return user[0];
    });
};

module.exports = { fetchUsers, fetchUsersByUsername };
