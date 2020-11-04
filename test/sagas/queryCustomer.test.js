import {
  query, // the graphQL query itself
  queryCustomer, // the Saga generator function
  reducer
} from '../../src/sagas/queryCustomer';
import {itMaintainsExistingState, itSetsStatus} from "../reducerGenerators";

import {storeSpy, expectRedux} from "expect-redux";
import {configureStore} from "../../src/store";
import {fetchQuery} from 'relay-runtime';
import {getEnvironment} from "../../src/relayEnvironment";
jest.mock('relay-runtime');


describe('reducer', () => {
  it('returns a default state for an undefined existing state', () => {
    expect(reducer(undefined, {})).toEqual({
      customer: {},
      appointments: [],
      status: undefined,
    })
  });

  describe('QUERY_CUSTOMER_SUBMITTING action', () => {
    const action = {type: 'QUERY_CUSTOMER_SUBMITTING'};
    itSetsStatus(reducer, action, 'SUBMITTING');
    itMaintainsExistingState(reducer, action);
  });

  describe('QUERY_CUSTOMER_FAILED action', () => {
    const action = { type: 'QUERY_CUSTOMER_FAILED'};
    itSetsStatus(reducer, action, 'FAILED');
    itMaintainsExistingState(reducer, action);
  });

  describe('QUERY_CUSTOMER_SUCCESSFUL', () => {
    const customer = {id: 123};
    const appointments = [{starts: 123}];
    const action = {
      type: 'QUERY_CUSTOMER_SUCCESSFUL',
      customer,
      appointments,
    };
    itSetsStatus(reducer, action, 'SUCCESSFUL');
    itMaintainsExistingState(reducer, action);
    it('sets received customer and appointments', () => {
      expect(reducer(undefined,action)).toMatchObject({
        customer,
        appointments,
      })
    });
  });
});

describe('queryCustomer', () => { // the saga generator function
  const appointments = [{startsAt: '123'}];
  const customer = {id: 123, appointments};

  let store;

  beforeEach(() => {
    store = configureStore([storeSpy]);
    fetchQuery.mockReturnValue({customer});
  });

  const dispatchRequest = () =>
    store.dispatch({type: 'QUERY_CUSTOMER_REQUEST', id: 123});

  it('calls fetchQuery',async () => {
    dispatchRequest();
    expect(fetchQuery).toHaveBeenCalledWith(
      getEnvironment(),
      query,
      {id: 123},
    )
  });
});