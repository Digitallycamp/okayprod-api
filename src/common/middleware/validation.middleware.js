const { StatusCodes } = require('http-status-codes');
const { ApiError } = require('./error.middleware.js');

const validate = (schema, property = 'body') => {
	return (req, res, next) => {
		const { error, value } = schema.validate(req[property], {
			abortEarly: false,
			stripUnknown: true,
		});

		if (error) {
			const errors = error.details.map((detail) => ({
				field: detail.path.join('.'),
				message: detail.message.replace(/["]/g, ''),
			}));

			return next(
				new ApiError(
					StatusCodes.BAD_REQUEST,
					'Validation failed',
					errors
				)
			);
		}

		req[property] = value;
		next();
	};
};

module.exports = { validate };