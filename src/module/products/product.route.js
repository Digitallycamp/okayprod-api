const express = require('express');

const productController = require('./product.controller.js');
const auth = require('../../common/middleware/auth.middleware.js');
const upload = require('../../common/multer/multer-config.js');
const attachFilesToBody = require('../../common/middleware/attachFileToBody.middleware.js');
const { validate } = require('../../common/middleware/validation.middleware.js');
const {
	createProductSchema,
} = require('./product.validation.js');

const productRouter = express.Router();

productRouter.post(
	'/create',
	auth,
	upload.fields([
		{
			name: 'cover_image',
			maxCount: 1,
		},
		{
			name: 'digital_asset_file',
			maxCount: 1,
		},
	]),
	attachFilesToBody,
	validate(createProductSchema),
	productController.createProduct
);

module.exports = productRouter;