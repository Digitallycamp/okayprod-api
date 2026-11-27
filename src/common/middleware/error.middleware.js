const { StatusCodes } = require('http-status-codes');

class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = 'ApiError';
  }
}

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  const response = {
    success: false,
    message: err.message || 'Internal server error',
  };

  if (err.errors && err.errors.length) {
    response.errors = err.errors;
  }

  return res.status(statusCode).json(response);
};

module.exports = { ApiError, errorHandler };