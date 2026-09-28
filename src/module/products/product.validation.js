const Joi = require('joi');


const uploadedFileSchema = Joi.object({
	url: Joi.string().uri().required(),
	public_id: Joi.string().trim().required(),
});

const createProductSchema = Joi.object({
	product_type: Joi.string()
		.trim()
		.valid('digital', 'physical', 'service')
		.required(),

	product_name: Joi.string()
		.trim()
		.min(2)
		.max(150)
		.required(),

	product_description: Joi.string()
		.trim()
		.min(10)
		.max(5000)
		.required(),

	product_price: Joi.number()
		.min(0)
		.required(),

	currency: Joi.string()
		.trim()
		.uppercase()
		.valid('NGN')
		.default('NGN'),

	cover_image: Joi.array()
		.items(uploadedFileSchema)
		.min(1)
		.max(1)
		.required(),

	digital_asset_file: Joi.array()
		.items(uploadedFileSchema)
		.when('product_type', {
			is: 'digital',
			then: Joi.array()
				.items(uploadedFileSchema)
				.min(1)
				.max(1)
				.required(),
			otherwise: Joi.array()
				.items(uploadedFileSchema)
				.max(1)
				.default([]),
		}),

	is_store_preview: Joi.boolean()
		.default(false),

	is_published: Joi.boolean()
		.default(true),
});

module.exports = {
	createProductSchema,
};