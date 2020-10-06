import {put} from 'redux-saga/effects';
import {appHistory} from "../history";

export function* customerAdded({customer}) {
  appHistory.push('/addAppointment');
  yield put({
    type: 'SET_CUSTOMER_FOR_APPOINTMENT',
    customer
    })
}

export function* appointmentAdded(){
  appHistory.push('/');
}