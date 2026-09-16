const transactionServices = require('./transaction.services.js');

const transactionController = {
	createTransaction: async (req, res, next) => {
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
			return next(error);
		}
	},

	getTransactions: async (req, res, next) => {
		try {
			const userId = req.session.user.id;

			const {
				search = '',
				status = '',
				startDate = '',
				endDate = '',
				page = 1,
				limit = 6,
			} = req.validatedQuery || req.query;

			const result = await transactionServices.getTransactions({
				userId,
				search,
				status,
				startDate,
				endDate,
				page: Number(page),
				limit: Number(limit),
			});

			const hasData =
				result.transactions &&
				result.transactions.length > 0;

			return res.status(200).json({
				success: true,
				message: hasData
					? 'Transactions fetched successfully'
					: 'No transactions found',
				data: result.transactions,
				pagination: result.pagination,
			});
		} catch (error) {
			console.error('Error fetching transactions:', error);
			return next(error);
		}
	},

	getTransactionStats: async (req, res, next) => {
		try {
			const userId = req.session.user.id;

			const {
				startDate = '',
				endDate = '',
			} = req.validatedQuery || req.query;

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

			return next(error);
		}
	},
};

module.exports = transactionController;