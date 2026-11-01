const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
	{
		orderId: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},

		customer: {
			name: {
				type: String,
				required: true,
				trim: true,
			},
			email: {
				type: String,
				required: true,
				lowercase: true,
				trim: true,
			},
			initials: {
				type: String,
				required: true,
				trim: true,
			},
			image: {
				type: String,
				default: '',
			},
		},

		product: {
			name: {
				type: String,
				required: true,
				trim: true,
			},
			type: {
				type: String,
				required: true,
				trim: true,
			},
		},

		amount: {
			type: Number,
			required: true,
		},

		currency: {
			type: String,
			default: 'NGN',
			uppercase: true,
			trim: true,
		},

		status: {
			type: String,
			enum: ['COMPLETED', 'PENDING', 'REFUNDED'],
			default: 'PENDING',
		},

		transactionDate: {
			type: Date,
			required: true,
		},

		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

transactionSchema.index({ user: 1, transactionDate: -1 });
transactionSchema.index({ user: 1, status: 1 });
transactionSchema.index({ user: 1, orderId: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);