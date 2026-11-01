const cloudinary = require('../cloudinary');

const uploadToCloudinary = (file) => {
	return new Promise((resolve, reject) => {
		cloudinary.uploader.upload_stream(
			{
				resource_type: 'auto',
			},
			(error, result) => {
				if (error) {
					return reject(error);
				}

				return resolve({
					url: result.secure_url,
					public_id: result.public_id,
				});
			}
		).end(file.buffer);
	});
};

const attachFilesToBody = async (req, res, next) => {
	try {
		if (req.files && Object.keys(req.files).length > 0) {
			if (req.files.cover_image?.length > 0) {
				const uploadedCoverImages =
					await Promise.all(
						req.files.cover_image.map(
							(file) =>
								uploadToCloudinary(file)
						)
					);

				req.body.cover_image =
					uploadedCoverImages;
			}

			if (
				req.files.digital_asset_file?.length > 0
			) {
				const uploadedDigitalAssets =
					await Promise.all(
						req.files.digital_asset_file.map(
							(file) =>
								uploadToCloudinary(file)
						)
					);

				req.body.digital_asset_file =
					uploadedDigitalAssets;
			}
		}

		next();
	} catch (err) {
		next(err);
	}
};

module.exports = attachFilesToBody;