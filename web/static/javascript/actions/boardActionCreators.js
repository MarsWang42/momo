import axios from 'axios';
import { browserHistory } from 'react-router';
import {
  LOAD_BOARD_LIST,
  LOAD_BOARD_LIST_SUCCEED,
  LOAD_BOARD_LIST_FAILED,
  LOAD_BOARD_DETAIL,
  LOAD_BOARD_DETAIL_SUCCEED,
  LOAD_BOARD_DETAIL_FAILED,
  CREATE_BOARD,
  CREATE_BOARD_SUCCEED,
  CREATE_BOARD_FAILED,
  ADD_BOARD_MEMBER,
  ADD_BOARD_MEMBER_SUCCEED,
  ADD_BOARD_MEMBER_FAILED,
  CURRENT_BOARD_CONNECTED_USER,
} from '../constants/boardConstants';
import {
  CREATE_LIST_SUCCEED,
  UPDATE_LIST_SUCCEED,
  ARCHIVE_LIST_SUCCEED,
} from '../constants/listConstants';
import {
  CREATE_TASK_SUCCEED,
  UPDATE_TASK_SUCCEED,
  ARCHIVE_TASK_SUCCEED,
  LOAD_ARCHIVED_TASKS_SUCCEED,
} from '../constants/taskConstants';
import UserHelpers from '../helpers/userHelpers';

export const loadBoardList = () => (
  (dispatch) => {
    dispatch({ type: LOAD_BOARD_LIST });
    axios({
      method: "GET",
      url: "/api/v1/boards",
      headers: UserHelpers.headerWithJWT(),
    }).then((response) => {
      dispatch({
        type: LOAD_BOARD_LIST_SUCCEED,
        data: response.data,
      });
    }).catch((response) => {
      dispatch({
        type: LOAD_BOARD_LIST_FAILED,
        data: response.data,
      });
    });
  }
);

export const loadBoardDetail = (id, socket) => (
  (dispatch) => {
    const channel = socket.channel(`boards:${id}`);

    dispatch({ type: LOAD_BOARD_DETAIL });

    channel.join().receive('ok', (response) => {
      dispatch({
        type: LOAD_BOARD_DETAIL_SUCCEED,
        board: response.board,
        channel,
      });
    }).receive('error', (response) => {
      dispatch({
        type: LOAD_BOARD_DETAIL_FAILED,
        error: response.error,
      });
    });

    channel.on('member:added', (msg) => {
      dispatch({
        type: ADD_BOARD_MEMBER_SUCCEED,
        user: msg.user,
      });
    });

    channel.on('user:joined', (msg) => {
      dispatch({
        type: CURRENT_BOARD_CONNECTED_USER,
        users: msg.users,
      });
    });

    channel.on('user:left', (msg) => {
      dispatch({
        type: CURRENT_BOARD_CONNECTED_USER,
        users: msg.users,
      });
    });

    channel.on('list:created', (msg) => {
      dispatch({
        type: CREATE_LIST_SUCCEED,
        list: msg.list,
      });
    });

    channel.on('list:updated', (msg) => {
      dispatch({
        type: UPDATE_LIST_SUCCEED,
        board: msg.board,
      });
    });

    channel.on('list:archived', (msg) => {
      dispatch({
        type: ARCHIVE_LIST_SUCCEED,
        archivedList: msg.archived_list,
      });
    });

    channel.on('task:created', (msg) => {
      dispatch({
        type: CREATE_TASK_SUCCEED,
        task: msg.task,
      });
    });

    channel.on('task:updated', (msg) => {
      dispatch({
        type: UPDATE_TASK_SUCCEED,
        task: msg.task,
      });
    });

    channel.on('task:archived', (msg) => {
      dispatch({
        type: ARCHIVE_TASK_SUCCEED,
        archivedTask: msg.archived_task,
      });
    });

    channel.on('archived_tasks:fetched', (msg) => {
      dispatch({
        type: LOAD_ARCHIVED_TASKS_SUCCEED,
        archivedTasks: msg.archived_tasks,
      });
    });
  }
);

export const createBoard = (board, hideBoardModal) => (
  (dispatch) => {
    dispatch({ type: CREATE_BOARD });
    axios({
      method: "POST",
      url: "/api/v1/boards",
      headers: UserHelpers.headerWithJWT(),
      data: { board },
    }).then((response) => {
      hideBoardModal();
      dispatch({ type: CREATE_BOARD_SUCCEED });
      dispatch(loadBoardList());
      browserHistory.push('/');
    }).catch((response) => {
      dispatch({
        type: CREATE_BOARD_FAILED,
        data: response.response.data,
      });
    });
  }
);

export const addBoardMember = (channel, email) => (
  (dispatch) => {
    dispatch({ type: ADD_BOARD_MEMBER });
    channel.push('members:add', { email })
    .receive('error', (data) => {
      dispatch({
        type: ADD_BOARD_MEMBER_FAILED,
        error: data.error,
      });
    });
  }
);
