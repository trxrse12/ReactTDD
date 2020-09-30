import {
  createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import {takeLatest} from 'redux-saga/effects';
import {
  addCustomer,
  reducer as customerReducer,
} from './sagas/customer';
import createSagaMiddleware from 'redux-saga';

function* rootSaga() {
  yield takeLatest('ADD_CUSTOMER_REQUEST', addCustomer);
}

export const configureStore = (storeEnhancers = []) => {
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    combineReducers({customer: customerReducer}),
    compose(
      ...[applyMiddleware(sagaMiddleware), ...storeEnhancers]
    ),
  );

  sagaMiddleware.run(rootSaga);
  return store;
};