const ApiError = require("../exceptions/api-error");

module.exports = (role) => (req, res, next) => {
  if (req.user?.role !== role) {
    return next(ApiError.ForbiddenError("Недостаточно прав для кабинета ООПТ"));
  }
  next();
};
