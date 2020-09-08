import React from 'react';
import {createContainer} from "./domManipulator";
import {CustomerSearch} from "../src/CustomerSearch";
import 'whatwg-fetch';
import {fetchResponseOk} from "./spyHelpers";

const oneCustomer = [
  {id: 1, firstName: 'A', lastName: 'B', phoneNumber: '1'}
];

const twoCustomers = [
  {id: 1, firstName: 'A', lastName: 'B', phoneNumber: '1'},
  {id: 2, firstName: 'C', lastName: 'D', phoneNumber: '1'},
];

const tenCustomers = Array.from('0123456789', id=> ({id}));

const anotherTenCustomers = Array.from('ABCDEFGHIJ', id => ({id}));

describe('CustomerSearch form', () => {
  let renderAndWait, element, elements, container, clickAndWait;
  beforeEach(() => {
    ({
      container,
      renderAndWait,
      element,
      elements,
      clickAndWait,
    } = createContainer());
    jest
      .spyOn(window, 'fetch')
      .mockReturnValue(fetchResponseOk([]));
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

  it('renders all customer data in a table row', async() => {
    window.fetch.mockReturnValue(fetchResponseOk(oneCustomer));
    await renderAndWait(<CustomerSearch/>);
    const columns = elements('table > tbody > tr > td');
    expect(columns[0].textContent).toEqual('A');
    expect(columns[1].textContent).toEqual('B');
    expect(columns[2].textContent).toEqual('1');
  });

  it('renders multiple customer rows', async() => {
    window.fetch.mockReturnValue(fetchResponseOk(twoCustomers));
    await renderAndWait(<CustomerSearch/>);
    const rows = elements('table tbody tr');
    expect(rows[1].childNodes[0].textContent).toEqual('C');
  });
  it('has a next button', async () => {
    await renderAndWait(<CustomerSearch/>);
    expect(element('button#next-page')).not.toBeNull();
  });
  it('requests next page of data when next button is clicked', async () => {
    window.fetch.mockReturnValue(fetchResponseOk(tenCustomers));
    await renderAndWait(<CustomerSearch/>);
    await clickAndWait(element('button#next-page'));
    expect(window.fetch).toHaveBeenLastCalledWith(
      '/customers?after=9',
      expect.anything()
    )
  });
  it('displays next page of data when the next button is clicked', async() => {
    const nextCustomer = [{id: 'next', firstName: 'Next'}];
    window.fetch
      .mockReturnValueOnce(fetchResponseOk(tenCustomers))
      .mockReturnValue(fetchResponseOk(nextCustomer));
    await renderAndWait(<CustomerSearch/>);
    await clickAndWait(element('button#next-page'));
    expect(elements('tbody tr').length).toEqual(1);
    expect(elements('td')[0].textContent).toEqual('Next');
  });
  it('has a previous button', async () => {
    await renderAndWait(<CustomerSearch/>);
    expect(element('button#previous-page')).not.toBeNull();
  });
  it('moves back to first page when previous button is clicked', async () => {
    window.fetch.mockReturnValue(fetchResponseOk(tenCustomers));
    await renderAndWait(<CustomerSearch/>);
    await clickAndWait(element('button#next-page'));
    await clickAndWait(element('button#previous-page'));
    expect(window.fetch).toHaveBeenLastCalledWith(
      '/customers',
      expect.anything()
    )
  });
  it('moves back one page when clicking previous after multiple clicks of the next button', async () => {
    window.fetch
      .mockReturnValueOnce(fetchResponseOk(tenCustomers))
      .mockReturnValue(fetchResponseOk(anotherTenCustomers));
    await renderAndWait(<CustomerSearch/>);
    await clickAndWait(element('button#next-page'));
    await clickAndWait(element('button#next-page'));
    await clickAndWait(element('button#previous-page'));
    expect(window.fetch).toHaveBeenLastCalledWith(
      '/customers?after=9',
      expect.anything()
    )
  });
  it('moves back multiple pages', async() => {
    window.fetch
      .mockReturnValueOnce(fetchResponseOk(tenCustomers))
      .mockReturnValue(fetchResponseOk(anotherTenCustomers));
    await renderAndWait(<CustomerSearch/>);
    await clickAndWait(element('button#next-page'));
    await clickAndWait(element('button#next-page'));
    await clickAndWait(element('button#previous-page'));
    await clickAndWait(element('button#previous-page'));
    expect(window.fetch).toHaveBeenLastCalledWith(
      '/customers',
      expect.anything()
    )
  });
});

