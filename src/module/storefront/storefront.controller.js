const Storefront = require('./storefront.model.js');
const {
	uploadBuffer,
	deleteFromCloudinary,
} = require('../../utils/cloudinaryUpload.js');


const EDITABLE_FIELDS = [
	'primaryBrandColor',
	'announcementBar',
	'messageContent',
	'logo',
];

const storefrontController = {
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


	updateLogo: async (req, res) => {
		try {
			const userId = req.session.user.id;

			if (!req.file) {
				return res.status(400).json({
					success: false,
					message: 'No file provided. Field name must be "logo".',
				});
			}

			const storefront = await Storefront.findOne({ user: userId });
			if (!storefront) {
				return res.status(404).json({
					success: false,
					message: 'Storefront not found for this user',
				});
			}


			if (storefront.logoPublicId) {
				await deleteFromCloudinary(storefront.logoPublicId);
			}


			const result = await uploadBuffer(req.file.buffer, {
				folder: `okayprod/storefronts/${userId}`,
			});

			storefront.logo = result.url;
			storefront.logoPublicId = result.publicId;
			await storefront.save();

			return res.status(200).json({
				success: true,
				message: 'Logo updated successfully',
				data: { logo: storefront.logo },
			});
		} catch (error) {
			console.error('Error uploading logo:', error);


			if (error.code === 'LIMIT_FILE_SIZE') {
				return res.status(400).json({
					success: false,
					message: 'File too large. Maximum size is 2MB.',
				});
			}

			return res.status(400).json({
				success: false,
				message: error.message || 'Failed to upload logo',
			});
		}
	},
};

module.exports = storefrontController;