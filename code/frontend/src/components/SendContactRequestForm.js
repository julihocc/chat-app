// path: frontend/src/components/SendContactRequestForm.js
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useGetCurrentUser } from "../hooks/queries/useGetCurrentUser";
import { useSendContactRequest } from "../hooks/mutations/useSendContactRequest";
import { useGetUserByEmail } from "../hooks/queries/useGetUserByEmail";
import logger from "../utils/logger";

const SendContactRequestForm = () => {
  const { t } = useTranslation();
  const [recipientEmail, setRecipientEmail] = useState("");
  const [error, setError] = useState(null);

  const {
    data: currentUserData,
    loading: currentUserLoading,
    error: currentUserError,
  } = useGetCurrentUser();

  logger.debug(
    `SendContactRequestForm | currentUserData: ${JSON.stringify(
      currentUserData
    )}`
  );

  const {
    sendContactRequest,
    loading: sendContactLoading,
    error: sendContactError,
  } = useSendContactRequest();

  const {
    getUserByEmail,
    loading: getUserByEmailLoading,
    error: getUserByEmailError,
    data: getUserByEmailData,
  } = useGetUserByEmail();


  useEffect(() => {
    logger.debug(`getUserByEmailError: ${getUserByEmailError}`);
    if (getUserByEmailError) {
      setError(getUserByEmailError.message);
    }
  }, [getUserByEmailError]);

  useEffect(() => {
    logger.debug(`sendContactError: ${sendContactError}`);
    if (sendContactError) {
      setError(sendContactError.message);
    }
  }, [sendContactError]);


  useEffect(() => {
    logger.debug(
      `SendContactRequestForm | useEffect | getUserByEmailData: ${JSON.stringify(
        getUserByEmailData
      )}`
    );
    logger.debug(
      `SendContactRequestForm | useEffect | currentUserData: ${JSON.stringify(
        currentUserData
      )}`
    );
    let senderId = null;
    let recipientId = null;
    if (currentUserData?.getCurrentUser?._id) {
      senderId = currentUserData.getCurrentUser._id;
      logger.debug(`senderId: ${senderId}`);
    }
    if (getUserByEmailData?.getUserByEmail?._id) {
      recipientId = getUserByEmailData.getUserByEmail._id;
      logger.debug(`recipientId: ${recipientId}`);
    }
    if (senderId && recipientId) {
      sendContactRequest({
        variables: {
          senderId,
          recipientId,
        },
      });
    }

  }, [
    getUserByEmailData,
    // currentUserData?.getCurrentUser?._id,
    currentUserData,
    sendContactRequest,
  ]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    logger.debug(`Sending contact request to ${recipientEmail}...`);
    
    if (!recipientEmail) {
      setError("Please enter a valid email address.");
      return;
    }

    if (recipientEmail === currentUserData.getCurrentUser.email) {
      setError("You cannot send a contact request to yourself.");
      return;
    }

    try {
      const user = await getUserByEmail({ variables: { email: recipientEmail } });
      logger.debug(
        `Sending contact request to ${user?.data?.getUserByEmail?._id}...`
      );
    } catch (err) {
      logger.error(err);
      setError("User with this email does not exist.");
    }
  };

  if (currentUserLoading || getUserByEmailLoading) return <CircularProgress />;
  if (currentUserError) return <p>Error: {currentUserError.message}</p>;


  return (
    <div>
      <Typography variant="h3">{t("sendContactRequest")}</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          type="email"
          label={t("email")}
          placeholder={t("enterEmail")}
          variant="outlined"
          value={recipientEmail}
          onChange={(e) => {
            const providedEmail = e.target.value;
            logger.debug(`providedEmail: ${providedEmail}`);
            setRecipientEmail(providedEmail)
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={sendContactLoading}
        >
          {sendContactLoading ? t("sending") : t("send")}
        </Button>
      </form>
      {/* {userError && <p>{userError}</p>} */}
      {error && (
        <Alert severity="warning" onClose={() => {setError("")}}>
          {error}
        </Alert>
      )}
      {/* {sendContactError && <p>Error: {sendContactError.message}</p>} */}

    </div>
  );
};

export default SendContactRequestForm;
