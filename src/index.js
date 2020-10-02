import React from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';
import {App} from './App';
import {Provider} from 'react-redux';
import {configureStore} from "./store";
import {ConnectedApp} from "./App";

import { Router, Route } from 'react-router';

ReactDOM.render(
  <Provider store={configureStore()}>
    <Router history={appHistory}>
      <Route path="/" component={ConnectedApp}/>
    </Router>
  </Provider>,
  document.getElementById('root')
);
