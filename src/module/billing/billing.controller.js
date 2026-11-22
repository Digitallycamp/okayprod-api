const Billing = require('./billing.model.js');

const billingController = {
	getBillingDetails: async (req, res) => {
		try {
			const userId = req.session.user.id;
			let billing = await Billing.findOne({ user: userId });

			// If no billing record exists, create one with the default dummy data from Figma
			if (!billing) {
				billing = await Billing.create({
					user: userId,
					transactions: [
						{ type: 'withdrawal', title: 'Withdrawal to Chase', date: 'Oct 20, 2023', status: 'Cleared', amount: -1250.00 },
						{ type: 'sale', title: 'Sale: Advanced Mastery Courses', date: 'Oct 19, 2023', status: 'Paid', amount: 299.00 },
						{ type: 'sale', title: 'Sale: Design System Template', date: 'Oct 18, 2023', status: 'Paid', amount: 149.00 },
						{ type: 'withdrawal', title: 'Withdrawal to Chase', date: 'Oct 15, 2023', status: 'Pending', amount: -850.00 },
					]
				});
			}

			return res.status(200).json({
				success: true,
				message: 'Billing details retrieved',
				data: billing,
			});
		} catch (error) {
			console.error('Error fetching billing:', error);
			return res.status(500).json({ success: false, message: 'Internal server error' });
		}
	},
};

module.exports = billingController;