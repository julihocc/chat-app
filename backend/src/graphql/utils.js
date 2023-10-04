// backend\src\graphql\resolvers\hooks\hooksHub.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const logger = require('../logger'); // Import the logger
const saltRounds = 10;

const encryptPassword = async (password) => {
    // return await bcrypt.hash(password, saltRounds);
    return password
}

const comparePassword = async (password, hash) => {
    // return await bcrypt.compare(password, hash);
    return password === hash
}

const getUserFromToken = async (token) => {
    const tokenString = token.split(' ')[1];
    try {
        const decoded = jwt.verify(tokenString, process.env.JWT_SECRET);
        return User.findById(decoded.id);
    } catch (err) {
        logger.error("Error in getUserFromToken", err); // Log the error
        throw new Error(err);
    }
};

module.exports = { encryptPassword, comparePassword, getUserFromToken };
