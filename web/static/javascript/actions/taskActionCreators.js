import {
  LOAD_ARCHIVED_TASKS,
  LOAD_ARCHIVED_TASKS_FAILED,
  CREATE_TASK,
  CREATE_TASK_FAILED,
  UPDATE_TASK,
  UPDATE_TASK_FAILED,
  ARCHIVE_TASK,
  ARCHIVE_TASK_FAILED,
  SET_CURRENT_TASK,
} from '../constants/taskConstants';

export const loadArchivedTasks = channel => (
  (dispatch) => {
    dispatch({ type: LOAD_ARCHIVED_TASKS });
    channel.push('archived_tasks:fetch', {})
    .receive('error', (data) => {
      dispatch({
        type: LOAD_ARCHIVED_TASKS_FAILED,
        error: data.error,
      });
    });
  }
);

export const updateTask = (task, channel) => (
  (dispatch) => {
    dispatch({ type: UPDATE_TASK });
    channel.push('task:update', { task })
    .receive('error', (data) => {
      dispatch({
        type: UPDATE_TASK_FAILED,
        error: data.error,
      });
    });
  }
);

export const createTask = ({ title }, listId, channel, hideDropdown) => (
  (dispatch) => {
    hideDropdown();
    dispatch({ type: CREATE_TASK });
    channel.push('tasks:create', { task: { title, list_id: listId } })
    .receive('error', (data) => {
      dispatch({
        type: CREATE_TASK_FAILED,
        error: data.error,
      });
    });
  }
);

export const setCurrentTask = task => (
  (dispatch) => {
    dispatch({
      type: SET_CURRENT_TASK,
      task,
    });
  }
);

export const archiveTask = (id, channel) => (
  (dispatch) => {
    dispatch({ type: ARCHIVE_TASK });
    channel.push('task:archive', { id })
    .receive('error', (data) => {
      dispatch({
        type: ARCHIVE_TASK_FAILED,
        error: data.error,
      });
    });
  }
);
