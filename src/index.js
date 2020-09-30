import React from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';
import {App} from './App';
import {Provider} from 'react-redux';
import {configureStore} from "./store";


ReactDOM.render(
  <Provider store={configureStore()}>
    <Router history={appHistory}>
      <Route path="/" component={App}/>
    </Router>
  </Provider>,
  document.getElementById('root')
);
