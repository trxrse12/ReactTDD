import {
  createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import {takeLatest} from 'redux-saga/effects';
import createSagaMiddleware from 'redux-saga';
import {
  addCustomer,
  reducer as customerReducer,
} from './sagas/customer';
// import {reducer as appointmentReducer} from "./reducers/appointment";


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