const SessionTrack = require('../../module/session/session.model.js');

const TOUCH_DEBOUNCE_MS = 30 * 1000; 

const auth = async (req, res, next) => {
	if (req.session && req.session.user) {
	
		touchSession(req).catch((err) =>
			console.error('Error touching SessionTrack:', err)
		);
		next();
	} else {
		res.status(401).json({ message: 'Unauthorized' });
	}
};

const touchSession = async (req) => {
	const sessionId = req.sessionID;
	if (!sessionId) return;

	const track = await SessionTrack.findOne({ sessionId });
	if (!track) return;

	const now = Date.now();
	const lastSeen = new Date(track.lastSeenAt).getTime();


	if (now - lastSeen < TOUCH_DEBOUNCE_MS) return;

	track.lastSeenAt = new Date();
	await track.save();
};

const permisions = (permission = []) => {
	(req, res, next) => {
		const role = req.session.user.role;
		const hasPermison = permission.includes(role);
		if (hasPermison) next();
	};
};

module.exports = auth;