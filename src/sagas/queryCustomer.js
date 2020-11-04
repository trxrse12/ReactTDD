import { call } from 'redux-saga/effects';
import {fetchQuery, graphql} from 'relay-runtime';
import {getEnvironment} from '../relayEnvironment';

export const query = graphql`
    query queryCustomerQuery($id: ID!) {
        customer(id: $id) {
            id
            firstName
            lastName
            phoneNumber
            appointments {
                startsAt
                stylist
                service
                notes
            }
        }
    }
`;

export function* queryCustomer({id}){
  yield call(fetchQuery, getEnvironment(), query, {id});
}

const defaultState = {
  customer: {},
  appointments: [],
  status: undefined,
};

export const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'QUERY_CUSTOMER_SUBMITTING':
      return {...state, status: 'SUBMITTING'};
    case 'QUERY_CUSTOMER_FAILED':
      return {...state, status: 'FAILED'};
    case 'QUERY_CUSTOMER_SUCCESSFUL':
      return {
        ...state,
        customer: action.customer,
        appointments: action.appointments,
        status: 'SUCCESSFUL',
      }
  }
  return state;
};