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
			type: String,
			required: true,
			index: true,
		},
		userAgent: {
			type: String,
			default: '',
		},
		browser: {
			name: { type: String, default: 'Unknown' },
			version: { type: String, default: '' },
		},
		os: {
			name: { type: String, default: 'Unknown' },
			version: { type: String, default: '' },
		},
		device: {
			type: { type: String, default: 'desktop' },
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
sessionTrackSchema.index({ userId: 1, lastSeenAt: -1 });

module.exports = mongoose.model('SessionTrack', sessionTrackSchema);