const mongoose = require('mongoose');

const productFileSchema = new mongoose.Schema(
	{
		url: {
			type: String,
			required: true,
			trim: true,
		},

		public_id: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{ _id: false }
);

const productSchema = new mongoose.Schema(
	{
		product_type: {
			type: String,
			enum: ['digital', 'physical', 'service'],
			required: true,
			default: 'digital',
			trim: true,
		},

		product_name: {
			type: String,
			required: true,
			trim: true,
		},

		product_description: {
			type: String,
			required: true,
			trim: true,
		},

		product_price: {
			type: Number,
			required: true,
			min: 0,
		},

		currency: {
			type: String,
			default: 'NGN',
			uppercase: true,
			trim: true,
		},

		cover_image: {
			type: [productFileSchema],
			default: [],
		},

		digital_asset_file: {
			type: [productFileSchema],
			default: [],
		},

		is_store_preview: {
			type: Boolean,
			default: false,
		},

		is_published: {
			type: Boolean,
			default: true,
		},

		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		compare_at_price: {
			type: Number,
			min: 0,
		},
		sku: {
			type: String,
			trim: true,
		},
		barcode: {
			type: String,
			trim: true,
		},
		weight: {
			type: Number,
			min: 0,
		},
		weight_unit: {
			type: String,
			enum: ['kg', 'g', 'lb', 'oz'],
			default: 'kg',
		},
		dimensions_length: {
			type: Number,
			min: 0,
		},
		dimensions_width: {
			type: Number,
			min: 0,
		},
		dimensions_height: {
			type: Number,
			min: 0,
		},
		shipping_rate_type: {
			type: String,
			enum: ['calculated', 'flat'],
			default: 'calculated',
		},
		category: {
			type: String,
			trim: true,
		},
	},
	{
		timestamps: true,
	}
);

productSchema.index({
	user: 1,
	createdAt: -1,
});

productSchema.index({
	user: 1,
	product_type: 1,
});

productSchema.index({
	user: 1,
	is_published: 1,
});

module.exports = mongoose.model('Product', productSchema);