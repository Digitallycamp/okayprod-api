const express = require('express');
const securityController = require('./security.controller.js');
const auth = require('../../common/middleware/auth.middleware.js');
const { validate } = require('../../common/middleware/validation.middleware.js');
const {
	changePasswordSchema,
	update2FASchema,
} = require('../../utils/schema.js');

const securityRouter = express.Router();

securityRouter.post( '/change-password', auth, 
    validate(changePasswordSchema), securityController.changePassword );

securityRouter.get('/2fa', auth, securityController.get2FA);

securityRouter.patch(
	'/2fa',
	auth,
	validate(update2FASchema),
	securityController.update2FA
);

module.exports = securityRouter;