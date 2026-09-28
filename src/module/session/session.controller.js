const SessionTrack = require('./session.model.js');

const ACTIVE_THRESHOLD_MS = 60 * 1000; 

const sessionController = {

	getSessions: async (req, res) => {
		try {
			const userId = req.session.user.id;
			const currentSessionId = req.sessionID;

			const tracks = await SessionTrack.find({ userId })
				.sort({ lastSeenAt: -1 })
				.lean();

			const now = Date.now();

			const sessions = tracks.map((track) => {
				const lastSeenMs = new Date(track.lastSeenAt).getTime();
				const isActiveNow = now - lastSeenMs < ACTIVE_THRESHOLD_MS;

				return {
					id: track._id.toString(),
					// Human-readable label built from parsed UA
					device: `${track.browser.name} on ${track.os.name}${
						track.os.version ? ` ${track.os.version}` : ''
					}`,
					deviceType: track.device.type, 
					location: track.location?.city
                        ? `${track.location.city}, ${track.location.country}`
                        : 'Unknown location',
					isActive: isActiveNow,
					isCurrent: track.sessionId === currentSessionId,
					lastSeenAt: track.lastSeenAt,
				};
			});

			return res.status(200).json({
				success: true,
				message: 'Sessions retrieved',
				data: sessions,
			});
		} catch (error) {
			console.error('Error fetching sessions:', error);
			return res.status(500).json({
				success: false,
				message: 'Internal server error',
			});
		}
	},

	revokeSession: async (req, res) => {
		try {

			return res.status(200).json({
				success: false,
				message: 'Session revocation is not yet available',
			});
		} catch (error) {
			console.error('Error revoking session:', error);
			return res.status(500).json({
				success: false,
				message: 'Internal server error',
			});
		}
	},
};

module.exports = sessionController;