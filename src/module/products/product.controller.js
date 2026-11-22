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

	// NEW
	getProducts: async (req, res) => {
		try {
			const userId = req.session.user.id;
			const products = await productServices.getProducts(userId);
			return res.status(200).json({
				success: true,
				message: 'Products retrieved successfully',
				data: products,
			});
		} catch (error) {
			console.error('Error fetching products:', error);
			return res.status(500).json({
				success: false,
				message: 'Internal server error',
			});
		}
	},
};

module.exports = productController;