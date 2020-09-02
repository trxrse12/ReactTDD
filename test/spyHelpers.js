// Test helper
export const fetchResponseOk = body => Promise.resolve({
  ok: true,
  json: () => Promise.resolve(body)
});

// Test helper
export const fetchResponseError = (status=500, body={}) =>
  Promise.resolve({
    ok: false,
    status,
    json: () => Promise.resolve(body)
  });


export const requestBodyOf = fetchSpy =>
  JSON.parse(fetchSpy.mock.calls[0][1].body);
