const errorHandler = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || 500,
    message: err.message || "Internal server error",
  };

  res.status(customError.statusCode);
  res.json({ message: customError.message });
};

class CustomErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

module.exports = { errorHandler, CustomErrorHandler };
