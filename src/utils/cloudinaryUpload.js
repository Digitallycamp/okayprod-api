const cloudinary = require('../common/cloudinary');

/**
 * Uploads a Buffer (from Multer memoryStorage) to Cloudinary.
 * @param {Buffer} buffer
 * @param {Object} options - { folder, resourceType }
 * @returns {Promise<{ url: string, publicId: string }>}
 */
const uploadBuffer = (buffer, options = {}) => {
	const { folder = 'okayprod/uploads', resourceType = 'image' } = options;

	return new Promise((resolve, reject) => {
		if (!buffer) {
			return reject(new Error('No buffer provided to uploadBuffer'));
		}

		const stream = cloudinary.uploader.upload_stream(
			{ folder, resource_type: resourceType },
			(error, result) => {
				if (error) return reject(error);
				resolve({ url: result.secure_url, publicId: result.public_id });
			}
		);

		stream.end(buffer);
	});
};

/**
 * Deletes an image from Cloudinary by its public_id.
 * Safe to call with a falsy publicId — it just no-ops.
 */
const deleteFromCloudinary = async (publicId) => {
	if (!publicId) return;
	try {
		await cloudinary.uploader.destroy(publicId);
	} catch (err) {
		// Don't let cleanup failure break the main flow
		console.error('Error deleting from Cloudinary:', err);
	}
};

module.exports = { uploadBuffer, deleteFromCloudinary };