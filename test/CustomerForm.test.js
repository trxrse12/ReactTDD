import React from 'react';
import ReactTestUtils, {act} from 'react-dom/test-utils';

import { createContainer } from "./domManipulator";;
import { CustomerForm } from '../src/CustomerForm';
import { fetchResponseOk, fetchResponseError, requestBodyOf } from "./spyHelpers";

const originalFetch = window.fetch;
let fetchSpy;


describe('CustomerForm', () => {
  let render, container;

  // retrieve a form by its id:
  const form = id => container.querySelector(`form[id="${id}"]`);
  // retrieve a label by the form element it attaches to:
  const labelFor = formElement =>
    container.querySelector(`label[for="${formElement}`);


  const expectToBeInputFieldOftextType = formElement => {
    expect(formElement).not.toBeNull();
    expect(formElement.tagName).toEqual('INPUT');
    expect(formElement.type).toEqual('text');
  };

  // generic TDD helper that returns the attached form'e element for any element:
  const field = name => form('customer').elements[name];

  // test for the html text input
  const itRendersAsTextBox = (fieldName) =>
    it('renders as a text box', () => {
      render(<CustomerForm/>);
      expectToBeInputFieldOftextType(field(fieldName));
    });

  // test to see if the form field has an initial value:
  const itIncludesTheExistingValue = (fieldName) =>
    it('includes the existing value', () => {
      render(<CustomerForm { ...{[fieldName]: 'value'} } />);
      expect(field(fieldName).value).toEqual('value');
    });

  const itRendersALabel = (fieldName, text) =>
    it('renders a label', () => {
      render(<CustomerForm />);
      expect(labelFor(fieldName)).not.toBeNull();
      expect(labelFor(fieldName).textContent).toEqual(text);
    });

  const itAssignsAnIdThatMatchesTheLabelId = (fieldName) =>
    it('assigns an id that matches the label id', () => {
      render(<CustomerForm />);
      expect(field(fieldName).id).toEqual(fieldName);
    });

  const itSubmitsExistingValue = fieldName =>
    it('saves existing value when submitted',  async() => {
      render(
        <CustomerForm
          { ...{[fieldName]: 'value'}}
        />
      );
      await ReactTestUtils.Simulate.submit(form('customer'));
      expect(requestBodyOf(fetchSpy)).toMatchObject({
        [fieldName]: 'value'
      })
    });

  const itSavesNewValueWhenSubmitted = (fieldName, value) =>
    it('saves new value when submitted',  async() => {
      render(
        <CustomerForm
          {...{[fieldName]: 'existingValue' }}
        />
      );
      await ReactTestUtils.Simulate.change(field(fieldName), {
        target: { value, name: fieldName}
      });
      await ReactTestUtils.Simulate.submit(form('customer'));
      expect(requestBodyOf(fetchSpy)).toMatchObject({
        [fieldName]: 'newValue'
      })
    });


  beforeEach(() => {
    ({ render, container } = createContainer());
    fetchSpy = jest.fn(() => fetchResponseOk({}));
    window.fetch = fetchSpy;
  });

  afterEach(() => {
    window.fetch = originalFetch;
  });

  it('renders a form', () => {
    render(<CustomerForm/>);
    expect(form('customer')).not.toBeNull();
  });

  describe('first name field', () => {
    itRendersAsTextBox('firstName');
    itIncludesTheExistingValue('firstName');
    itRendersALabel('firstName', 'First name');
    itAssignsAnIdThatMatchesTheLabelId('firstName');
    itSubmitsExistingValue('firstName', 'value');
    itSavesNewValueWhenSubmitted('firstName', 'newValue');
  });

  describe('last name field', () => {
    itRendersAsTextBox('lastName');
    itIncludesTheExistingValue('lastName');
    itRendersALabel('lastName', 'Last name');
    itAssignsAnIdThatMatchesTheLabelId('lastName');
    itSubmitsExistingValue('lastName', 'value');
    itSavesNewValueWhenSubmitted('lastName', 'newValue');
  });

  describe('phone number field', () => {
    itRendersAsTextBox('phoneNumber');
    itIncludesTheExistingValue('phoneNumber');
    itRendersALabel('phoneNumber', 'Phone number');
    itAssignsAnIdThatMatchesTheLabelId('phoneNumber');
    itSubmitsExistingValue('phoneNumber', 'value');
    itSavesNewValueWhenSubmitted('phoneNumber', 'newValue');
  });

  it('has a submit button',() => {
    render(<CustomerForm />);
    const submitButton = container.querySelector(
      'input[type="submit"]'
    );
    expect(submitButton).not.toBeNull();
  })

  it('calls fetch with the right properties when submitting data', () => {
    render(
      <CustomerForm />
    );
    ReactTestUtils.Simulate.submit(form('customer'));
    expect(fetchSpy).toHaveBeenCalledWith('/customers',
      expect.objectContaining({
        method: 'POST',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json'}
      }));
  });

  it('notifies onSave when form is submitted', async () => {
    const customer = {id: 123};
    fetchSpy.mockReturnValue(fetchResponseOk(customer));
    const saveSpy = jest.fn();

    render(<CustomerForm onSave={saveSpy} />);
    await act(async () => {
      ReactTestUtils.Simulate.submit(form('customer'));
    });

    expect(saveSpy).toHaveBeenCalledWith(customer);
    // expect(saveSpy.receivedArgument(0)).toEqual(customer);
  });

  it('does not notify onSave if the POST request returns an error', async () => {
    fetchSpy.mockReturnValue(fetchResponseError());
    const saveSpy = jest.fn();
    render(<CustomerForm onSave={saveSpy} />);
    await act(async () => {
      ReactTestUtils.Simulate.submit(form('customer'))
    });
    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('prevents the default action when submitting the form', async () => {
    const preventDefaultSpy = jest.fn();
    render(<CustomerForm />);
    await act(async () => {
      ReactTestUtils.Simulate.submit(form('customer'), {
        preventDefault: preventDefaultSpy
      });
    });
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('renders error message when fetch call fails', async () => {
    fetchSpy.mockReturnValue(Promise.resolve({ok:false}));
    render(<CustomerForm/>);
    await act(async () => {
      ReactTestUtils.Simulate.submit(form('customer'));
    });

    const errorElement = container.querySelector('.error');
    expect(errorElement).not.toBeNull();
    expect(errorElement.textContent).toMatch('error occurred');
  })
});