const express = require('express');
const securityController = require('./security.controller.js');
const auth = require('../../common/middleware/auth.middleware.js');

const securityRouter = express.Router();

// All security routes require an authenticated session
securityRouter.post('/change-password', auth, securityController.changePassword);

securityRouter.get('/2fa', auth, securityController.get2FA);
securityRouter.patch('/2fa', auth, securityController.update2FA);

module.exports = securityRouter;