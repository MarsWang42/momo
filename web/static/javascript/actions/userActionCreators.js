import axios from 'axios';
import { Socket } from 'phoenix';
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
import {
  USER_BOARD_ADDED,
} from '../constants/boardConstants';
import UserHelpers from '../helpers/userHelpers';

export const logoutUser = csrfToken => (
  (dispatch) => {
    axios({
      method: "DELETE",
      url: "/api/v1/sessions",
      headers: UserHelpers.headerWithJWT(),
    }).then((respond) => {
      localStorage.removeItem('phoenixAuthToken');
      dispatch({
        type: USER_SIGN_OUT_SUCCEED,
      });
    });
  }
);

export const connectUserSocket = user => (
  (dispatch) => {
    const socket = new Socket('/socket', {
      params: { token: localStorage.getItem('phoenixAuthToken') },
    });

    socket.connect();

    const channel = socket.channel(`users:${user.id}`);

    channel.join().receive('ok', () => {
      dispatch({
        type: USER_SOCKET_CONNECTED,
        socket,
        channel,
        user,
      });
    });

    channel.on('boards:add', (msg) => {
      dispatch({
        type: USER_BOARD_ADDED,
        board: msg.board,
      });
    });
  }
);

export const loginUser = ({ email, password }, hideSignInModal) => (
  (dispatch) => {
    dispatch({ type: USER_SIGN_IN });
    axios({
      method: "post",
      url: "/api/v1/sessions",
      data: {
        session: {
          email,
          password,
        },
      },
    }).then(({ data }) => {
      localStorage.setItem('phoenixAuthToken', data.jwt);
      hideSignInModal();
      dispatch(connectUserSocket(data.user));
    }).catch((error) => {
      dispatch({
        type: USER_SIGN_IN_FAILED,
        data: error.response.data,
      });
    });
  }
);

export const registerUser = (user, hideSignUpModal) => (
  (dispatch) => {
    dispatch({ type: USER_SIGN_UP });
    axios({
      method: "post",
      url: "/api/v1/registrations",
      data: {
        user,
      },
    }).then(({ data }) => {
      localStorage.setItem('phoenixAuthToken', data.jwt);
      hideSignUpModal();
      dispatch(connectUserSocket(data.user));
    }).catch((error) => {
      dispatch({
        type: USER_SIGN_UP_FAILED,
        data: error.response.data,
      });
    });
  }
);

export const getCurrentUser = () => (
  (dispatch) => {
    axios({
      method: "GET",
      url: "/api/v1/current_user",
      headers: UserHelpers.headerWithJWT(),
    }).then(({ data }) => {
      dispatch(connectUserSocket(data));
    }).catch((error) => {
      dispatch({
        type: GET_CURRENT_USER_FAILED,
        data: error.response.data,
      });
    });
  }
);
