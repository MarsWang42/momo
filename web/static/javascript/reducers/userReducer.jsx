import {
  USER_SIGN_OUT_SUCCEED,
  USER_SIGN_IN,
  USER_SIGN_IN_FAILED,
  USER_SIGN_UP,
  USER_SIGN_UP_FAILED,
  GET_CURRENT_USER_SUCCEED,
  GET_CURRENT_USER_FAILED,
  USER_SOCKET_CONNECTED,
} from '../constants/userConstants';

const UserReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_SIGN_OUT_SUCCEED:
      return { ...state,
        isSignedIn: false,
        currentUser: null,
      };
    case USER_SIGN_IN:
      return { ...state,
        signInError: "",
      };
    case USER_SIGN_IN_FAILED:
      return { ...state,
        signInError: action.data.error,
      };
    case USER_SIGN_UP:
      return { ...state,
        signInError: "",
      };
    case USER_SIGN_UP_FAILED:
      return { ...state,
        signUpError: action.data.errors,
      };
    case GET_CURRENT_USER_SUCCEED:
      return { ...state,
        currentUser: {
          firstName: action.user.first_name,
          lastName: action.user.last_name,
          email: action.user.email,
        },
        isCheckedUser: true,
        getUserError: "",
      };
    case GET_CURRENT_USER_FAILED:
      return { ...state,
        isCheckedUser: true,
        getUserError: action.data.error,
      };
    case USER_SOCKET_CONNECTED:
      return { ...state,
        isCheckedUser: true,
        isSignedIn: true,
        socket: action.socket,
        channel: action.channel,
        currentUser: {
          firstName: action.user.first_name,
          lastName: action.user.last_name,
          email: action.user.email,
        },
      };
    default:
      return state;
  }
};

export default UserReducer;
