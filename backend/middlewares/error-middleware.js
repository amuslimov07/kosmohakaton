const ApiError = require("../exceptions/api-error");
module.exports = function (err, req, res, next) {
  if (!err.status || err.status >= 500) {
    console.error(err);
  }
  if (err instanceof ApiError) {
    return res
      .status(err.status)
      .json({ message: err.message, errors: err.errors });
  }
  return res.status(500).json({ message: "Непредвиденная ошибка" });
};
