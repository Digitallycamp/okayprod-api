const permisions = (permission = []) => {
	(req, res, next) => {
		const role = req.session.user.role;
		const hasPermison = permission.includes(role);
		if (!hasPermison) {
			res.status(403).json({ succes: false, messsage: 'Uthorized!' });
		}
		next();
	};
};

module.exports = permisions;
