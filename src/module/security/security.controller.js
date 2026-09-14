const User = require('../user/user.model.js');

const securityController = {
	changePassword: async (req, res) => {
		try {
			const { currentPassword, newPassword, confirmPassword } = req.body;
			if (!currentPassword || !newPassword || !confirmPassword) {
				return res.status(400).json({
					success: false,
					message: 'All fields are required',
				});
			}
			if (newPassword !== confirmPassword) {
				return res.status(400).json({
					success: false,
					message: 'New password and confirm password do not match',
				});
			}
			if (newPassword.length < 8) {
				return res.status(400).json({
					success: false,
					message: 'New password must be at least 8 characters',
				});
			}
			const user = await User.findById(req.session.user.id);

			if (!user) {
				return res.status(404).json({
					success: false,
					message: 'User not found',
				});
			}
			const isCurrentPasswordValid = await user.comparePassword(
				currentPassword
			);

			if (!isCurrentPasswordValid) {
				return res.status(400).json({
					success: false,
					message: 'Current password is incorrect',
				});
			}
			if (currentPassword === newPassword) {
				return res.status(400).json({
					success: false,
					message: 'New password must be different from the current password',
				});
			}
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

	update2FA: async (req, res) => {
		try {
			const { twoFactorEnabled } = req.body;
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