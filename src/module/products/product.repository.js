const Product = require('./product.model.js');

const productRepository = {
	createProduct: async ({ userId, productData }) => {
		const product = await Product.create({
			...productData,
			user: userId,
		});

		return product;
	},
};

module.exports = productRepository;