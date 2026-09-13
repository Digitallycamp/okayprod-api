const mongoose = require('mongoose');

const sessionTrackSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},
		sessionId: {
			// This is express-session's req.sessionID — the key stored in connect-mongo
			type: String,
			required: true,
			index: true,
		},
		// Raw user-agent string (stored for debugging; not sent to frontend)
		userAgent: {
			type: String,
			default: '',
		},
		// Parsed browser info from ua-parser-js
		browser: {
			name: { type: String, default: 'Unknown' },
			version: { type: String, default: '' },
		},
		// Parsed OS info from ua-parser-js
		os: {
			name: { type: String, default: 'Unknown' },
			version: { type: String, default: '' },
		},
		// Parsed device info from ua-parser-js (used to pick device icon)
		device: {
			type: { type: String, default: 'desktop' }, // 'mobile' | 'tablet' | 'desktop'
			vendor: { type: String, default: '' },
			model: { type: String, default: '' },
		},
		ip: {
			type: String,
			default: '',
		},
		lastSeenAt: {
			type: Date,
			default: Date.now,
			index: true,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
        location: {
            country: { type: String, default: '' },
            region:  { type: String, default: '' },
            city:    { type: String, default: '' },
        },
	}
);

// Fast lookup for "list all tracks for this user, newest first"
sessionTrackSchema.index({ userId: 1, lastSeenAt: -1 });

module.exports = mongoose.model('SessionTrack', sessionTrackSchema);