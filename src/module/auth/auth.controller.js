const User = require('../user/user.model.js');
const emailService = require('../email/services/email.service.js');
const crypto = require('crypto');
const { UAParser } = require('ua-parser-js');
const SessionTrack = require('../session/session.model.js');
const Storefront = require('../storefront/storefront.model.js');
const Profile = require('../profile/profile.model.js');

/**
 * Parse the incoming request's user-agent and create a SessionTrack document
 * for the given user + express-session ID.
 */
const geoip = require('geoip-lite');

const createSessionTrack = async (req, userId) => {
	try {
		const ua = req.headers['user-agent'] || '';
		const parser = new UAParser(ua);
		const parsed = parser.getResult();
		const deviceType = parsed.device.type || 'desktop';
        // Location lookup — the IP never leaves this function
		const clientIp = req.ip || req.headers['x-forwarded-for'] || '';
		const geo = geoip.lookup(clientIp) || {};
		await SessionTrack.create({
			userId,
			sessionId: req.sessionID,
			userAgent: ua,
			browser: {
				name: parsed.browser.name || 'Unknown',
				version: parsed.browser.version || '',
			},
			os: {
				name: parsed.os.name || 'Unknown',
				version: parsed.os.version || '',
			},
			device: {
				type: deviceType,
				vendor: parsed.device.vendor || '',
				model: parsed.device.model || '',
			},
			location: {
				country: geo.country || '',
				region:  geo.region  || '',
				city:    geo.city    || '',
			},
			lastSeenAt: new Date(),
		});
	} catch (err) {
		console.error('Error creating SessionTrack:', err);
	}
};

/**
 * Create a Storefront for a newly registered user.
 * Uses the Storefront schema defaults for brand color, announcement bar and message.
 * If creation fails, we log the error but do NOT crash the registration flow —
 * the user is already created and can retry the storefront setup later.
 */
const createStorefrontForUser = async (userId) => {
	try {
		// Guard against duplicate storefronts (in case of retries)
		const existing = await Storefront.findOne({ user: userId });
		if (existing) return existing;

		const storefront = await Storefront.create({ user: userId });
		return storefront;
	} catch (err) {
		console.error('Error creating Storefront for user:', userId, err);
		return null;
	}
};

const createProfileForUser = async (userId, email) => {
	try {
		const existing = await Profile.findOne({ user: userId });
		if (existing) return existing;

		return await Profile.create({
			user: userId,
			email: email || '',
		});
	} catch (err) {
		console.error('Error creating Profile for user:', userId, err);
		return null;
	}

};

const authController = {
	register: async (req, res) => {
		const { email, password } = req.body;

		try {
			const existingUser = await User.findOne({ email });
			if (existingUser) {
				return res.status(400).json({ message: 'User already exists' });
			}

			const newUser = new User({ email, password });
			await newUser.save();

			// NEW: create the user's Storefront with defaults
			await createStorefrontForUser(newUser._id);
			await createProfileForUser(newUser._id, email);

			return res.status(201).json({ message: 'User registered successfully' });
		} catch (error) {
			console.error('Error during registration:', error);
			return res.status(500).json({ message: 'Internal server error' });
		}
	},

	login: async (req, res) => {
		const { email, password } = req.body;
		if (!email || !password) {
			return res
				.status(400)
				.json({ message: 'Email and password are required' });
		}
		const user = await User.findOne({ email });
		if (!user || !(await user.comparePassword(password))) {
			return res.status(400).json({ message: 'Invalid email or password' });
		}

		req.session.regenerate(async (err) => {
			if (err) {
				console.error('Session regeneration error:', err);
				return res.status(500).json({ message: 'Internal server error' });
			}

			req.session.user = {
				id: user._id,
				username: user.username,
				email: user.email,
			};

			await createSessionTrack(req, user._id);

			return res.status(200).json({ message: 'Login successful' });
		});
	},

	googleAuth: async (req, res) => {
		const { token } = req.body;
		if (!token) {
			return res.status(400).json({ message: 'Google token is required' });
		}
		try {
			const response = await fetch(
				`https://www.googleapis.com/oauth2/v3/userinfo`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			if (!response.ok) throw new Error('Failed to fetch Google user info');

			const googleUser = await response.json();
			let user = await User.findOne({ email: googleUser.email });

			// Only create a Storefront if this is a BRAND NEW user
			let isNewUser = false;

			if (!user) {
				user = new User({
					username: googleUser.name,
					email: googleUser.email,
					password: googleUser.sub + 'snjksnsj',
					provider: 'google',
				});
				await user.save();
				isNewUser = true;
			}

			// NEW: only create the Storefront for brand-new Google users
			if (isNewUser) {
				await createStorefrontForUser(user._id);
			}

			req.session.regenerate((err) => {
				if (err) {
					console.error('Session regeneration error:', err);
					return res.status(500).json({ message: 'Internal server error' });
				}

				req.session.user = {
					id: user._id,
					username: user.username,
					email: user.email,
				};

				req.session.save(async (saveErr) => {
					if (saveErr) {
						console.error('Session save error:', saveErr);
						return res.status(500).json({ message: 'Internal server error' });
					}

					await createSessionTrack(req, user._id);

					return res.status(200).json({ message: 'Login successful' });
				});
			});
		} catch (error) {
			console.error('Error during Google authentication:', error);
			return res.status(500).json({ message: 'Internal server error' });
		}
	},

	authenticatedUser: (req, res) => {
		return res.status(200).json(req.session.user);
	},

	logout: (req, res) => {
		req.session.destroy((err) => {
			if (err) {
				console.error('Error during logout:', err);
				return res.status(500).json({ message: 'Internal server error' });
			}

			res.clearCookie('betterAuth_session', {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production' ? true : false,
				sameSite: 'lax',
			});
			return res.status(200).json({ message: 'Logout successful' });
		});
	},

	forgotPassword: async (req, res) => {
		const { email } = req.body;
		if (!email) {
			return res.status(400).json({ message: 'Email is required' });
		}
		const user = await User.findOne({ email });
		if (!user) {
			return res
				.status(400)
				.json({ message: 'User with this email does not exist' });
		}

		const resetToken = crypto.randomBytes(20).toString('hex');
		user.resetPasswordToken = resetToken;
		user.resetPasswordExpires = Date.now() + 3600000;
		await user.save();

		await emailService.sendPasswordResetEmail(email, user.resetPasswordToken);

		return res
			.status(200)
			.json({ message: 'Password reset instructions sent to email' });
	},

	resetPassword: async (req, res) => {
		const { token, password } = req.body;
		if (!token || !password) {
			return res
				.status(400)
				.json({ message: 'Token and Password is required' });
		}

		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpires: { $gt: Date.now() },
		});
		if (!user) {
			return res.status(400).json({ message: 'Invalid or expired token' });
		}

		user.password = password;
		user.resetPasswordToken = null;
		user.resetPasswordExpires = null;
		await user.save();
		return res.status(200).json({ message: 'Password reset successful' });
	},
};

module.exports = authController;