const errorMiddleware = (err, req, res, next) => {
	console.error('Global Error:', err);

	if (res.headersSent) {
		return next(err);
	}

	if (err.name === 'ValidationError') {
		return res.status(400).json({
			success: false,
			message: 'Validation failed',
			error: err.message,
		});
	}

	if (err.name === 'CastError') {
		return res.status(400).json({
			success: false,
			message: 'Invalid data format',
			error: err.message,
		});
	}

	if (err.name === 'MongoServerError' && err.code === 11000) {
		return res.status(409).json({
			success: false,
			message: 'Duplicate data',
			error: err.message,
		});
	}

	if (err.name === 'MongoNetworkError') {
		return res.status(503).json({
			success: false,
			message: 'Database connection error',
			error: err.message,
		});
	}

	return res.status(err.statusCode || 500).json({
		success: false,
		message: err.message || 'Internal server error',
	});
};

module.exports = errorMiddleware;