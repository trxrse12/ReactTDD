import {put, call} from 'redux-saga/effects';
import {objectToQueryString} from "../objectToQueryString";

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
  let after;
  if (lastRowIds.length > 0 )
        after = lastRowIds[lastRowIds.length-1];
  const queryString = objectToQueryString({
    after,
    searchTerm,
    limit: limit === 10 ? '' : limit,
  });
  const result = yield call(fetch, `/customers${queryString}`);
  const customers = yield call([result, 'json']);
  yield put({
    type: 'SEARCH_CUSTOMER_SUCCESSFUL',
    customers,
  })
}