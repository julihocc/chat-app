import gql from "graphql-tag";

export const GET_CONTACT_REQUESTS = gql`
  query GetContactRequests($userId: ID!) {
    getContactRequests(userId: $userId) {
      id
      senderId
      recipientId
      status
      createdAt
    }
  }
`;
