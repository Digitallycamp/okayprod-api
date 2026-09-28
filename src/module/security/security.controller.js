const securityService = require('./security.service.js');

const securityController = {
	changePassword: async (req, res, next) => {
		try {
			const { currentPassword, newPassword } = req.body;

			await securityService.changePassword({
				userId: req.session.user.id,
				currentPassword,
				newPassword,
			});

			return res.status(200).json({
				success: true,
				message: 'Password updated successfully',
			});
		} catch (error) {
			next(error);
		}
	},

	get2FA: async (req, res, next) => {
		try {
			const result = await securityService.get2FA(req.session.user.id);

			return res.status(200).json({
				success: true,
				message: '2FA setting retrieved',
				data: result,
			});
		} catch (error) {
			next(error);
		}
	},

	update2FA: async (req, res, next) => {
		try {
			const { twoFactorEnabled } = req.body;

			const result = await securityService.update2FA({
				userId: req.session.user.id,
				twoFactorEnabled,
			});

			return res.status(200).json({
				success: true,
				message: twoFactorEnabled
					? 'Two-factor authentication enabled'
					: 'Two-factor authentication disabled',
				data: result,
			});
		} catch (error) {
			next(error);
		}
	},
};

module.exports = securityController;