import React, {useEffect, useState, useCallback} from 'react';
import {objectToQueryString} from "../objectToQueryString";
import {SearchButtons} from "./SearchButtons";
import { connect } from 'react-redux';

const CustomerRow = ({customer, renderCustomerActions}) => {
  return (
    <tr>
      <td>{customer.firstName}</td>
      <td>{customer.lastName}</td>
      <td>{customer.phoneNumber}</td>
      <td>{renderCustomerActions(customer)}</td>
    </tr>
  );
};

const mapDispatchToProps = {
  searchCustomers: (lastRowIds, searchTerm, limit) => ({
    type: 'SEARCH_CUSTOMERS_REQUEST',
    lastRowIds,
    searchTerm,
    limit
  })
};

export const CustomerSearch = connect(
  null,
  mapDispatchToProps
)(
  ({
     renderCustomerActions,
     lastRowIds,
     searchTerm,
     limit,
     history,
     location,
     searchCustomers,
   }) => {
    const [customers, setCustomers] = useState([]);

    const handleSearchTextChanged = ({target: {value}}) => {
      const params = {limit, searchTerm: value};
      history.push(location.pathname + objectToQueryString(params));
    };

    useEffect(() => {
      searchCustomers(lastRowIds, searchTerm, limit)
    }, [lastRowIds, searchTerm, limit]);

    return (
      <React.Fragment>
        <input
          value={searchTerm}
          onChange={handleSearchTextChanged}
          placeholder="Enter filter text"
        />
        <SearchButtons
          customers={customers}
          searchTerm={searchTerm}
          limit={limit}
          lastRowIds={lastRowIds}
          pathname={location.pathname}
        />
        <table>
          <thead>
          <tr>
            <th>First name</th>
            <th>Last name</th>
            <th>Phone number</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {customers.map(customer => (
              <CustomerRow
                customer={customer}
                key={customer.id}
                renderCustomerActions={renderCustomerActions}
              />
            )
          )}
          </tbody>
        </table>
      </React.Fragment>
    )
  }
)

CustomerSearch.defaultProps = {
  renderCustomerActions: () => {},
  searchTerm: '',
  lastRowIds: []
};