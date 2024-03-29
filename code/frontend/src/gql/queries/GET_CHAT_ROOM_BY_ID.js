import gql from "graphql-tag";

export const GET_CHAT_ROOM_BY_ID = gql`
  query GetChatRoomById($chatRoomId: ID!) {
    getChatRoomById(chatRoomId: $chatRoomId) {
      _id
      participantIds {
        username
      }
      messageIds
      createdAt
    }
  }
`;
