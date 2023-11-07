// authService/src/graphql/typeDefs.js

const { gql } = require("apollo-server-express");

const typeDefs = gql`

  type User {
    id: ID!
    email: String!
    username: String!
    contacts: [ID]
  }
  
  type SignupPayload {
    token: String!
    user: User!
  }

  type LoginPayload {
    token: String!
    user: User!
  }
  
  type Mutation {
    signUp(
      email: String!
      username: String!
      password: String!
      confirmPassword: String!
    ): SignupPayload!
    login(email: String!, password: String!): LoginPayload!
    changePassword(oldPassword: String!, newPassword: String!): User
  }
`;

module.exports = { typeDefs };
