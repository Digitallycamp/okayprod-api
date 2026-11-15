require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const app = require('./app.js');

// Routers
const authRouter = require('./module/auth/auth.routes.js');
const profileRouter = require('./module/profile/profile.routes.js');
const securityRouter = require('./module/security/security.routes.js');
const sessionRouter = require('./module/session/session.routes.js');
const storefrontRouter = require('./module/storefront/storefront.routes.js');
const transactionRouter = require('./module/transaction/transaction.routes.js');
const productRouter = require('./module/products/product.route.js');

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./utils/swagger.json');

// Error handling — destructure errorHandler (that's what the file exports)
const { errorHandler } = require('./common/middleware/error.middleware.js');

// DB
const connectDb = require('./common/db/connetDb.js');

const port = process.env.PORT || 8000;

// CORS
app.use(
	cors({
		origin: ['http://localhost:5173', 'http://localhost:5174'],
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
	})
);

app.use(express.json());

// Session
app.use(
	session({
		name: 'betterAuth_session',
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({
			mongoUrl: process.env.MONGO_URI,
			ttl: 24 * 60 * 60 * 1000,
		}),
		cookie: {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production' ? true : false,
			maxAge: 1000 * 24 * 60 * 60,
			sameSite: 'lax',
			path: '/',
		},
	})
);

// API docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/profile', profileRouter);
app.use('/api/v1/security', securityRouter);
app.use('/api/v1/security/sessions', sessionRouter);
app.use('/api/v1/storefront', storefrontRouter);
app.use('/api/v1/transactions', transactionRouter);
app.use('/api/v1/products', productRouter);

// Error handler — MUST be after all routes
app.use(errorHandler);

// Start server
const startServer = async () => {
	await connectDb();
	app.listen(port, () => {
		console.log(`Server is running on port ${port}`);
		console.log(`documentation running on http://localhost:${port}/docs`);
	});
};
startServer();