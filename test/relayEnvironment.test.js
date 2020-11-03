import 'whatwg-fetch';
import { fetchResponseOk, fetchResponseError } from "./spyHelpers";
import { performFetch } from '../src/relayEnvironment';

describe('performFetch', () => {
  let response = { data: {id: 123}};
  const text = 'test';
  const variables = {a:123};

  beforeEach(() => {
    jest
      .spyOn(window, 'fetch')
      .mockReturnValue(fetchResponseOk(response));
  });

  it('calls window fetch', () => {
    performFetch({text}, variables);
    expect(window.fetch).toHaveBeenCalledWith('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: text,
        variables
      })
    })
  });
});