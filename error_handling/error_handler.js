exports.handleCustomErrors = (err, req, res, next) => {
  console.log(err);
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handlePSQLErrors = (err, req, res, next) => {
  const psqlCodes = {
    "22P02": {
      msg: "invalid input syntax for integer",
      status: 400
    },
    "23502": {
      msg: "you missed an input category, please try again",
      status: 400
    },
    "23503": {
      msg: "this page cannot be found",
      status: 404
    }
  };
  //   const message = err.message.split("-")[1].slice(1);
  if (psqlCodes[err.code]) {
    res
      .status(psqlCodes[err.code].status)
      .send({ msg: psqlCodes[err.code].msg });
  } else next(err);
};

exports.handleNotFound = (req, res, next) => {
  res.status(404).send({ msg: "Error status 404, this page not found" });
};
