import {useEffect} from "react";
import {useDispatch} from "react-redux";
import gql from "graphql-tag";
import {setUser} from "../redux/slices/userSlice";
import {contactServiceApolloClient} from "../apolloClient";

const GET_CURRENT_USER = gql`
    query GetCurrentUser {
        getCurrentUser {
            id
            email
        }
    }
`;

const useInitializeAuth = () => {
	const dispatch = useDispatch();
	const client = contactServiceApolloClient;

	useEffect(() => {

		client
			.query({
				query: GET_CURRENT_USER, fetchPolicy: "network-only",
			})
			.then(({data}) => {
				dispatch(setUser(data.getCurrentUser));
			})
			.catch((err) => {
				console.error("Error retrieving current user:", err.message);
			});
		// }
	}, [dispatch, client]);
};

export default useInitializeAuth;
