const cloudinary = require('../cloudinary');

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


const attachFilesToBody = async (req, res, next) => {
	try {
		if (!req.files) {
			return next();
		}

		const filesMap = Array.isArray(req.files)
			? {}
			: req.files;
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