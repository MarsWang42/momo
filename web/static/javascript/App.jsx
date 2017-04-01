import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import CombinedReducer from './reducers/combinedReducer';
import App from './containers/AppContainer';
import BoardList from './containers/BoardListContainer';
import BoardDetail from './containers/BoardDetailContainer';

const onChangeRoute = (previousRoute, nextRoute) => {
  const pathRegex = /^board/;
  if (nextRoute.location.pathname.match(pathRegex)) {
    document.body.className = "red-gradient-background";
  } else document.body.className = "body-background";
};

const store =  createStore(CombinedReducer, applyMiddleware(thunk));
const history = syncHistoryWithStore(browserHistory, store);

const WrappedApp = () => {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={App} onChange={onChangeRoute}>
          <IndexRoute component={BoardList} />
          <Route path="board/:id" component={BoardDetail} />
        </Route>
      </Router>
    </Provider>
  );
};

ReactDOM.render(<WrappedApp />, document.getElementById('app-container'));
