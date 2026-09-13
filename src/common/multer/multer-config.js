const multer = require('multer');
const storage = multer.memoryStorage();
const fileSize = 5 * 1024 * 1024;
const allowedTypes = [
	'application/pdf',
	'image/jpeg',
	'image/png',
	'image/jpg',
];

const fileFilter = (req, file, cb) => {
	if (allowedTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error('Only PDF, JPEG, PNG, JPG are allowed'), false);
	}
};
const upload = multer({
	storage,
	fileFilter,
	limit: { fileSize },
});

module.exports = upload;
