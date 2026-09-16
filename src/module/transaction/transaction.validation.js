const Joi = require('joi');

const createTransactionSchema = Joi.object({
	orderId: Joi.string().trim().required(),

	customer: Joi.object({
		name: Joi.string().trim().required(),
		email: Joi.string().email().trim().required(),
		initials: Joi.string().trim().required(),
		image: Joi.string().allow('').default(''),
	}).required(),

	product: Joi.object({
		name: Joi.string().trim().required(),
		type: Joi.string().trim().required(),
	}).required(),

	amount: Joi.number().required(),

	currency: Joi.string()
		.trim()
		.uppercase()
		.default('NGN'),

	status: Joi.string()
		.valid('COMPLETED', 'PENDING', 'REFUNDED')
		.default('PENDING'),

	transactionDate: Joi.date().required(),
});

const transactionQuerySchema = Joi.object({
	search: Joi.string()
		.trim()
		.max(100)
        .allow('')
		.default(''),

	status: Joi.string()
		.valid('', 'COMPLETED', 'PENDING', 'REFUNDED')
		.default(''),

	startDate: Joi.date()
		.iso()
		.allow('')
		.default(''),

	endDate: Joi.date()
		.iso()
		.allow('')
		.default(''),

	page: Joi.number()
		.integer()
		.min(1)
		.default(1),

	limit: Joi.number()
		.integer()
		.min(1)
		.max(100)
		.default(6),
}).custom((value, helpers) => {
	if (
		value.startDate &&
		value.endDate &&
		new Date(value.startDate) > new Date(value.endDate)
	) {
		return helpers.error('any.invalid', {
			message: 'startDate cannot be after endDate',
		});
	}

	return value;
}).messages({
	'any.invalid': '{{#message}}',
});

module.exports = {
	createTransactionSchema,
	transactionQuerySchema,
};