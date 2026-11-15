const { StatusCodes } = require('http-status-codes');
const { ApiError } = require('../../common/middleware/error.middleware.js');
const userRepository = require('./security.repository.js');

const changePassword = async ({ userId, currentPassword, newPassword }) => {
	const user = await userRepository.findUserById(userId);

	if (!user) {
		throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
	}

	const isCurrentPasswordValid = await user.comparePassword(currentPassword);

	if (!isCurrentPasswordValid) {
		throw new ApiError(
			StatusCodes.BAD_REQUEST,
			'Current password is incorrect'
		);
	}

	if (currentPassword === newPassword) {
		throw new ApiError(
			StatusCodes.BAD_REQUEST,
			'New password must be different from the current password'
		);
	}

	user.password = newPassword;
	await userRepository.saveUser(user);

	return { success: true };
};

const get2FA = async (userId) => {
	const user = await userRepository.findUserByIdSelect(
		userId,
		'twoFactorEnabled'
	);

	if (!user) {
		throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
	}

	return { twoFactorEnabled: user.twoFactorEnabled };
};

const update2FA = async ({ userId, twoFactorEnabled }) => {
	const user = await userRepository.findUserById(userId);

	if (!user) {
		throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
	}

	user.twoFactorEnabled = twoFactorEnabled;
	await userRepository.saveUser(user);

	return { twoFactorEnabled: user.twoFactorEnabled };
};

module.exports = {
	changePassword,
	get2FA,
	update2FA,
};