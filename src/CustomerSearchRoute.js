import React from 'react';
import {CustomerSearch} from "./CustomerSearch/CustomerSearch";

const convertParams = url => {
  // a typical url (in my case is props.lcoation.search) will look like
  //    '?=lastRowIds=1%2C2%2C3`
  const params = new URLSearchParams(url);
  const obj = {};
  if (params.has('searchTerm')) {
    obj.searchTerm = params.get('searchTerm');
  }
  if (params.has('limit')) {
    obj.limit = parseInt(params.get('limit'));
  }
  if (params.has('lastRowIds')) {
    obj.lastRowIds = params
      .get('lastRowIds')
      .split(',')
      .filter(id => id !== ''); // removes the empty values
  }
  return obj;
};

export const CustomerSearchRoute = props =>
  (
    <CustomerSearch
      {...props}
      {...convertParams(props.location.search)}
    />
  );