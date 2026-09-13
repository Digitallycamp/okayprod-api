const SessionTrack = require('./session.model.js');

// If lastSeenAt is within this window, the session is considered "Active now"
const ACTIVE_THRESHOLD_MS = 60 * 1000; // 1 minute — change to 15 * 60 * 1000 for production

const sessionController = {
	/**
	 * GET /api/v1/security/sessions
	 * Returns all active session tracks for the authenticated user.
	 */
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
					// Raw device type — frontend uses this to pick the lucide icon
					deviceType: track.device.type, // 'mobile' | 'tablet' | 'desktop'
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

	/**
	 * DELETE /api/v1/security/sessions/:id
	 * Soft revoke — no-op for now. Kept as a placeholder endpoint.
	 * The frontend button exists but does not call this yet.
	 */
	revokeSession: async (req, res) => {
		try {
			// Intentionally non-functional. Reserved for a future hard-revoke
			// implementation that also destroys the connect-mongo session.
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