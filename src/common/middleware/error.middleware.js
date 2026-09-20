const { StatusCodes } = require('http-status-codes');

class ApiError extends Error {
	constructor(
		statusCode,
		message,
		errors = []
	) {
		super(message);
		this.statusCode = statusCode;
		this.errors = errors;
		this.name = 'ApiError';
	}
}

const errorMiddleware = (err, req, res, next) => {
	console.error('Global Error:', err);

	if (res.headersSent) {
		return next(err);
	}

	if (err.name === 'ValidationError') {
		err = new ApiError(
			StatusCodes.BAD_REQUEST,
			'Validation failed',
			[]
		);
	}

	if (err.name === 'CastError') {
		err = new ApiError(
			StatusCodes.BAD_REQUEST,
			'Invalid data format',
			[]
		);
	}

	if (
		err.name === 'MongoServerError' &&
		err.code === 11000
	) {
		err = new ApiError(
			StatusCodes.CONFLICT,
			'Duplicate data',
			[]
		);
	}

	if (err.name === 'MongoNetworkError') {
		err = new ApiError(
			StatusCodes.SERVICE_UNAVAILABLE,
			'Database connection error',
			[]
		);
	}

	const statusCode =
		err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

	return res.status(statusCode).json({
		success: false,
		message: err.message || 'Internal server error',
		...(err.errors?.length > 0 && {
			errors: err.errors,
		}),
	});
};

module.exports = {
	errorMiddleware,
	ApiError,
};