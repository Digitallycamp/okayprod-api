const express = require('express');
const storefrontController = require('./storefront.controller.js');
const auth = require('../../common/middleware/auth.middleware.js');

const storefrontRouter = express.Router();

// All storefront routes require authentication
storefrontRouter.get('/', auth, storefrontController.getStorefront);
storefrontRouter.patch('/', auth, storefrontController.updateStorefront);

module.exports = storefrontRouter;