// frontend/src/components/Login.js
import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {useApolloClient} from "@apollo/client";
import {useNavigate} from "react-router-dom";
import {Alert, Button, TextField} from "@mui/material";
import {useTranslation} from "react-i18next";
import logger from "../utils/logger";
import {setUser} from "../redux/slices/userSlice";
import isEmail from "validator/lib/isEmail";
import {useLoginUser} from "../hooks/mutations/useLoginUser";
import {GET_CURRENT_USER} from "../gql/queries/GET_CURRENT_USER";


const Login = () => {
	const navigate = useNavigate();
	const client = useApolloClient();
	const dispatch = useDispatch();
	const {t} = useTranslation();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");


	const {loginUser, loading, error, data} = useLoginUser();
	const handleSubmit = async (e) => {
		e.preventDefault();
		logger.debug("Handling form submit");

		if (!isEmail(email)) {
			setErrorMessage(t("invalidEmail"));
			return;
		}

		if (email === "" || password === "") {
			setErrorMessage(t("bothFieldsRequired"));
			return;
		}

		try {
			logger.debug("Attempting login with email:", email);
			await loginUser({variables: {email, password}});
		} catch (err) {
			logger.error("Login attempt failed:", err);
		}
	};


	useEffect(() => {


		if (error) {
			logger.error("Login error:", error);
			setErrorMessage(error.message)
		}

		if (data) {
			logger.debug("Login data:", data);
			setErrorMessage("");
			dispatch(setUser(data.login.user));

			client
				.query({
					query: GET_CURRENT_USER, fetchPolicy: "network-only",
				})
				.then(({data}) => {
					logger.debug("client.query data", data);
					logger.debug("client.query data.getCurrentUser", data.getCurrentUser,);
					logger.debug("client.query data.getCurrentUser.chatRoomId", data.getCurrentUser.id,);
				}, (err) => {
					logger.error("client.query Error:", err.message);
				},)
				.catch((err) => {
					logger.error("client.query Error:", err.message);
				});

			logger.debug("Navigating to dashboard");
			navigate("/dashboard");

		}
	}, [error, data, dispatch, client, navigate, t])


	if (loading) {
		return <div>Loading...</div>;
	}


	return (<div>
			<h2>{t("login")}</h2>
			<form onSubmit={handleSubmit}>

				<TextField
					type="email"
					label={t("email")}
					value={email}
					onChange={(e) => {
						setEmail(e.target.value);
						setErrorMessage("");
					}}
				/>

				<TextField
					type="password"
					label={t("password")}
					value={password}
					onChange={(e) => {
						setPassword(e.target.value);
						setErrorMessage("");
					}}
				/>

				<Button type="submit" variant="contained" color="primary">
					{t("login")}
				</Button>
			</form>
			{errorMessage && (<Alert severity="error" style={{marginTop: '120px'}}>
					{errorMessage}
				</Alert>)}
		</div>);
};

export default Login;
