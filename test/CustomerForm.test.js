import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import 'whatwg-fetch';

import {createContainer, withEvent} from "./domManipulator";
import { CustomerForm } from '../src/CustomerForm';
import { fetchResponseOk, fetchResponseError, requestBodyOf } from "./spyHelpers";

describe('CustomerForm', () => {
  let render, container, form, field, labelFor, element, change, submit;

  const   expectToBeInputFieldOftextType = formElement => {
    expect(formElement).not.toBeNull();
    expect(formElement.tagName).toEqual('INPUT');
    expect(formElement.type).toEqual('text');
  };

  // // generic TDD helper that returns the attached form'e element for any element:
  // const field = (formId, name) => form(formId).elements[name];

  beforeEach(() => {
    ({
      render,
      container,
      form,
      field,
      labelFor,
      element,
      change,
      submit,
    } = createContainer());
    jest
      .spyOn(window,'fetch')
      .mockReturnValue(fetchResponseOk({}))

  });

  afterEach(() => {
    window.fetch.mockRestore();
  });

  it('renders a form', () => {
    render(<CustomerForm/>);
    expect(form('customer')).not.toBeNull();
  });

  it('has a submit button',() => {
    render(<CustomerForm />);
    const submitButton = element(
      'input[type="submit"]'
    );
    expect(submitButton).not.toBeNull();
  });

  it('calls fetch with the right properties when submitting data', async () => {
    render(
      <CustomerForm />
    );
    await submit(form('customer'));
    expect(window.fetch).toHaveBeenCalledWith('/customers',
      expect.objectContaining({
        method: 'POST',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json'}
      }));
  });

  it('notifies onSave when form is submitted', async () => {
    const customer = {id: 123};
    window.fetch.mockReturnValue(fetchResponseOk(customer));
    const saveSpy = jest.fn();

    render(<CustomerForm onSave={saveSpy} />);
    await submit(form('customer'));

    expect(saveSpy).toHaveBeenCalledWith(customer);
  });

  it('does not notify onSave if the POST request returns an error', async () => {
    window.fetch.mockReturnValue(fetchResponseError());
    const saveSpy = jest.fn();
    render(<CustomerForm onSave={saveSpy} />);
    await submit(form('customer'));
    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('prevents the default action when submitting the form', async () => {
    const preventDefaultSpy = jest.fn();
    render(<CustomerForm />);
    await submit(form('customer'), {
        preventDefault: preventDefaultSpy
      });
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('renders error message when fetch call fails', async () => {
    window.fetch.mockReturnValue(fetchResponseError());
    render(<CustomerForm/>);
    await submit(form('customer'));

    expect(element('.error')).not.toBeNull();
    expect(element('.error').textContent).toMatch('error occurred');
  });

  it('clears the error message when fetch call succeeds', async() => {
    render(<CustomerForm/>);
    window.fetch.mockReturnValue(fetchResponseError());
    await submit(form('customer'));

    const customer = {id: 123};
    window.fetch.mockReturnValue(fetchResponseOk(customer));
    await submit(form('customer'));
    expect(element('.error')).toBeNull();
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
      expect(field('customer', fieldName).id).toEqual(fieldName);
    });

  const itSubmitsExistingValue = fieldName =>
    it('saves existing value when submitted',  async() => {
      render(
        <CustomerForm
          { ...{[fieldName]: 'value'}}
        />
      );
      await submit(form('customer'));
      expect(requestBodyOf(window.fetch)).toMatchObject({
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
      await change(
        field('customer', fieldName),
        withEvent(fieldName, value));
      await submit(form('customer'));
      expect(requestBodyOf(window.fetch)).toMatchObject({
        [fieldName]: 'newValue'
      })
    });

  // test for the html text input
  const itRendersAsTextBox = (fieldName) =>
    it('renders as a text box', () => {
      render(<CustomerForm/>);
      expectToBeInputFieldOftextType(field('customer', fieldName));
    });

  // test to see if the form field has an initial value:
  const itIncludesTheExistingValue = (fieldName) =>
    it('includes the existing value', () => {
      render(<CustomerForm { ...{[fieldName]: 'value'} } />);
      expect(field('customer', fieldName).value).toEqual('value');
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


});