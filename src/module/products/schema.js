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

module.exports = { createProductSchema };
