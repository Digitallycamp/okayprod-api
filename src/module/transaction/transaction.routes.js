const express = require('express');

const transactionController = require('./transaction.controller.js');
const auth = require('../../common/middleware/auth.middleware.js');
const { validate } = require('../../common/middleware/validation.middleware.js');
const {
	createTransactionSchema,
	transactionQuerySchema,
} = require('./transaction.validation.js');

const transactionRouter = express.Router();
transactionRouter.post(
	'/',
	auth,
	validate(createTransactionSchema),
	transactionController.createTransaction
);

transactionRouter.get(
	'/',
	auth,
	validate(transactionQuerySchema, 'query'),
	transactionController.getTransactions
);

transactionRouter.get(
	'/stats',
	auth,
	validate(transactionQuerySchema, 'query'),
	transactionController.getTransactionStats
);

module.exports = transactionRouter;