const express = require('express');
const billingController = require('./billing.controller.js');
const auth = require('../../common/middleware/auth.middleware.js');

const billingRouter = express.Router();

billingRouter.get('/me', auth, billingController.getBillingDetails);

module.exports = billingRouter;