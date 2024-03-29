import {useMutation} from "@apollo/react-hooks";
import logger from "../../utils/logger";
import {LOGIN_USER} from "../../gql/mutations/LOGIN_USER";

export const useLoginUser = () => {

	const [loginUser, {loading, error, data}] = useMutation(LOGIN_USER, {
		onError(err) {
			logger.error("Login Error:", err.message);
		}, onCompleted(data) {
			logger.debug("Login successful. Setting user in Redux store.");
			document.cookie = `token=${data.login.token}; path=/; max-age=3600; SameSite=Lax`;
			logger.debug("document.cookie", document.cookie);
		},
	});

	return {loginUser, loading, error, data};
}