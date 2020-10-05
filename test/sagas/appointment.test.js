import {expectRedux, storeSpy} from 'expect-redux';
import {configureStore} from "../../src/store";
import {fetchResponseError, fetchResponseOk} from "../spyHelpers";
import 'whatwg-fetch';

describe('addAppoitnment saga', () => {
  let renderWithStore, store;
  const appointment = {from: '123', to: '234'};
  const customer={id:123};
  beforeEach(() => {
    jest.spyOn(window, 'fetch')
      .mockReturnValue(fetchResponseOk(customer));
    store = configureStore([storeSpy]);
  });
  
  const dispatchRequest = (appointment, customer) => 
    store.dispatch({
      type: 'ADD_APPOINTMENT_REQUEST',
      appointment,
      customer,
    });

  it('sets current status to submitting', () => {
    dispatchRequest();

    return expectRedux(store)
      .toDispatchAnAction()
      .matching({type: 'ADD_APPOINTMENT_SUBMITTING'})
  });

  it('submits request to the fetch api', async() => {
    dispatchRequest(appointment, customer);

    expect(window.fetch).toHaveBeenCalledWith('/appointments',{
      body: JSON.stringify({appointment, customer}),
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json'},
    })
  });

  it('dispatches ADD_APPOINTMENT_SUCCESSFUL on success', () => {
    dispatchRequest(appointment, customer);
    return expectRedux(store)
      .toDispatchAnAction()
      .matching({type:'ADD_APPOINTMENT_SUCCESSFUL'})
  });

  it('dispatches ADD_APPOINTMENT_FAILED on non-specific error', () => {
    window.fetch.mockReturnValue(fetchResponseError());
    dispatchRequest();
    return expectRedux(store)
      .toDispatchAnAction()
      .matching({type: 'ADD_APPOINTMENT_FAILED'})
  });
});