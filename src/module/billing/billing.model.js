const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			unique: true,
		},
		availableBalance: { type: Number, default: 4250.00 },
		currency: { type: String, default: 'USD' },
		weeklyGrowth: { type: Number, default: 850.00 },
		payoutMethod: {
			bankName: { type: String, default: 'Chase Checking' },
			accountLast4: { type: String, default: '4829' },
			isVerified: { type: Boolean, default: true },
		},
		payoutSchedule: { type: String, default: 'Weekly (Fridays)' },
		nextPayoutDate: { type: String, default: 'Oct 27, 2023' },
		transactions: [
			{
				type: { type: String, enum: ['withdrawal', 'sale'] },
				title: { type: String, required: true },
				date: { type: String, required: true },
				status: { type: String, enum: ['Cleared', 'Paid', 'Pending'], required: true },
				amount: { type: Number, required: true }, // Negative for withdrawals
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Billing', billingSchema);