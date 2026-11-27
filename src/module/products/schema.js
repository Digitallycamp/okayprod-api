const Joi = require('joi');

const createProductSchema = Joi.object({
	product_type: Joi.string().required(),
	product_name: Joi.string().min(12).required(),
	product_description: Joi.string().min(40).required(),
	product_price: Joi.number().required(),
	cover_image: Joi.array()
		.items(
			Joi.object({
				url: Joi.string().uri().required(),
				public_id: Joi.string().required(),
			})
		)
		.min(1)
		.required(),
	digital_asset_file: Joi.array()
		.items(
			Joi.object({
				url: Joi.string().uri().required(),
				public_id: Joi.string().required(),
			})
		)
		.min(1)
		.required(),
	is_store_preview: Joi.boolean(),
	is_published: Joi.boolean(),
});

const changePasswordSchema = Joi.object({
	currentPassword: Joi.string().required().messages({
		'string.empty': 'Current password is required',
		'any.required': 'Current password is required',
	}),
	newPassword: Joi.string().min(8).required().messages({
		'string.empty': 'New password is required',
		'string.min': 'New password must be at least 8 characters',
		'any.required': 'New password is required',
	}),
	confirmPassword: Joi.string()
		.valid(Joi.ref('newPassword'))
		.required()
		.messages({
			'any.only': 'New password and confirm password do not match',
			'any.required': 'Confirm password is required',
		}),
});

module.exports = { createProductSchema,changePasswordSchema };
