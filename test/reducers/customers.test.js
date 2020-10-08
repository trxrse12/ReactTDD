import {reducer} from "../../src/reducers/customer";
import {itMaintainsExistingState, itSetsStatus} from "../reducerGenerators";

describe('reducer', () => {
  it('returns a default state for an undefined existing state', () => {
    expect(reducer(undefined, {})).toEqual({
      customer: {},
      status: undefined,
      validationErrors: {},
      error: false,
    });
  });

  describe('ADD_CUSTOMER_SUBMITTING action', () => {
    const action = { type: 'ADD_CUSTOMER_SUBMITTING'};
    itSetsStatus(reducer, action, 'SUBMITTING');
    itMaintainsExistingState(reducer, action);
  });

  // similar to the two tests above, but compressed into one
  describe('ADD_CUSTOMER_FAILED action', () => {
    const action = {type: 'ADD_CUSTOMER_FAILED'};
    itSetsStatus(reducer, action, 'FAILED');
    itMaintainsExistingState(reducer, action);
    it('sets error to true', () => {
      expect(reducer(undefined, action)).toMatchObject({
        error: true,
      })
    });
  });

  describe('ADD_CUSTOMER_VALIDATION_FAILED action', () => {
    const validationErrors = {field: 'error text'};
    const action = {
      type: 'ADD_CUSTOMER_VALIDATION_FAILED',
      validationErrors
    };
    itSetsStatus(reducer, action, 'VALIDATION_FAILED');
    itMaintainsExistingState(reducer, action);
    it('sets validation errors to provided errors', () => {
      expect(reducer(undefined, action)).toMatchObject({
        validationErrors
      })
    });
  });

  describe('ADD_CUSTOMER_SUCCESSFUL action', () => {
    const customer={id:123};
    const action = {
      type: 'ADD_CUSTOMER_SUCCESSFUL',
      customer,
    };
    itSetsStatus(reducer, action, 'SUCCESSFUL');
    itMaintainsExistingState(reducer, action);
    it('sets customer to provided customer', () => {
      expect(reducer(undefined, action)).toMatchObject({
        customer
      })
    });
  });

  describe('SEARCH_CUSTOMERS_REQUEST', () => {
    const action = {type: 'SEARCH_CUSTOMERS_REQUEST'};
    itMaintainsExistingState(reducer, action);

    it('resets customers array', () => {
      expect(reducer({ customers: [{}] }, action)).toMatchObject({
        customers: []
      });
    });
  });

  describe('SEARCH_CUSTOMERS_SUCCESSFUL', () => {
    const customers = [{id: '123'}, {id: '234'}];
    const action = {
      type: 'SEARCH_CUSTOMERS_SUCCESSFUL',
      customers,
    };
    itMaintainsExistingState(reducer, action);
    it('sets customers array', () => {
      expect(reducer(undefined, action)).toMatchObject({
        customers,
      })
    });
  });
});