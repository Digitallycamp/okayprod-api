const productRepository = require('./product.repository.js');

const productServices = {
	createProduct: async ({ userId, productData }) => {
		const product = await productRepository.createProduct({
			userId,
			productData,
		});
		return product;
	},

	// NEW
	getProducts: async (userId) => {
		return await productRepository.getProductsByUser(userId);
	},
};

module.exports = productServices;