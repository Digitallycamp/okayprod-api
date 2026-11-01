const productServices = require('./product.services.js');

const productController = {
	createProduct: async (req, res) => {
		const userId = req.session.user.id;

		const product = await productServices.createProduct({
			userId,
			productData: req.body,
		});

		return res.status(201).json({
			success: true,
			message: 'Product created successfuly',
			data: product,
		});
	},
};

module.exports = productController;