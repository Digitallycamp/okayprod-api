const mongoose = require('mongoose');

const storefrontSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			unique: true,
			index: true,
		},
		logo: {
			type: String,
			default: null,
		},

		logoPublicId: {
			type: String,
			default: null,
		},
		primaryBrandColor: {
			type: String,
			default: '#F48031',
		},
		announcementBar: {
			type: Boolean,
			default: true,
		},
		messageContent: {
			type: String,
			default:
				'🎉 Huge Summer Sale! Get 20% off all digital courses using code SUMMER20 at checkout.',
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Storefront', storefrontSchema);