import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';

import { createContainer } from "./domManipulator";;
import { CustomerForm } from '../src/CustomerForm';

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

  const itSubmitsExistingValue = (fieldName, value) =>
    it('saves existing value when submitted',  async() => {
      expect.hasAssertions();
      render(
        <CustomerForm
          { ...{[fieldName]: value}}
          onSubmit={props =>
            expect(props[fieldName]).toEqual(value)
          }
        />
      );
      await ReactTestUtils.Simulate.submit(form('customer'));
    });

  const itSavesNewValueWhenSubmitted = (fieldName, value) =>
    it('saves new value when submitted',  async() => {
      expect.hasAssertions();
      render(
        <CustomerForm
          {...{[fieldName]: 'existingValue' }}
          onSubmit={props =>
            expect(props[fieldName]).toEqual(value)
          }
        />
      );
      await ReactTestUtils.Simulate.change(field(fieldName), {
        target: { value, name: fieldName}
      });
      await ReactTestUtils.Simulate.submit(form('customer'))
    });

  beforeEach(() => {
    ({ render, container } = createContainer());
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
});