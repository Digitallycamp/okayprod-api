const express = require('express');
const profileController = require('./profile.controller.js');
const auth = require('../../common/middleware/auth.middleware.js');
const upload = require('../../common/multer/image-upload.js');

const ProfileRouter = express.Router();

ProfileRouter.get('/me', auth, profileController.getProfile);
ProfileRouter.patch('/me', auth, profileController.updateProfile);

// Avatar upload — one file, field name "avatar"
ProfileRouter.patch(
	'/avatar',
	auth,
	upload.single('avatar'),
	profileController.updateAvatar
);

module.exports = ProfileRouter;