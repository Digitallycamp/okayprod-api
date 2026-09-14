const User = require('../user/user.model.js');

const securityController = {
	/**
	 * POST /api/v1/security/change-password
	 * Body: { currentPassword, newPassword, confirmPassword }
	 * Uses req.session.user.id to identify the authenticated user.
	 */
	changePassword: async (req, res) => {
		try {
			const { currentPassword, newPassword, confirmPassword } = req.body;

			// Basic presence validation
			if (!currentPassword || !newPassword || !confirmPassword) {
				return res.status(400).json({
					success: false,
					message: 'All fields are required',
				});
			}

			// New password match check (defense in depth; frontend also checks)
			if (newPassword !== confirmPassword) {
				return res.status(400).json({
					success: false,
					message: 'New password and confirm password do not match',
				});
			}

			// Length validation
			if (newPassword.length < 8) {
				return res.status(400).json({
					success: false,
					message: 'New password must be at least 8 characters',
				});
			}

			// Find authenticated user from the session — NEVER trust a client-supplied id
			const user = await User.findById(req.session.user.id);

			if (!user) {
				return res.status(404).json({
					success: false,
					message: 'User not found',
				});
			}

			// Verify current password using the existing model method
			const isCurrentPasswordValid = await user.comparePassword(
				currentPassword
			);

			if (!isCurrentPasswordValid) {
				return res.status(400).json({
					success: false,
					message: 'Current password is incorrect',
				});
			}

			// Prevent reuse of the same password
			if (currentPassword === newPassword) {
				return res.status(400).json({
					success: false,
					message: 'New password must be different from the current password',
				});
			}

			// Assign the new password — the pre('save') hook hashes it
			user.password = newPassword;
			await user.save();

			return res.status(200).json({
				success: true,
				message: 'Password updated successfully',
			});
		} catch (error) {
			console.error('Error during change password:', error);
			return res.status(500).json({
				success: false,
				message: 'Internal server error',
			});
		}
	},

	/**
	 * GET /api/v1/security/2fa
	 * Returns the authenticated user's 2FA state.
	 */
	get2FA: async (req, res) => {
		try {
			const user = await User.findById(req.session.user.id).select(
				'twoFactorEnabled'
			);

			if (!user) {
				return res.status(404).json({
					success: false,
					message: 'User not found',
				});
			}

			return res.status(200).json({
				success: true,
				message: '2FA setting retrieved',
				data: {
					twoFactorEnabled: user.twoFactorEnabled,
				},
			});
		} catch (error) {
			console.error('Error fetching 2FA state:', error);
			return res.status(500).json({
				success: false,
				message: 'Internal server error',
			});
		}
	},

	/**
	 * PATCH /api/v1/security/2fa
	 * Body: { twoFactorEnabled: boolean }
	 * Updates the authenticated user's 2FA state.
	 */
	update2FA: async (req, res) => {
		try {
			const { twoFactorEnabled } = req.body;

			// Strict boolean validation — do not coerce arbitrary input
			if (typeof twoFactorEnabled !== 'boolean') {
				return res.status(400).json({
					success: false,
					message: 'twoFactorEnabled must be a boolean',
				});
			}

			const user = await User.findById(req.session.user.id);

			if (!user) {
				return res.status(404).json({
					success: false,
					message: 'User not found',
				});
			}

			user.twoFactorEnabled = twoFactorEnabled;
			await user.save();

			return res.status(200).json({
				success: true,
				message: twoFactorEnabled
					? 'Two-factor authentication enabled'
					: 'Two-factor authentication disabled',
				data: {
					twoFactorEnabled: user.twoFactorEnabled,
				},
			});
		} catch (error) {
			console.error('Error updating 2FA state:', error);
			return res.status(500).json({
				success: false,
				message: 'Internal server error',
			});
		}
	},
};

module.exports = securityController;