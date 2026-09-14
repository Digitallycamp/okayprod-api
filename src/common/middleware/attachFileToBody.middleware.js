const cloudinary = require('../cloudinary');

/**
 * Upload a single Multer file object (with a .buffer) to Cloudinary.
 * Returns { url, public_id }.
 */
const uploadToCloudinary = (file) => {
	return new Promise((resolve, reject) => {
		if (!file || !file.buffer) {
			return reject(new Error('No file buffer provided'));
		}
		const stream = cloudinary.uploader.upload_stream(
			{ resource_type: 'auto' },
			(error, result) => {
				if (error) return reject(error);
				resolve({ url: result.secure_url, public_id: result.public_id });
			}
		);
		stream.end(file.buffer);
	});
};

/**
 * Middleware: uploads any files present on req.files to Cloudinary and
 * attaches the resulting URLs (and public_ids) to req.body.
 *
 * Expects Multer to be configured with `.fields([...])` so that
 * `req.files` is an object keyed by field name.
 * Example usage:
 *   upload.fields([
 *     { name: 'cover_image', maxCount: 1 },
 *     { name: 'digital_asset_file', maxCount: 1 },
 *   ])
 */
const attachFilesToBody = async (req, res, next) => {
	try {
		if (!req.files) {
			return next();
		}

		// req.files can be an array (upload.array) or object (upload.fields).
		// This middleware expects the object shape (upload.fields), but we
		// normalise to be safe.
		const filesMap = Array.isArray(req.files)
			? {}
			: req.files;

		// Handle known product fields explicitly
		if (filesMap.cover_image && filesMap.cover_image[0]) {
			const result = await uploadToCloudinary(filesMap.cover_image[0]);
			req.body.cover_image = result.url;
			req.body.cover_image_public_id = result.public_id;
		}

		if (filesMap.digital_asset_file && filesMap.digital_asset_file[0]) {
			const result = await uploadToCloudinary(filesMap.digital_asset_file[0]);
			req.body.digital_asset_file = result.url;
			req.body.digital_asset_file_public_id = result.public_id;
		}

		next();
	} catch (err) {
		next(err);
	}
};

module.exports = attachFilesToBody;