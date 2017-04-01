// Simple example of a React "smart" component

import { connect } from 'react-redux';
import Sidebar from '../components/Tools/Sidebar';
import { loadArchivedTasks } from '../actions/taskActionCreators';

// Which part of the Redux global state does our component want to receive as props?
const mapStateToProps = (state) => ({
  archivedTasks: state.task.archivedTasks,
  archivedTasksIsLoading: state.task.archivedIsLoading,
  archivedTasksError: state.task.archivedTasksError,
  boardId: state.board.boardDetail && state.board.boardDetail.id,
  boardChannel: state.board.channel,
});

// Don't forget to actually use connect!
// Note that we don't export HelloWorld, but the redux "connected" version of it.
// See https://github.com/reactjs/react-redux/blob/master/docs/api.md#examples
export default connect(mapStateToProps, { loadArchivedTasks })(Sidebar);
