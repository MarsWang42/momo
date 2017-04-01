import {
  CREATE_TASK,
  CREATE_TASK_SUCCEED,
  CREATE_TASK_FAILED,
  UPDATE_TASK,
  UPDATE_TASK_SUCCEED,
  UPDATE_TASK_FAILED,
  LOAD_ARCHIVED_TASKS,
  LOAD_ARCHIVED_TASKS_SUCCEED,
  LOAD_ARCHIVED_TASKS_FAILED,
  ARCHIVE_TASK,
  ARCHIVE_TASK_SUCCEED,
  ARCHIVE_TASK_FAILED,
  SET_CURRENT_TASK,
} from '../constants/taskConstants';


const TaskReducer = (state = '', action) => {
  switch (action.type) {
    case CREATE_TASK:
      return { ...state,
        isCreating: true,
        creatingError: null,
      };
    case CREATE_TASK_SUCCEED:
      return { ...state,
        isCreating: false,
      };
    case CREATE_TASK_FAILED:
      return { ...state,
        isCreating: false,
        creatingError: action.data.error,
      };
    case UPDATE_TASK:
      return { ...state,
        isUpdating: true,
        updatingError: null,
      };
    case UPDATE_TASK_SUCCEED:
      return { ...state,
        isUpdating: false,
        taskDetail: action.task,
      };
    case UPDATE_TASK_FAILED:
      return { ...state,
        isUpdating: false,
        updatingError: action.error,
      };
    case LOAD_ARCHIVED_TASKS:
      return { ...state,
        archivedIsLoading: true,
        archivedTasks: {},
        archivedError: null,
      };
    case LOAD_ARCHIVED_TASKS_SUCCEED:
      return { ...state,
        archivedIsLoading: false,
        archivedTasks: action.archivedTasks,
      };
    case LOAD_ARCHIVED_TASKS_FAILED:
      return { ...state,
        archivedIsLoading: false,
        archivedTasks: {},
        detailError: action.error,
      };
    case ARCHIVE_TASK:
      return { ...state,
        isArchiving: true,
        archivingError: null,
      };
    case ARCHIVE_TASK_SUCCEED:
      return { ...state,
        isArchiving: false,
      };
    case ARCHIVE_TASK_FAILED:
      return { ...state,
        isArchiving: false,
        archivingError: action.data.error,
      };
    case SET_CURRENT_TASK:
      return { ...state,
        taskDetail: action.task,
      };
    default:
      return state;
  }
};

export default TaskReducer;
