const User = require('../user/user.model.js');

const findUserById = (userId) => User.findById(userId);

const findUserByIdSelect = (userId, fields) =>
	User.findById(userId).select(fields);

const saveUser = (user) => user.save();

module.exports = {
	findUserById,
	findUserByIdSelect,
	saveUser,
};