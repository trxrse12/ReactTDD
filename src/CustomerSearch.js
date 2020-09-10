import React, {useEffect, useState, useCallback} from 'react';
import {searchParams} from "./objectToQueryString";

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

const SearchButtons = ({
   handleNext,
   handlePrevious,
   hasPrevious,
   hasNext,
}) => (
  <div className="button-bar">
    <button
      role="button"
      id="previous-page"
      disabled={!hasPrevious}
      onClick={handlePrevious}
    >Previous</button>
    <button
      role="button"
      id="next-page"
      disabled={!hasNext}
      onClick={handleNext}>
      Next
    </button>
  </div>
  );

export const CustomerSearch = ({renderCustomerActions}) => {
  const [lastRowIds, setLastRowIds] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      let after ;
      if (lastRowIds.length > 0 )
        after = lastRowIds[lastRowIds.length-1];
      const queryString = searchParams({after, searchTerm});

      const result = await window.fetch(
        `/customers${queryString}`, {
          method: 'GET',
          credentials: 'same-origin',
          headers: {'Content-Type': 'application/json'}
        });
      setCustomers(await result.json());
    };
    fetchData();
  }, [lastRowIds, searchTerm]);

  const handleNext = useCallback(() => {
    const currentLastRowId = customers[customers.length -1].id;
    setLastRowIds([...lastRowIds, currentLastRowId]);
  }, [customers, lastRowIds]);

  const handlePrevious = useCallback(() =>
      setLastRowIds(lastRowIds.slice(0,-1))
      , [lastRowIds]);

  const handleSearchTextChanged = ({target: {value}}) => {
    setSearchTerm(value);
  };

  const hasPrevious = lastRowIds.length > 0;
  const hasNext = customers.length === 10;

  return (
    <React.Fragment>
      <input
        value={searchTerm}
        onChange={handleSearchTextChanged}
        placeholder="Enter filter text"
      />
      <SearchButtons
        handleNext={handleNext}
        handlePrevious={handlePrevious}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
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
};

CustomerSearch.defaultProps = {
  renderCustomerActions: () => {}
};