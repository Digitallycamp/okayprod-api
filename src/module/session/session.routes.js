const express = require('express');
const sessionController = require('./session.controller.js');
const auth = require('../../common/middleware/auth.middleware.js');

const sessionRouter = express.Router();

// All session routes require authentication
sessionRouter.get('/', auth, sessionController.getSessions);
sessionRouter.delete('/:id', auth, sessionController.revokeSession);

module.exports = sessionRouter;