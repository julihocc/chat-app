// authService/src/graphql/typeDefs.js

const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Upload

  type User {
    _id: ID!
    email: String!
    username: String!
  }

  type UserWithChatRoom {
    _id: ID!
    email: String!
    username: String!
    chatRoom: ID!
  }

  type SignupPayload {
    token: String!
    user: User!
  }

  type LoginPayload {
    token: String!
    user: User!
  }

  type LogoutPayload {
    message: String!
  }

  type ChatRoom {
    _id: ID!
    participantIds: [ID!]!
    messageIds: [ID]
    createdAt: String!
  }

  type ChatRoomPopulated {
    _id: ID!
    participantIds: [User!]!
    messageIds: [ID]
    createdAt: String!
  }

  type Message {
    _id: ID!
    senderId: ID!
    body: String
    createdAt: String!
    chatRoomId: ID!
    fileContent: String # Base64 encoded file content
  }

  type MessagePopulated {
    _id: ID!
    senderId: User!
    body: String
    createdAt: String!
    chatRoomId: ID!
    fileContent: String # Base64 encoded file content
  }

  type ContactRequest {
    _id: ID!
    senderId: ID!
    recipientId: ID!
    status: String!
    createdAt: String!
  }

  type ContactRequestPopulated {
    _id: ID!
    senderId: User
    recipientId: ID!
    status: String!
    createdAt: String!
  }

  type Query {
    # authService
    getCurrentUser: User!
    getContactsWithChatRoom: [UserWithChatRoom]
    getUserById(userId: ID!): User
    # chatService
    getChatRoomById(chatRoomId: ID!): ChatRoomPopulated
    getMessagesByChatRoomId(chatRoomId: ID!): [MessagePopulated]
    getChatRoomsForCurrentUser: [ChatRoom]
    # contactService
    getContactRequestsByContext: [ContactRequestPopulated]
    getContactRequests(userId: ID!): [ContactRequest]
    # testing integration
    getUserByEmail(email: String!): User
    getManyUsersByEmail(emails: [String!]!): [User]
  }

  type Mutation {
    # authService
    signUp(
      email: String!
      username: String!
      password: String!
      confirmPassword: String!
    ): SignupPayload!
    login(email: String!, password: String!): LoginPayload!
    changePassword(oldPassword: String!, newPassword: String!): User
    changeUsername(newUsername: String!, currentPassword: String!): User
    logout: LogoutPayload!
    # chatService
    # sendMessage(chatRoomId: ID!, body: String, file: Upload): Message!
    sendMessage(chatRoomId: ID!, body: String, file: String): Message!
    createGroupConversationForCurrentUser(additionalEmails: [String]!): ChatRoom
    # contactService
    sendContactRequest(recipientId: ID!): ContactRequest
    acceptContactRequest(requestId: ID!): ContactRequest
    rejectContactRequest(requestId: ID!): ContactRequest
  }

  type Subscription {
    newMessage: Message!
    newContactRequest: ContactRequest!
    newContact: ContactRequest!
    newChatRoom: ChatRoom!
  }
`;

module.exports = { typeDefs };
