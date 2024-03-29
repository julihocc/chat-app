// frontend/src/redux/slices/userSlice.js
import {createSlice} from "@reduxjs/toolkit";

const initialState = {
	user: null, isLoggedIn: false, loading: false, error: null,
};

const userSlice = createSlice({
	name: "user", initialState, reducers: {
		fetchUserSaga: (state, action) => {
		}, setUser: (state, action) => {
			state.user = action.payload;
			state.isLoggedIn = true; // Mark user as logged in
		}, logoutUser: (state) => {
			state.isLoggedIn = false;
			state.user = null;
		}, fetchUserRequest: (state) => {
			state.loading = true;
		}, fetchUserSuccess: (state, action) => {
			state.loading = false;
			state.user = action.payload;
			state.error = null;
			state.isLoggedIn = true;
		}, fetchUserFailure: (state, action) => {
			state.loading = false;
			state.user = null;
			state.error = action.payload;
			state.isLoggedIn = false;
		}, setUserUsername: (state, action) => {
			state.user.username = action.payload;
		},
	},
});

export const {
	fetchUserSaga, setUser, logoutUser, fetchUserRequest, fetchUserSuccess, fetchUserFailure, setUserUsername,
} = userSlice.actions;

// Exporting the reducer
export default userSlice.reducer;
