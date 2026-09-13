const Joi = require('joi');

const authSchema = Joi.object({
	email: Joi.string()
		.email()
		.pattern(new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$'))
		.required()
		.messages({
			'string.empty': 'Email is required',
			'string.email': 'Please enter a valid email address',
		}),
	password: Joi.string().min(8).required().messages({
		'string.empty': 'Password is required',
		'string.min': 'Password must be at least 8 characters',
	}),
});

module.exports = { authSchema };
