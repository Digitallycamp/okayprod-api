const express = require('express');
const { createProductController } = require('./product.controller');
const upload = require('../../common/multer/multer-config');
const attachFilesToBody = require('../../common/middleware/attachFileToBody.middleware');
const { validate } = require('../../common/middleware/validation.middleware');
const { createProductSchema } = require('./schema');
const productRouter = express.Router();
productRouter.post(
	'/create',
	upload.fields([
		{ name: 'cover_image', maxCount: 1 },
		{ name: 'digital_asset_file', maxCount: 1 },
	]),
	attachFilesToBody,
	validate(createProductSchema),
	createProductController
);

module.exports = productRouter;
