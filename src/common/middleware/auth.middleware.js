const SessionTrack = require('../../module/session/session.model.js');

// Only update lastSeenAt if it's older than this (avoid DB writes on every request)
const TOUCH_DEBOUNCE_MS = 30 * 1000; // 30 seconds

const auth = async (req, res, next) => {
	if (req.session && req.session.user) {
		// Fire-and-forget touch — do not await, do not block the request
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

	// Skip the write if we touched it recently
	if (now - lastSeen < TOUCH_DEBOUNCE_MS) return;

	track.lastSeenAt = new Date();
	await track.save();
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