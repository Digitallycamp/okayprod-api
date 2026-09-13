const express = require('express');

const transactionController = require('./transaction.controller.js');
const auth = require('../../common/middleware/auth.middleware.js');

const transactionRouter = express.Router();
transactionRouter.post(
	'/',
	auth,
	transactionController.createTransaction
);

transactionRouter.get(
	'/',
	auth,
	transactionController.getTransactions
);

transactionRouter.get(
	'/stats',
	auth,
	transactionController.getTransactionStats
);

module.exports = transactionRouter;