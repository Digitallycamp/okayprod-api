const express = require('express');
const storefrontController = require('./storefront.controller.js');
const auth = require('../../common/middleware/auth.middleware.js');
const upload = require('../../common/multer/image-upload.js');

const storefrontRouter = express.Router();

storefrontRouter.get('/', auth, storefrontController.getStorefront);
storefrontRouter.patch('/', auth, storefrontController.updateStorefront);

// Logo upload — one file, field name "logo"
storefrontRouter.patch(
	'/logo',
	auth,
	upload.single('logo'),
	storefrontController.updateLogo
);

module.exports = storefrontRouter;