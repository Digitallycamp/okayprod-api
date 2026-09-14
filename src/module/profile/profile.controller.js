const Profile = require('./profile.model.js');
const {
	uploadBuffer,
	deleteFromCloudinary,
} = require('../../utils/cloudinaryUpload.js');

// Whitelist — never allow `user`, `avatar`, or `avatarPublicId` to be set via PATCH /profile/me
const EDITABLE_FIELDS = ['firstName', 'lastName', 'email', 'website', 'bio'];

const profileController = {
	getProfile: async (req, res) => {
		try {
			const userId = req.session.user.id;
			const profile = await Profile.findOne({ user: userId }).lean();

			if (!profile) {
				return res.status(404).json({
					success: false,
					message: 'Profile not found for this user',
				});
			}

			return res.status(200).json({
				success: true,
				message: 'User profile data',
				data: profile,
			});
		} catch (error) {
			console.error('Error fetching profile:', error);
			return res.status(500).json({
				success: false,
				message: 'Internal server error',
			});
		}
	},

	updateProfile: async (req, res) => {
		try {
			const userId = req.session.user.id;
			const profile = await Profile.findOne({ user: userId });

			if (!profile) {
				return res.status(404).json({
					success: false,
					message: 'Profile not found for this user',
				});
			}

			EDITABLE_FIELDS.forEach((field) => {
				if (Object.prototype.hasOwnProperty.call(req.body, field)) {
					profile[field] = req.body[field];
				}
			});

			await profile.save();

			return res.status(200).json({
				success: true,
				message: 'Profile updated successfully',
				data: profile,
			});
		} catch (error) {
			console.error('Error updating profile:', error);
			return res.status(500).json({
				success: false,
				message: 'Internal server error',
			});
		}
	},

	// NEW: Avatar upload
	updateAvatar: async (req, res) => {
		try {
			const userId = req.session.user.id;

			if (!req.file) {
				return res.status(400).json({
					success: false,
					message: 'No file provided. Field name must be "avatar".',
				});
			}

			const profile = await Profile.findOne({ user: userId });
			if (!profile) {
				return res.status(404).json({
					success: false,
					message: 'Profile not found for this user',
				});
			}

			if (profile.avatarPublicId) {
				await deleteFromCloudinary(profile.avatarPublicId);
			}

			const result = await uploadBuffer(req.file.buffer, {
				folder: `okayprod/avatars/${userId}`,
			});

			profile.avatar = result.url;
			profile.avatarPublicId = result.publicId;
			await profile.save();

			return res.status(200).json({
				success: true,
				message: 'Avatar updated successfully',
				data: { avatar: profile.avatar },
			});
		} catch (error) {
			console.error('Error uploading avatar:', error);

			if (error.code === 'LIMIT_FILE_SIZE') {
				return res.status(400).json({
					success: false,
					message: 'File too large. Maximum size is 2MB.',
				});
			}

			return res.status(400).json({
				success: false,
				message: error.message || 'Failed to upload avatar',
			});
		}
	},
};

module.exports = profileController;