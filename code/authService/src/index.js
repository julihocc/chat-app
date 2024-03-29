// authService/src/index.js
const express = require("express");
const cookieParser = require("cookie-parser");
const http = require("http");
const rateLimit = require("express-rate-limit");

const connectDB = require("./utils/connectDB");
const errorHandler = require("./utils/errorHandler");
const logger = require("./utils/logger");
const UserController = require('./controllers/UserController');
const PasswordController = require('./controllers/PasswordController');

const PORT = process.env.PORT || 5000;

const app = express();

// Static files
app.use(express.static(__dirname + "/public"));

// Rate limiting
const apiLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour window
	max: 10000, // limit each IP to 100 requests per windowMs
	message: "Too many requests from this IP, please try again after an hour",
});
app.use(apiLimiter);

// Error handling
app.use(errorHandler);

// Cookie parsing
app.use(cookieParser());

app.use(express.json());


app.get('/v1/user', UserController.getUser);
app.post('/v1/user', UserController.createUser);
app.put('/v1/user', UserController.updateUser);
app.get('/v1/contacts', UserController.getContactsByUserId);
app.get('/v1/token', UserController.getTokenByPayload);
app.get('/v1/password', PasswordController.getPassword)
app.put('/v1/password', PasswordController.changePassword);
app.get('/v1/search', UserController.getManyUsersByEmail);

async function startServer() {
	try {
		await connectDB();
		const httpServer = http.createServer(app);
		httpServer.listen(PORT, () => {
			logger.debug(`Server is running at http://localhost:${PORT}`);
		});
	} catch (err) {
		logger.error("Error starting the authentication service:", err);
	}
}

(async () => {
	try {
		await startServer();
	} catch (err) {
		logger.error("Error starting the authentication service:", err);
	}
})();

