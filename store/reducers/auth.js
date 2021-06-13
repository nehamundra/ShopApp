import { LOGIN, LOGOUT } from "../actiions/auth";

const initialState = {
  isUserLoggedIn: false,
  token: null,
  userId: null,
};

const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        token: action.token,
        userId: action.userId,
        isUserLoggedIn: action.validUser,
      };
    case LOGOUT:
      return initialState
  }
  return state;
};

export default AuthReducer;
