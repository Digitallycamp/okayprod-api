const Storefront = require('./storefront.model.js');

// Fields the authenticated user is allowed to update via the API.
// Anything not in this list (like `user`) is ignored.
const EDITABLE_FIELDS = ['primaryBrandColor', 'announcementBar', 'messageContent', 'logo'];

const storefrontController = {
	/**
	 * GET /api/v1/storefront
	 * Returns the authenticated user's storefront.
	 */
	getStorefront: async (req, res) => {
		try {
			const userId = req.session.user.id;

			const storefront = await Storefront.findOne({ user: userId }).lean();

			if (!storefront) {
				return res.status(404).json({
					success: false,
					message: 'Storefront not found for this user',
				});
			}

			return res.status(200).json({
				success: true,
				message: 'Storefront retrieved',
				data: storefront,
			});
		} catch (error) {
			console.error('Error fetching storefront:', error);
			return res.status(500).json({
				success: false,
				message: 'Internal server error',
			});
		}
	},

	/**
	 * PATCH /api/v1/storefront
	 * Updates only the editable fields of the authenticated user's storefront.
	 */
	updateStorefront: async (req, res) => {
		try {
			const userId = req.session.user.id;

			const storefront = await Storefront.findOne({ user: userId });

			if (!storefront) {
				return res.status(404).json({
					success: false,
					message: 'Storefront not found for this user',
				});
			}

			// Only apply whitelisted fields — never blindly spread req.body
			EDITABLE_FIELDS.forEach((field) => {
				if (Object.prototype.hasOwnProperty.call(req.body, field)) {
					storefront[field] = req.body[field];
				}
			});

			await storefront.save();

			return res.status(200).json({
				success: true,
				message: 'Storefront updated successfully',
				data: storefront,
			});
		} catch (error) {
			console.error('Error updating storefront:', error);
			return res.status(500).json({
				success: false,
				message: 'Internal server error',
			});
		}
	},
};

module.exports = storefrontController;