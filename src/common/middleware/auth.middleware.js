const auth = (req, res, next) => {
	if (req.session && req.session.user) {
		next();
	} else {
		res.status(401).json({ message: 'Unauthorized' });
	}
};

// user and admin or admin , supper ['admin'. 'user']
const permisions = (permission = []) => {
	(req, res, next) => {
		const role = req.session.user.role;
		const hasPermison = permission.includes(role);
		if (hasPermison) next();
	};
};

module.exports = auth;
