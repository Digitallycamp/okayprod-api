const productRepository = require('./product.repository.js');

const productServices = {
	createProduct: async ({ userId, productData }) => {
		const product = await productRepository.createProduct({
			userId,
			productData,
		});

		return product;
	},
};

module.exports = productServices;