const Product = require('./product.model.js');

const productRepository = {
	createProduct: async ({ userId, productData }) => {
		const product = await Product.create({
			...productData,
			user: userId,
		});
		return product;
	},

	// NEW: Fetch all products for a user
	getProductsByUser: async (userId) => {
		return await Product.find({ user: userId }).sort({ createdAt: -1 });
	},
};

module.exports = productRepository;