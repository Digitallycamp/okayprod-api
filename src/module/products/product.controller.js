const createProductController = (req, res, next) => {

	console.log('FILES', req.files);
	res.status(201).json({
		success: true,
		message: 'Product created succesffuly',
		data: req.body,
	});
};

module.exports = { createProductController };
