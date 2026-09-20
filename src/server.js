require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const app = require('./app.js');
const authRouter = require('./module/auth/auth.routes.js');
const profileRouter = require('./module/profle/profile.routes.js');
const transactionRouter = require('./module/transaction/transaction.routes.js');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./utils/swagger.json');
const connectDb = require('./common/db/connetDb.js');
const productRouter = require('./module/products/product.route.js');
const { errorMiddleware } = require('./common/middleware/error.middleware.js');

const port = process.env.PORT || 8000;

app.use(
	cors({
		origin: ['http://localhost:5173', 'http://localhost:5174'],
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
	})
);

app.use(express.json());
app.use(
	session({
		name: 'betterAuth_session',
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({
			mongoUrl: process.env.MONGO_URI,
			ttl: 24 * 60 * 60 * 1000, // Session expiration time in seconds (1 day)
		}),
		cookie: {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production' ? true : false, // Set to true if using HTTPS in production
			maxAge: 1000 * 24 * 60 * 60, // Session expires after 1 day
			sameSite: 'lax', // Required for cross-site cookies
			path: '/', // Cookie is valid for the entire site
		},
	})
);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//routes heer
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/profile', profileRouter);
app.use('/api/v1/transactions', transactionRouter);
app.use('/api/v1/product', productRouter);

const startServer = async () => {
	await connectDb();
	app.listen(port, () => {
		console.log(`Server is running on port ${port}`);
		console.log(`dumentation runing on http://localhost:${port}/docs`);
	});
};
startServer();

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ message: 'Internal Server Error' });
});

app.use(errorMiddleware);
