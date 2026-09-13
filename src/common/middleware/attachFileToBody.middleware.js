const cloudinary = require('../cloudinary');

const attachFilesToBody = async (req, res, next) => {
	try {
		if (req.files && req.files.length > 0) {
			const uploadedPromise = req.files.map((file) => {
				return new Promise((resolve, reject) => {
					cloudinary.uploader
						.upload_stream({ resource_type: 'auto' }, (error, result) => {
							if (error) return reject(error);
							resolve({ url: result.secure_url, public_id: result.public_id });
						})
						.end(file.buffer);
				});
			});

			const uploadedFiles = await Promise.all(uploadedPromise);
			// req.body.file = uploadedFiles;
			if (req.files.cover_image) {
				req.body.cover_image = await uploadToCloudinary(req.files.cover_image);
			}
			if (req.files.digital_asset_file) {
				req.body.digital_asset_file = await uploadToCloudinary(
					req.files.digital_asset_file
				);
			}
		}
		next();
	} catch (err) {
		next(err);
	}
};

module.exports = attachFilesToBody;
