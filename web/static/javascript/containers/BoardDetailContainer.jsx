// Simple example of a React "smart" component

import { connect } from 'react-redux';
import BoardDetail from '../components/Board/BoardDetail';
import { loadBoardDetail, addBoardMember } from '../actions/boardActionCreators';
import { createList, updateList, archiveList } from '../actions/listActionCreators';
import { createTask } from '../actions/taskActionCreators';

// Which part of the Redux global state does our component want to receive as props?
const mapStateToProps = state => ({
  userSocket: state.user.socket,
  isSignedIn: state.user.isSignedIn,
  currentUser: state.user.currentUser,
  lists: state.list.all,
  isLoading: state.board.detailIsLoading,
  loadingError: state.board.detailError,
  boardDetail: state.board.boardDetail,
  isCreatingList: state.list.isCreating,
  creatingListError: state.list.creatingError,
  updatingListError: state.list.updatingError,
  isCreatingTask: state.task.isCreating,
  creatingTaskError: state.task.creatingError,
  boardMembers: state.board.boardDetail && state.board.boardDetail.members,
  isAddingMember: state.board.isAddingMember,
  addingMemberError: state.board.addingMemberError,
  boardChannel: state.board.channel,
  connectedUsers: state.board.connectedUsers,
});

// Don't forget to actually use connect!
// Note that we don't export HelloWorld, but the redux "connected" version of it.
// See https://github.com/reactjs/react-redux/blob/master/docs/api.md#examples
export default connect(mapStateToProps,
  { loadBoardDetail, createList, createTask, updateList, archiveList, addBoardMember }
)(BoardDetail);
