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
} from './sagas/customer';
import {appointmentAdded, customerAdded} from "./sagas/app";
import {reducer as appointmentReducer} from "./reducers/appointment";
import {reducer as customerReducer} from "./reducers/customer";
import {addAppointment} from "./sagas/appointment";
import {searchCustomers} from './sagas/searchCustomers';

import {
  queryCustomer,
  reducer as queryCustomerReducer
} from './sagas/queryCustomer';


function* rootSaga() {
  yield takeLatest('ADD_CUSTOMER_REQUEST', addCustomer);
  yield takeLatest('ADD_CUSTOMER_SUCCESSFUL', customerAdded);
  yield takeLatest('ADD_APPOINTMENT_REQUEST', addAppointment);
  yield takeLatest('ADD_APPOINTMENT_SUCCESSFUL', appointmentAdded);
  yield takeLatest('SEARCH_CUSTOMERS_REQUEST', searchCustomers);
  yield takeLatest('QUERY_CUSTOMER_REQUEST', queryCustomer)
}

export const configureStore = (storeEnhancers = []) => {
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    combineReducers({
      customer: customerReducer,
      appointment: appointmentReducer,
      queryCustomer: queryCustomerReducer
    }),
    compose(
      ...[applyMiddleware(sagaMiddleware), ...storeEnhancers]
    ),
  );

  sagaMiddleware.run(rootSaga);
  return store;
};