import {put, call} from 'redux-saga/effects';

const fetch = (url, data) =>
  window.fetch(url, {
    body: JSON.stringify(data),
    method: 'POST',
    credentials: 'same-origin',
    headers: {'Content-Type': 'application/json'},
  });

export function* searchCustomers({
  lastRowIds,
  searchTerm,
  limit,
}) {
  yield call(fetch, '/customer');
}