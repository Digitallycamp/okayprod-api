const mongoose = require('mongoose');

const storefrontSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			// Enforce one Storefront per User at the DB level
			unique: true,
			index: true,
		},
		// Logo URL — will be populated by Cloudinary in a future task.
		// Null means no logo uploaded yet.
		logo: {
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