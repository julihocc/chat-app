const logger = require("../../utils/logger");

const login = async (_, {email, password}, context) => {
	logger.debug("login", {email, password});

	const user = await context.dataSources.authAPI.getUserByEmail(email);
	logger.debug(`user: ${JSON.stringify(user)}`);

	if (!user) {
		logger.error(`No user with email: ${email}`);
		throw new Error(`No user with email: ${email}`);
	}

	const match = await context.dataSources.authAPI.getPasswordComparison(password, user.password);
	logger.debug(`match: ${JSON.stringify(match)}`);

	if (!match) {
		logger.error(`Invalid password for email: ${email}`);
		throw new Error("Invalid password");
	}

	const token = await context.dataSources.authAPI.getTokenByPayload(user._id, user.email)
	logger.debug(`token: ${JSON.stringify(token)}`);

	context.res.cookie('authToken', token.token, {
		httpOnly: true,
		maxAge: 3600000,
		sameSite: 'lax'
	});

	return {
		token: token.token,
		user,
	};
};

module.exports = {login};
