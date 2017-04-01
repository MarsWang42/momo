import axios from 'axios';
import {
  LOAD_ALL_LISTS,
  LOAD_ALL_LISTS_SUCCEED,
  LOAD_ALL_LISTS_FAILED,
  CREATE_LIST,
  CREATE_LIST_SUCCEED,
  CREATE_LIST_FAILED,
  UPDATE_LIST,
  UPDATE_LIST_SUCCEED,
  UPDATE_LIST_FAILED,
  ARCHIVE_LIST,
  ARCHIVE_LIST_SUCCEED,
  ARCHIVE_LIST_FAILED,
} from '../constants/listConstants';

export const createList = (list, channel, hideDropdown) => (
  (dispatch) => {
    dispatch({ type: CREATE_LIST });
    hideDropdown();
    channel.push('lists:create', { list })
    .receive('error', (data) => {
      dispatch({
        type: CREATE_LIST_FAILED,
        error: data.error,
      });
    });
  }
);

export const updateList = (list, channel) => (
  (dispatch) => {
    dispatch({ type: UPDATE_LIST });
    channel.push('list:update', { list })
    .receive('error', (data) => {
      dispatch({
        type: UPDATE_LIST_FAILED,
        error: data.error,
      });
    });
  }
);

export const archiveList = (id, channel) => (
  (dispatch) => {
    dispatch({ type: ARCHIVE_LIST });
    channel.push('list:archive', { id })
    .receive('error', (data) => {
      dispatch({
        type: ARCHIVE_LIST_FAILED,
        error: data.error,
      });
    });
  }
);
