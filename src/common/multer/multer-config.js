const multer = require('multer');
const storage = multer.memoryStorage();
const fileSize = 5 * 1024 * 1024;

const allowedTypes = [
	'application/pdf',
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/svg+xml',
	'image/webp',
];

const fileFilter = (req, file, cb) => {
	if (allowedTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(
			new Error(
				'Invalid file type. Allowed: PDF, JPEG, JPG, PNG, SVG, WEBP.'
			),
			false
		);
	}
};

const upload = multer({
	storage,
	fileFilter,
	limits: { fileSize },
});

module.exports = upload;