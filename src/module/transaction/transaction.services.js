const transactionRepository = require('./transaction.repository.js');

const transactionServices = {
    createTransaction: async ({ userId, transactionData }) => {
		return await transactionRepository.createTransaction({
			userId,
			transactionData,
		});
	},
    
	getTransactions: async ({
		userId,
		search,
		status,
		startDate,
		endDate,
		page,
		limit,
	}) => {
		const result = await transactionRepository.getTransactions({
			userId,
			search,
			status,
			startDate,
			endDate,
			page,
			limit,
		});

		const transactions = result.transactions.map((transaction) => ({
			id: transaction.orderId,

			customer: transaction.customer.name,

			email: transaction.customer.email,

			initials: transaction.customer.initials,

			image: transaction.customer.image,

			product: transaction.product.name,

			type: transaction.product.type,

			date: new Date(transaction.transactionDate).toLocaleDateString(
				'en-US',
				{
					month: 'short',
					day: '2-digit',
					year: 'numeric',
				}
			),

			time: new Date(transaction.transactionDate).toLocaleTimeString(
				'en-US',
				{
					hour: '2-digit',
					minute: '2-digit',
					hour12: false,
				}
			),

			amount: transaction.amount,

			status: transaction.status,
		}));

		const totalPages = Math.ceil(result.total / limit);

		return {
			transactions,
			pagination: {
				page,
				limit,
				total: result.total,
				totalPages,
			},
		};
	},

	getTransactionStats: async ({
		userId,
		startDate,
		endDate,
	}) => {
		return await transactionRepository.getTransactionStats({
			userId,
			startDate,
			endDate,
		});
	},
};

module.exports = transactionServices;