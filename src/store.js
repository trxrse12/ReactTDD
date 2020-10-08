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
import {appointmentAdded, customerAdded} from "./sagas/app";
import {reducer as appointmentReducer} from "./reducers/appointment";
import {addAppointment} from "./sagas/appointment";
import {searchCustomers} from './sagas/searchCustomers';


function* rootSaga() {
  yield takeLatest('ADD_CUSTOMER_REQUEST', addCustomer);
  yield takeLatest('ADD_CUSTOMER_SUCCESSFUL', customerAdded);
  yield takeLatest('ADD_APPOINTMENT_REQUEST', addAppointment);
  yield takeLatest('ADD_APPOINTMENT_SUCCESSFUL', appointmentAdded);
  yield takeLatest('SEARCH_CUSTOMER_REQUEST', searchCustomers);
}

export const configureStore = (storeEnhancers = []) => {
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    combineReducers({
      customer: customerReducer,
      appointment: appointmentReducer,
    }),
    compose(
      ...[applyMiddleware(sagaMiddleware), ...storeEnhancers]
    ),
  );

  sagaMiddleware.run(rootSaga);
  return store;
};