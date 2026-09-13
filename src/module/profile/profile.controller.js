const Profile = require('./profile.model.js');

// Fields the authenticated user is allowed to update.
// Anything else in req.body is ignored — notably `user` and `_id`.
const EDITABLE_FIELDS = ['firstName', 'lastName', 'email', 'website', 'bio', 'avatar'];

const profileController = {
	/**
	 * GET /api/v1/profile/me
	 * Returns the authenticated user's Profile document.
	 */
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

	/**
	 * PATCH /api/v1/profile/me
	 * Updates only the editable fields of the authenticated user's Profile.
	 */
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

			// Whitelist-only update — never spread req.body
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
};

module.exports = profileController;