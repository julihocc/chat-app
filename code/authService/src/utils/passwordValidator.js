
const validatePassword = (password) => {
	const minLength = 6; // Minimum length of password
	const maxLength = 16; // Maximum length of password

	if (!password || password.length < minLength || password.length > maxLength) {
		return {
			isValid: false,
			message: `Password must be between ${minLength} and ${maxLength} characters.`
		};
	}


	return { isValid: true, message: 'Valid password.' };
};

module.exports = { validatePassword };
