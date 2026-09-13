const transactionServices = require('./transaction.services.js');

const transactionController = {
    createTransaction: async (req, res) => {
		try {
			const userId = req.session.user.id;

			const transaction =
				await transactionServices.createTransaction({
					userId,
					transactionData: req.body,
				});

			return res.status(201).json({
				success: true,
				message: 'Transaction created successfully',
				data: transaction,
			});
		} catch (error) {
			console.error('Error creating transaction:', error);

			return res.status(500).json({
				success: false,
				message: 'Failed to create transaction',
			});
		}
	},
	getTransactions: async (req, res) => {
		try {
			const userId = req.session.user.id;

			const {
				search = '',
				status = '',
				startDate = '',
				endDate = '',
				page = 1,
				limit = 6,
			} = req.query;

			const result = await transactionServices.getTransactions({
				userId,
				search,
				status,
				startDate,
				endDate,
				page: Number(page),
				limit: Number(limit),
			});

			return res.status(200).json({
				success: true,
				message: 'Transactions fetched successfully',
				data: result,
			});
		} catch (error) {
			console.error('Error fetching transactions:', error);

			return res.status(500).json({
				success: false,
				message: 'Failed to fetch transactions',
			});
		}
	},

	getTransactionStats: async (req, res) => {
		try {
			const userId = req.session.user.id;

			const {
				startDate = '',
				endDate = '',
			} = req.query;

			const result =
				await transactionServices.getTransactionStats({
					userId,
					startDate,
					endDate,
				});

			return res.status(200).json({
				success: true,
				message: 'Transaction statistics fetched successfully',
				data: result,
			});
		} catch (error) {
			console.error(
				'Error fetching transaction statistics:',
				error
			);

			return res.status(500).json({
				success: false,
				message: 'Failed to fetch transaction statistics',
			});
		}
	},
};

module.exports = transactionController;