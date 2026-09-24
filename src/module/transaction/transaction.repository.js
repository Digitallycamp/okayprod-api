const mongoose = require('mongoose');
const Transaction = require('./transaction.model.js');

const transactionRepository = {
	createTransaction: async ({ userId, transactionData }) => {
		const transaction = await Transaction.create({ ...transactionData, user: userId });
		return transaction;
	},

	getTransactions: async ({ userId, search, status, startDate, endDate, page, limit }) => {
		const query = { user: userId };

		if (search) {
			query.$or = [
				{ orderId: { $regex: search, $options: 'i' } },
				{ 'customer.name': { $regex: search, $options: 'i' } },
				{ 'customer.email': { $regex: search, $options: 'i' } },
				{ 'product.name': { $regex: search, $options: 'i' } },
			];
		}

		if (status) {
			query.status = status;
		}

		if (startDate || endDate) {
			query.transactionDate = {};
			if (startDate) { query.transactionDate.$gte = new Date(startDate); }
			if (endDate) {
				const end = new Date(endDate);
				end.setHours(23, 59, 59, 999);
				query.transactionDate.$lte = end;
			}
		}

		const skip = (page - 1) * limit;

		const [transactions, total] = await Promise.all([
			Transaction.find(query).sort({ transactionDate: -1 }).skip(skip).limit(limit).lean(),
			Transaction.countDocuments(query),
		]);

		return {
			transactions,
			total,
			pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
		};
	},

	getTransactionStats: async ({ userId, startDate, endDate }) => {
		const now = new Date();
		let currentStart;
		let currentEnd;

		if (!startDate && !endDate) {
			currentEnd = now;
			currentStart = new Date(now);
			currentStart.setDate(currentStart.getDate() - 29);
			currentStart.setHours(0, 0, 0, 0);
		} else {
			currentStart = startDate ? new Date(startDate) : new Date(endDate);
			currentEnd = endDate ? new Date(endDate) : new Date(startDate);
			currentStart.setHours(0, 0, 0, 0);
			currentEnd.setHours(23, 59, 59, 999);
		}

		const periodLength = currentEnd.getTime() - currentStart.getTime();
		const previousEnd = new Date(currentStart.getTime() - 1);
		const previousStart = new Date(currentStart.getTime() - periodLength);
		previousStart.setHours(0, 0, 0, 0);

		const userObjectId = new mongoose.Types.ObjectId(userId);

		const getStatsForPeriod = async (periodStart, periodEnd) => {
			const stats = await Transaction.aggregate([
				{
					$match: {
						user: userObjectId,
						transactionDate: { $gte: periodStart, $lte: periodEnd },
					},
				},
				{
					$group: {
						_id: null,
						totalVolume: {
							$sum: { $cond: [{ $ne: ['$status', 'REFUNDED'] }, '$amount', 0] },
						},
						totalOrders: { $sum: 1 },
						totalRefunds: {
							$sum: { $cond: [{ $eq: ['$status', 'REFUNDED'] }, 1, 0] },
						},
					},
				},
			]).exec({ maxTimeMS: 30000 });

			const result = stats[0] || { totalVolume: 0, totalOrders: 0, totalRefunds: 0 };

			const refundRate = result.totalOrders > 0 ? (result.totalRefunds / result.totalOrders) * 100 : 0;

			return {
				totalVolume: result.totalVolume,
				totalOrders: result.totalOrders,
				totalRefunds: result.totalRefunds,
				refundRate: Number(refundRate.toFixed(1)),
			};
		};

		const [currentStats, previousStats] = await Promise.all([
			getStatsForPeriod(currentStart, currentEnd),
			getStatsForPeriod(previousStart, previousEnd),
		]);

		const calculateGrowth = (current, previous) => {
			if (previous === 0) { return 0; }
			return Number((((current - previous) / previous) * 100).toFixed(1));
		};

		const volumeGrowth = calculateGrowth(currentStats.totalVolume, previousStats.totalVolume);
		const orderGrowth = calculateGrowth(currentStats.totalOrders, previousStats.totalOrders);
		const refundGrowth = calculateGrowth(currentStats.refundRate, previousStats.refundRate);

		return {
			totalVolume: currentStats.totalVolume,
			totalOrders: currentStats.totalOrders,
			refundRate: currentStats.refundRate,
			volumeGrowth,
			orderGrowth,
			refundGrowth,
			currentPeriod: { startDate: currentStart, endDate: currentEnd },
			previousPeriod: { startDate: previousStart, endDate: previousEnd },
		};
	},
};

module.exports = transactionRepository;