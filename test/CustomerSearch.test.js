import React from 'react';
import {createContainer} from "./domManipulator";
import {CustomerSearch} from "../src/CustomerSearch";
import {CustomerForm} from "../src/CustomerForm";
import 'whatwg-fetch';
import {fetchResponseOk} from "./spyHelpers";

describe('CustomerSearch form', () => {
  let renderAndWait, elements;
  beforeEach(() => {
    ({
      renderAndWait,
      elements,
    } = createContainer());
    jest
      .spyOn(window, 'fetch')
      .mockReturnValue(fetchResponseOk({}));
  });
  afterEach(() => {
    window.fetch.mockRestore();
  });
  it('renders a table with four headings', async () => {
    await renderAndWait(<CustomerSearch />);
    const headings = elements('table th');
    expect(headings.map(h => h.textContent)).toEqual([
      'First name', 'Last name', 'Phone number', 'Actions',
    ]);
  });
  it('fetches all customer data when component mounts', async () => {
    await renderAndWait(<CustomerSearch/>);
    expect(window.fetch).toHaveBeenCalledWith('/customers', {
      method: 'GET',
      credentials: 'same-origin',
      headers: {'Content-Type': 'application/json'}
    });
  });

  const oneCustomer = [
    {id: 1, firstName: 'A', lastName: 'B', phoneNumber: '1'}
  ];
  it('renders all customer data in a table row', async() => {
    window.fetch.mockReturnValue(fetchResponseOk(oneCustomer));
    await renderAndWait(<CustomerSearch/>);
    const columns = elements('table tbody td');
    expect(columns[0].textContent).toEqual('A');
    expect(columns[1].textContent).toEqual('B');
    expect(columns[2].textContent).toEqual('1');
  });
});

