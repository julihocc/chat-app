// frontend/src/reducers.js
// Importing the SET_USER action type and the logger utility
import logger from './utils/logger';
import {LOGIN_USER, LOGOUT_USER, SET_USER} from './actions';

// Defining the initial state of the user portion of the Redux store
// Initially, the user is set to null
const initialState = {
    user: null,
    isLoggedIn: false // Add isLoggedIn to the initial state
};

// Defining the userReducer function to handle user-related actions
// It takes the current state and an action as parameters
const userReducer = (state = initialState, action) => {
    // Logging the received action type and payload for debugging
    logger.debug('Action received in userReducer:', action.type);
    logger.debug('Action payload:', action.payload);

    // Using a switch statement to handle different action types
    switch (action.type) {
        // Handling the SET_USER action type
        case SET_USER:
            // Logging the current state and the new user for debugging
            logger.debug('Current state:', state);
            logger.debug('New user:', action.payload);

            // Returning a new state object with the user property updated to the action's payload
            // Using the spread operator to include the rest of the state properties
            return {...state, user: action.payload, isLoggedIn: true};
        case LOGIN_USER:
            return {...state, isLoggedIn: true};
        case LOGOUT_USER:
            return {...state, isLoggedIn: false, user: null};
        // Handling any other action types
        default:
            // Logging that the action type was not handled by this reducer
            logger.debug('Unhandled action type in userReducer:', action.type);

            // Returning the current state unchanged
            return state;
    }
};

// Exporting the userReducer function to be used elsewhere in the application
export default userReducer;
