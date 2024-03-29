// path: frontend/src/components/ChatRoomViewer.js
// Importing dependencies and components
import {
  Alert,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "./Loading";
import useGetMessagesByChatRoomId from "../hooks/queries/useGetMessagesByChatRoomId";
import { useTranslation } from "react-i18next";
import { useGetChatRoomById } from "../hooks/queries/useGetChatRoomById";
import { useDispatch, useSelector } from "react-redux";
import { initiateFetchCurrentUser } from "../redux/actions";
import logger from "../utils/logger";
import { Gravatar } from "./Gravatar";
import { useSendMessage } from "../hooks/mutations/useSendMessage";

const ChatRoomViewer = () => {
  const { t } = useTranslation();
  const { chatRoomId } = useParams();
  const chatRoom = useGetChatRoomById(chatRoomId);
  const { messageData, messageLoading, messageError } =
    useGetMessagesByChatRoomId(chatRoomId);
  const [messageBody, setMessageBody] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [messages, setMessages] = useState([]);
  const { useSubscription } = require("@apollo/client");
  const { NEW_MESSAGE } = require("../gql/subscriptions/NEW_MESSAGE");

  const {
    sendMessageMutation,
    error: sendMessageError,
    loading: sendMessageLoading,
  } = useSendMessage(chatRoomId);

  const {
    data: newMessageData,
    error: newMessageError,
    loading: newMessageLoading,
  } = useSubscription(NEW_MESSAGE);

  const isLoading = chatRoom.loading || messageLoading || sendMessageLoading;
  const handleFileChange = (e) => {
    logger.debug(`File changed: ${e.target.files[0].name}`);
    setFileName(e.target.files[0].name);
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFile(reader.result); // Set the Base64 string to the state
        logger.debug(`File: ${JSON.stringify(file)}`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    await sendMessageMutation({
      variables: {
        chatRoomId: chatRoomId,
        body: messageBody,
        file: file, // This is now a Base64 string
      },
    });
    setMessageBody("");
    setFileName("Upload File");
  };

  useEffect(() => {
    logger.debug(`Messages: ${JSON.stringify(messages)}`);
  }, [messages]);

  useEffect(() => {
    logger.debug("Messages from server:", messageData?.getMessagesByChatRoomId);
    setMessages(messageData?.getMessagesByChatRoomId);
  }, [messageData]);

  useEffect(() => {
    if (newMessageError) {
      logger.error(`New message error: ${newMessageError}`);
    }

    if (newMessageLoading) {
      logger.debug(`New message loading: ${newMessageLoading}`);
    }

    if (newMessageData) {
      logger.debug(`New message data: ${newMessageData}`);
    }

    if (newMessageData?.newMessage) {
      logger.debug("New message from subscription:", newMessageData.newMessage);
      setMessages((prev) => [...prev, newMessageData.newMessage]);
    }
  }, [newMessageData, newMessageError, newMessageLoading]);

  const dispatch = useDispatch();

  const { loading, user, error, isLoggedIn } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (isLoggedIn) {
      // Use the new action creator
      dispatch(initiateFetchCurrentUser());
    }
  }, [dispatch, isLoggedIn]);

  if (loading) return <CircularProgress />;

  if (error) {
    logger.error(`GET_CURRENT_USER Error: ${error}`);
    return <Alert severity="error">{t("An error occurred")}</Alert>;
  }

  if (isLoggedIn && !user) {
    return <div>Loading user data...</div>; // This could also be a spinner
  }

  if (!isLoggedIn) {
    return <div>Please log in.</div>;
  }

  const currentUserId = user._id;

  if (!currentUserId)
    return (
      <Typography variant="h4">Please log in to view the chat room</Typography>
    );
  if (isLoading) return <Loading queryName="Loading" />;

  if (chatRoom.error)
    return <p>Chat Room Error: {JSON.stringify(chatRoom.error)}</p>;
  if (messageError) return <p>Message Error: {JSON.stringify(messageError)}</p>;
  if (sendMessageError)
    return <p>Send Message Error: {JSON.stringify(sendMessageError)}</p>;

  return (
    <Container
      component={Paper}
      // sx={{
      //   height: "110vh",
      //   mt: 2,
      //   display: "flex",
      //   flexDirection: "column",
      //   p: 2,
      // }}
    >
      <CssBaseline />
      <Typography variant="h2" sx={{ mb: 2 }}>
        {t("messages")}
      </Typography>
      <Typography variant="h3" sx={{ mb: 2 }}>
        {/* {t("chatRoom")}: {Date(Number(chatRoom.data.getChatRoomById.createdAt))} */}
        {t("chatRoom")}: {chatRoom.data.getChatRoomById._id}
      </Typography>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {t("participants")}:{" "}
        {chatRoom.data.getChatRoomById.participantIds
          .map((participant) => participant.username)
          .join(", ")}
      </Typography>
      <List>
        {newMessageData && (
          <Alert
            severity="info"
            onClose={() => {
              setMessageBody("");
            }}
          >
            New message: {newMessageData.newMessage.body}
          </Alert>
        )}

        {messages &&
          messages
            .slice(-10)
            .reverse()
            .map((message, index) => (
              <ListItem
                key={index}
                sx={{
                  flexDirection:
                    message.senderId._id === currentUserId
                      ? "row-reverse"
                      : "row",
                }}
              >
                <ListItemAvatar>
                  <Gravatar email={message.senderId.email} />
                </ListItemAvatar>
                <ListItemText
                  primary={message.body}
                  secondary={message.senderId.username}
                  sx={{
                    textAlign:
                      message.senderId._id === currentUserId ? "right" : "left",
                  }}
                />
                {message.fileContent && ( // Assuming the file is an image, render it as an image tag
                  <img
                    src={`data:${message.mimeType};base64,${message.fileContent}`}
                    alt="Uploaded content"
                  />
                  // For other file types, you can create a download link with the appropriate MIME type
                )}
              </ListItem>
            ))}
      </List>
      <form onSubmit={(e) => handleSendMessage(e, currentUserId, chatRoomId)}>
        <Stack direction="row" spacing={1}>
          <TextField
            type="body"
            label={t("newMessage")}
            fullWidth
            value={messageBody}
            onChange={(e) => setMessageBody(e.target.value)}
          />
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="inputForFile"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="inputForFile">
            <Button variant="contained" component="span">
              {file ? fileName : "Upload File"}
            </Button>
          </label>
          <Button type="submit" variant="contained" color="primary">
            {t("sendMessage")}
          </Button>
        </Stack>
      </form>
    </Container>
  );
};

export default ChatRoomViewer;
