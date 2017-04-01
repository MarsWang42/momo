import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import UserReducer from './userReducer';
import BoardReducer from './boardReducer';
import ListReducer from './listReducer';
import TaskReducer from './taskReducer';

const CombinedReducer = combineReducers({
  user: UserReducer,
  board: BoardReducer,
  list: ListReducer,
  task: TaskReducer,
  routing: routerReducer,
});

export default CombinedReducer;
