// Simple example of a React "smart" component

import { connect } from 'react-redux';
import BoardList from '../components/Board/BoardList';
import * as actions from '../actions/boardActionCreators';

// Which part of the Redux global state does our component want to receive as props?
const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  ownedBoards: state.board.ownedBoards,
  invitedBoards: state.board.invitedBoards,
  isLoading: state.board.isLoading,
  loadingError: state.board.error,
  isCreating: state.board.isCreating,
  creatingError: state.board.creatingError,
});

// Don't forget to actually use connect!
// Note that we don't export HelloWorld, but the redux "connected" version of it.
// See https://github.com/reactjs/react-redux/blob/master/docs/api.md#examples
export default connect(mapStateToProps, actions)(BoardList);
