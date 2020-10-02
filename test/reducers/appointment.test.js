import { reducer } from '../../src/reducers/appointment';
import {itMaintainsExistingState} from "../reducerGenerators";

describe('appointment reducer', () => {
  describe('SET_CUSTOMER_FOR_APPOINTMENT action', () => {
    const customer = {id: 123};
    const action = {
      type: 'SET_CUSTOMER_FOR_APPOINTMENT',
      customer,
    };

    itMaintainsExistingState(reducer, action);
    it('sets the customer', () => {
      expect(reducer(undefined, action)).toMatchObject({
        customer,
      })
    });
  });
});