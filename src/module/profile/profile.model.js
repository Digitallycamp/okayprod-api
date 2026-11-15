const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			unique: true,
			index: true,
		},
		firstName: {
			type: String,
			trim: true,
		},
		lastName: {
			type: String,
			trim: true,
		},
		email: {
			type: String,
			trim: true,
			lowercase: true,
		},
		website: {
			type: String,
			trim: true,
		},
		bio: {
			type: String,
			maxlength: 160,
			trim: true,
		},
		avatar: {
			type: String,
			default: null,
		},
		avatarPublicId: {
			type: String,
			default: null,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);