// Path: backend\src\graphql\resolvers.js
// Define the resolvers for the GraphQL schema

const subscriptions = require('./subscriptions');
const { GraphQLUpload } = require('graphql-upload');
// Mutations
const { acceptContactRequest } = require("./mutations/acceptContactRequest");
const { createChatRoom } = require("./mutations/createChatRoom");
const { createGroupConversation } = require("./mutations/createGroupConversation");
const { login } = require("./mutations/login");
const { rejectContactRequest } = require("./mutations/rejectContactRequest");
const { s3 } = require("./mutations/s3");
const { sendContactRequest } = require("./mutations/sendContactRequest");
const { signUp } = require("./mutations/signUp");
const { sendMessage } = require("./mutations/sendMessage");
// Queries
const  { getChatRoomById } = require("./queries/getChatRoomById");
const { getChatRooms } = require("./queries/getChatRooms");
const { getChatRoomUsers } = require("./queries/getChatRoomUsers");
const { getContactRequests } = require("./queries/getContactRequests");
const { getContactRequestsByContext } = require("./queries/getContactRequestsByContext");
const { getContacts } = require("./queries/getContacts");
const { getContactsWithFullDetails } = require("./queries/getContactsWithFullDetails");
const { getCurrentUser } = require("./queries/getCurrentUser");
const { getMessagesByChatRoomId } = require("./queries/getMessagesByChatRoomId");
const { getUserByEmail } = require("./queries/getUserByEmail");
const { getUserById } = require("./queries/getUserById");
const { getUsersById } = require("./queries/getUsersById");
const { getChatRoomsForCurrentUser } = require("./queries/getChatRoomsForCurrentUser");


const resolvers = {
    Upload: GraphQLUpload,
    Subscription: subscriptions,
    Mutation: {
        acceptContactRequest,
        createChatRoom,
        createGroupConversation,
        login,
        rejectContactRequest,
        sendContactRequest,
        signUp,
        sendMessage
    },
    Query: {
        getChatRoomById,
        getChatRooms,
        getChatRoomUsers,
        getContactRequests,
        getContactRequestsByContext,
        getContacts,
        getContactsWithFullDetails,
        getCurrentUser,
        getMessagesByChatRoomId,
        getUserByEmail,
        getUserById,
        getUsersById,
        getChatRoomsForCurrentUser
    }
};

module.exports = resolvers;
