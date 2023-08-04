// path: backend\src\graphql\resolvers\mutations\sendContactRequest.js
const User = require("../../models/UserModel");
const ContactRequest = require("../../models/ContactRequestModel");
const logger = require('../../logger');

const sendContactRequest = async (parent, {senderId, recipientId}) => {
    const sender = await User.findById(senderId);
    const recipient = await User.findById(recipientId);

    if (!sender) {
        throw new Error(`Sender not found: ${senderId}`);
    }

    if (!recipient) {
        throw new Error(`Recipient not found: ${recipientId}`);
    }

    try {
        const contactRequest = new ContactRequest({
            senderId: sender.id,
            recipientId: recipient.id,
            status: 'pending'
        });

        await contactRequest.save();

        //logger.info(`Contact request sent from ${senderId} to ${recipientId}`); // log the info

        return contactRequest;
    } catch (err) {
        logger.error(); // log the error
        throw new Error(`Failed to send contact request from ${senderId} to ${recipientId}: ${err}`);
    }
};

module.exports = {sendContactRequest};