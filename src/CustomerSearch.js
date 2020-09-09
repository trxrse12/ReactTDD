import React, {useEffect, useState, useCallback} from 'react';

const CustomerRow = ({customer}) => (
  <tr>
    <td>{customer.firstName}</td>
    <td>{customer.lastName}</td>
    <td>{customer.phoneNumber}</td>
  </tr>
);

const SearchButtons = ({handleNext, handlePrevious}) => (
  <div className="button-bar">
    <button
      role="button"
      id="previous-page"
      onClick={handlePrevious}
    >Previous</button>
    <button
      role="button"
      id="next-page"
      onClick={handleNext}>
      Next
    </button>
  </div>
  );

export const CustomerSearch = () => {
  // const [lastRowIds, setQueryStrings] = useState([]);
  const [lastRowIds, setLastRowIds] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      let queryString = '';
      if (lastRowIds.length > 0 && searchTerm !== ''){
        queryString = lastRowIds[lastRowIds.length-1]
          + '&searchTerm=' + searchTerm
      } else if (searchTerm !== '') {
        queryString = '?searchTerm=' + searchTerm
      } else if (lastRowIds.length > 0)
        queryString = lastRowIds[lastRowIds.length - 1];
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
    const after = customers[customers.length -1].id;
    const queryString = `?after=${after}`;
    setLastRowIds([...lastRowIds, queryString]);
  }, [customers, lastRowIds]);

  const handlePrevious = useCallback(() =>
      setLastRowIds(lastRowIds.slice(0,-1))
      , [lastRowIds]);

  const handleSearchTextChanged = ({target: {value}}) => setSearchTerm(value);

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
            <CustomerRow customer={customer} key={customer.id} />
          )
        )}
        </tbody>
      </table>
    </React.Fragment>
  )
};