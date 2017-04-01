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
  USER_BOARD_ADDED,
  CURRENT_BOARD_CONNECTED_USER,
} from '../constants/boardConstants';

const BoardReducer = (state = '', action) => {
  switch (action.type) {
    case LOAD_BOARD_LIST:
      return { ...state,
        isLoading: true,
        ownedBoards: [],
        invitedBoards: [],
        error: null,
      };
    case LOAD_BOARD_LIST_SUCCEED:
      return { ...state,
        isLoading: false,
        ownedBoards: action.data.owned_boards,
        invitedBoards: action.data.invited_boards,
      };
    case LOAD_BOARD_LIST_FAILED:
      return { ...state,
        isLoading: false,
        ownedBoards: [],
        invitedBoards: [],
        error: action.data.error,
      };
    case LOAD_BOARD_DETAIL:
      return { ...state,
        detailIsLoading: true,
        boardDetail: {},
        detailError: null,
      };
    case LOAD_BOARD_DETAIL_SUCCEED:
      return { ...state,
        detailIsLoading: false,
        boardDetail: action.board,
        channel: action.channel,
      };
    case LOAD_BOARD_DETAIL_FAILED:
      return { ...state,
        detailIsLoading: false,
        boardDetail: {},
        detailError: action.error,
      };
    case CREATE_BOARD:
      return { ...state,
        isCreating: true,
        creatingError: null,
      };
    case CREATE_BOARD_SUCCEED:
      return { ...state,
        isCreating: false,
      };
    case CREATE_BOARD_FAILED:
      return { ...state,
        isCreating: false,
        creatingError: action.data.error,
      };
    case ADD_BOARD_MEMBER:
      return { ...state,
        isAddingMember: true,
        addingMemberError: null,
      };
    case ADD_BOARD_MEMBER_SUCCEED:
      const memberAddedBoard = { ...state.boardDetail };
      memberAddedBoard.members.push(action.user);
      return { ...state,
        isAddingMember: false,
        boardDetail: memberAddedBoard,
      };
    case ADD_BOARD_MEMBER_FAILED:
      return { ...state,
        isAddingMember: false,
        addingMemberError: action.error,
      };
    case USER_BOARD_ADDED:
      const addedInvitedBoards = [...state.invitedBoards];
      addedInvitedBoards.push(action.board);
      return { ...state,
        invitedBoards: addedInvitedBoards,
      };
    case CURRENT_BOARD_CONNECTED_USER:
      return { ...state,
        connectedUsers: action.users,
      };
    default:
      return state;
  }
};

export default BoardReducer;
