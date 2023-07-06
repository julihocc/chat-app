const {
    UserInputError, AuthenticationError
} = require("apollo-server-express");
const Message = require('../../models/Message');
const ChatRoom = require('../../models/ChatRoom');
const User = require('../../models/User');
const ContactRequest = require('../../models/ContactRequest');
const {getUserFromToken} = require('./utils/utils');

const queries = {

    getMessagesByChatRoomId: async (parent, args, context) => {
        const {chatRoomId} = args;
        const messages = await Message.find({chatRoomId});
        if (!messages) {
            throw new UserInputError('Messages not found');
        }
        return messages;
    },

    getChatRooms: async (parent, args, context) => {
        console.log("Calling getChatRooms")
        // console.log('context', context)
        const {token} = context;
        console.log('token', token)

        if (!token) {
            throw new AuthenticationError('You must be logged in');
        }

        const user = await getUserFromToken(token);
        console.log('user', !!user)

        // Check if the user is logged in
        if (!user) {
            throw new AuthenticationError('You must be logged in');
        }

        // Fetch all chat rooms where the user is a participant
        return await ChatRoom.find({participantIds: user.id});
    },

    getCurrentUser: async (parent, args, context) => {
        console.log("Calling getCurrentUser")
        const {token} = context;
        console.log('token', token)

        if (!token) {
            throw new AuthenticationError('You must be logged in');
        }

        const user = await getUserFromToken(token);
        console.log('user', !!user)

        if (!user) {
            throw new AuthenticationError('Invalid token');
        }

        return user;
    },

    getUserById: async (parent, {userId}) => {
        console.log("Calling getUserById", userId);
        const user = User.findById(userId);
        console.log('user', !!user)
        return user;
    },

    getContactRequests: async (_, {userId}, context) => {
        try {
            const contactRequests = await ContactRequest.find({recipientId: userId})
            // .populate('senderId')
            // .populate('recipientId');
            console.log('contactRequests', new Date(), contactRequests)
            return contactRequests;
        } catch (err) {
            console.error("Error loading contact requests: ", err);
            throw new Error('Error fetching contact requests');
        }
    },

    getChatRoom: async (parent, {chatRoomId}, context) => {
        return await ChatRoom.findById(chatRoomId);
    },


    getUserByEmail: async (parent, {email}) => {
        return await User.findOne({email});
    },

    getUsersById: async (parent, {userIds}) => {
        console.log("Calling getUsersById", userIds)
        const users = await User.find({_id: {$in: userIds}});
        console.log('users', !!users)
        return users;
    }
};

module.exports = queries;