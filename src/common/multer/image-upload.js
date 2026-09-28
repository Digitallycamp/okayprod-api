const multer = require('multer');
const storage = multer.memoryStorage();
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
	'image/jpeg',
	'image/jpg',
	'image/png',
];

const fileFilter = (req, file, cb) => {
	if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
		return cb(
			new Error('Invalid file type. Allowed: JPG, PNG, JPEG .'),
			false
		);
	}
	return cb(null, true);
};

const upload = multer({
	storage,
	limits: { fileSize: MAX_FILE_SIZE_BYTES },
	fileFilter,
});

module.exports = upload;
module.exports.ALLOWED_MIME_TYPES = ALLOWED_MIME_TYPES;
module.exports.MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_BYTES;