import {
  SET_CURRENT_USER,
  USER_LOADING
} from "../actions/types";

// Custom isEmpty function to replace the 'is-empty' package
const isEmpty = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof value === "string" && value.trim().length === 0);

// Define the initial state for "auth"
const initialState = {
  isAuthenticated: false,
  user: {},
  loading: false
};

/**
 * Reducer to manage authentication state
 * @param {Object} state - Current state
 * @param {Object} action - Dispatched action
 * @returns {Object} New state
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    case USER_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
