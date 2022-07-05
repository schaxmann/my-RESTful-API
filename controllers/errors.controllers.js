handleBadPaths = (req, res) => {
  res.status(404).send({ msg: "Requested content not found" });
};

handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

handleServerErrors = (err, req, res, next) => {
  console.log(err, "<< unhandled error");
  res.status(500).send({ msg: "Something went wrong" });
};

module.exports = { handleBadPaths, handleCustomErrors, handleServerErrors };
