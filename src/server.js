require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const app = require('./app.js');
const authRouter = require('./module/auth/auth.routes.js');
const profileRouter = require('./module/profile/profile.routes.js');
const securityRouter = require('./module/security/security.routes.js');
const sessionRouter = require('./module/session/session.routes.js');
const storefrontRouter = require('./module/storefront/storefront.routes.js');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./utils/swagger.json');

const connectDb = require('./common/db/connetDb.js');
const productRouter = require('./module/products/product.route.js');

const port = process.env.PORT || 8000;

app.use(
	cors({
		origin: ['http://localhost:5173', 'http://localhost:5174'],
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE' , 'PATCH'],
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

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//routes heer

app.use('/api/v1/security', securityRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/profile', profileRouter);
app.use('/api/v1/security/sessions', sessionRouter);
app.use('/api/v1/storefront', storefrontRouter);
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
