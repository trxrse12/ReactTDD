import React from 'react';
import {expectRedux} from "expect-redux";
import ReactTestUtils, {act} from 'react-dom/test-utils';
import {createContainerWithStore, withEvent} from "../domManipulator";
import {CustomerSearch} from "../../src/CustomerSearch/CustomerSearch";
import * as SearchButtonsExports from '../../src/CustomerSearch/SearchButtons';
import 'whatwg-fetch';
import {fetchResponseOk} from "../spyHelpers";

const oneCustomer = [
  {id: 1, firstName: 'A', lastName: 'B', phoneNumber: '1'}
];

const twoCustomers = [
  {id: 1, firstName: 'A', lastName: 'B', phoneNumber: '1'},
  {id: 2, firstName: 'C', lastName: 'D', phoneNumber: '1'},
];

const tenCustomers = Array.from('0123456789', id=> ({id}));

const anotherTenCustomers = Array.from('ABCDEFGHIJ', id => ({id}));

const lessThanTenCustomers = Array.from('0123456', (id) => ({id}))

describe('CustomerSearch form', () => {
  let renderWithStore, store, element, elements, container, clickAndWait, changeAndWait, change;
  let historySpy, actionSpy;
  beforeEach(() => {
    ({
      container,
      renderWithStore,
      store,
      element,
      elements,
      clickAndWait,
      changeAndWait,
      change,
    } = createContainerWithStore());
    jest
      .spyOn(window, 'fetch')
      .mockReturnValue(fetchResponseOk([]));
    historySpy = jest.fn();
    actionSpy = jest.fn();
    jest
      .spyOn(SearchButtonsExports, 'SearchButtons')
      .mockReturnValue(null);
  });
  afterEach(() => {
    window.fetch.mockRestore();
  });

  const renderCustomerSearch = async props =>
    await act(async () => renderWithStore(
      <CustomerSearch
        {...props}
        history={{push: historySpy}}
        renderCustomerActions={actionSpy}
        location={{pathname: '/path'}}
      />
    )
  );

  it('renders a table with four headings', async () => {
    await renderCustomerSearch();
    const headings = elements('table th');
    expect(headings.map(h => h.textContent)).toEqual([
      'First name', 'Last name', 'Phone number', 'Actions',
    ]);
  });

  it('dispatches SEARCH_CUSTOMERS_REQUEST when component mounts', async () => {
    const lastRowIds = [123, 234, 345];
    const searchTerm = 'test';
    const limit = 10;
    await renderCustomerSearch({
      lastRowIds,
      searchTerm,
      limit,
    });
    return expectRedux(store)
      .toDispatchAnAction()
      .matching({
        type: 'SEARCH_CUSTOMERS_REQUEST',
        lastRowIds,
        searchTerm,
        limit,
      })
  });

  it('renders all customer data in a table row', async () => {
    jest
      .spyOn(window, 'fetch')
      .mockReturnValue(fetchResponseOk(oneCustomer));
    await renderCustomerSearch();
    // await new Promise(setTimeout); // wait for the API data to be retrieved
    const columns = elements('table > tbody > tr > td');
    expect(columns[0].textContent).toEqual('A');
    expect(columns[1].textContent).toEqual('B');
    expect(columns[2].textContent).toEqual('1');
  });

  it('renders multiple customer rows', async() => {
    window.fetch.mockReturnValue(fetchResponseOk(twoCustomers));
    await renderCustomerSearch();
    await new Promise(setTimeout); // wait for the API data to be retrieved
    const rows = elements('table tbody tr');
    expect(rows[1].childNodes[0].textContent).toEqual('C');
  });

  it.skip('has a next button', async () => {
    await renderWithStore(<CustomerSearch/>);
    expect(element('button#next-page')).not.toBeNull();
  });

  it.skip('requests next page of data when next button is clicked', async () => {
    window.fetch.mockReturnValue(fetchResponseOk(tenCustomers));
    await renderWithStore(<CustomerSearch/>);
    await clickAndWait(element('button#next-page'));
    expect(window.fetch).toHaveBeenLastCalledWith(
      '/customers?after=9',
      expect.anything()
    )
  });

  it.skip('displays next page of data when the next button is clicked', async() => {
    const nextCustomer = [{id: 'next', firstName: 'Next'}];
    window.fetch
      .mockReturnValueOnce(fetchResponseOk(tenCustomers))
      .mockReturnValue(fetchResponseOk(nextCustomer));
    await renderWithStore(<CustomerSearch/>);
    await clickAndWait(element('button#next-page'));
    expect(elements('tbody tr').length).toEqual(1);
    expect(elements('td')[0].textContent).toEqual('Next');
  });

  it.skip('has a previous button', async () => {
    await renderWithStore(<CustomerSearch/>);
    expect(element('button#previous-page')).not.toBeNull();
  });

  it.skip('moves back to first page when previous button is clicked', async () => {
    window.fetch.mockReturnValue(fetchResponseOk(tenCustomers));
    await renderWithStore(<CustomerSearch/>);
    await clickAndWait(element('button#next-page'));
    await clickAndWait(element('button#previous-page'));
    expect(window.fetch).toHaveBeenLastCalledWith(
      '/customers',
      expect.anything()
    )
  });

  it.skip('moves back one page when clicking previous after multiple clicks of the next button', async () => {
    window.fetch
      .mockReturnValueOnce(fetchResponseOk(tenCustomers))
      .mockReturnValue(fetchResponseOk(anotherTenCustomers));
    await renderWithStore(<CustomerSearch/>);
    await clickAndWait(element('button#next-page'));
    await clickAndWait(element('button#next-page'));
    await clickAndWait(element('button#previous-page'));
    expect(window.fetch).toHaveBeenLastCalledWith(
      '/customers?after=9',
      expect.anything()
    )
  });

  it.skip('moves back multiple pages', async() => {
    window.fetch
      .mockReturnValueOnce(fetchResponseOk(tenCustomers))
      .mockReturnValue(fetchResponseOk(anotherTenCustomers));
    await renderWithStore(<CustomerSearch/>);
    await clickAndWait(element('button#next-page'));
    await clickAndWait(element('button#next-page'));
    await clickAndWait(element('button#previous-page'));
    await clickAndWait(element('button#previous-page'));
    expect(window.fetch).toHaveBeenLastCalledWith(
      '/customers',
      expect.anything()
    )
  });

  it('has a search input field with a placeholder', async () => {
    await renderCustomerSearch();
    expect(element('input')).not.toBeNull();
    expect(element('input').getAttribute('placeholder')).toEqual('' +
      'Enter filter text')
  });

  it('changes location when search term is changed', async () => {
    await renderCustomerSearch();
    change(element('input'), withEvent('input', 'name'));
    expect(historySpy).toHaveBeenCalledWith(
      '/path?searchTerm=name'
    );
  });

  it.skip('includes search term when moving to the next page', async() => {
    window.fetch.mockReturnValue(fetchResponseOk(tenCustomers));
    await renderWithStore(<CustomerSearch/>);
    await changeAndWait(
      element('input'),
      withEvent('input','name')
    );
    await clickAndWait(element('button#next-page'));
    expect(window.fetch).toHaveBeenLastCalledWith(
      '/customers?after=9&searchTerm=name',
      expect.anything()
    );
  });

  it('displays provided action buttons for each customer', async() => {
    actionSpy.mockReturnValue('actions');
    window.fetch.mockReturnValue(fetchResponseOk(oneCustomer));
    await renderCustomerSearch();
    await new Promise(setTimeout); // wait for the API data to be retrieved
    const rows = elements('table tbody td');
    expect(rows[rows.length-1].textContent).toEqual('actions');
  });

  it('passes customer to the renderCustomerActions prop', async() => {
    actionSpy.mockReturnValue('actions');
    window.fetch.mockReturnValue(fetchResponseOk(oneCustomer));
    await renderCustomerSearch();
    await new Promise(setTimeout);
    expect(actionSpy).toHaveBeenCalledWith(oneCustomer[0]);
  });

  it('renders SearchButtons with props', async() => {
    window.fetch.mockReturnValue(fetchResponseOk(tenCustomers));
    await renderCustomerSearch({
      searchTerm: 'term',
      limit: 20,
      lastRowIds: ['123'],
      pathname: '/path',
    });
    await new Promise(setTimeout); // await the API data to be retrieved
    expect(
      SearchButtonsExports.SearchButtons
    ).toHaveBeenCalledWith(
      {
        customers: tenCustomers,
        searchTerm: 'term',
        limit: 20,
        lastRowIds: ['123'],
        pathname: '/path',
      },
      expect.anything()
    )
  });

  it.skip('initially disables the previous page',  async() => {
    await renderWithStore(<CustomerSearch/>);
    expect(
      element('button#previous-page').getAttribute('disabled')
    ).not.toBeNull();
  });

  it.skip('disables next page button if there are less than ten results on the page', async() => {
    window.fetch.mockReturnValue(fetchResponseOk(lessThanTenCustomers));
    await renderWithStore(<CustomerSearch />);
    expect(element('button#next-page').getAttribute('disabled')).not.toBeNull();
  });

  it.skip('has a button with a label of 10 that is initially toggled', async() => {
    await renderWithStore(<CustomerSearch />);
    const button = element('a#limit-10');
    expect(button.className).toContain('toggle-button');
    expect(button.className).toContain('toggled');
    expect(button.textContent).toEqual('10');
  });

  [20, 50, 100].forEach(limitSize => {
    it.skip(`has a button with a label of ${limitSize} that is initially not toggled`, async() => {
      await renderWithStore(<CustomerSearch/>);
      const button = element(`a#limit-${limitSize}`);
      expect(button.className).toContain('toggle-button');
      expect(button.className).not.toContain('toggled');
      expect(button.textContent).toEqual(`${limitSize.toString()}`);
    });

    it.skip(`searches by ${limitSize} records when clicking on ${limitSize}`, async() => {
      await renderWithStore(<CustomerSearch/>);
      await clickAndWait(element('a#limit-10'));
      await clickAndWait(element(`a#limit-${limitSize}`));
      expect(window.fetch).toHaveBeenLastCalledWith(
        `/customers?limit=${limitSize}`,
        expect.anything(),
      )
    })
  });

  it.skip('searches by 10 records when clicking on 10', async() => {
    await renderWithStore(<CustomerSearch/>);
    await clickAndWait(element('a#limit-20'));
    await clickAndWait(element('a#limit-10'));
    expect(window.fetch).toHaveBeenLastCalledWith(
      `/customers`,
      expect.anything(),
    );
  });


});

