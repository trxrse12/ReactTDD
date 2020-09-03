import React from 'react';
import ReactTestUtils, {act} from 'react-dom/test-utils';
import 'whatwg-fetch';

import {createContainer, withEvent} from "./domManipulator";
import { CustomerForm } from '../src/CustomerForm';
import { fetchResponseOk, fetchResponseError, requestBodyOf } from "./spyHelpers";

const validCustomer = {
  firstName: 'first',
  lastName: 'last',
  phoneNumber: '123456789',
};

describe('CustomerForm', () => {
  let
    render, container, form, field, labelFor, element, change, submit,
    blur;

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
      blur,
    } = createContainer());
    jest
      .spyOn(window,'fetch')
      .mockReturnValue(fetchResponseOk({}))

  });

  afterEach(() => {
    window.fetch.mockRestore();
  });

  it('renders a form', () => {
    render(<CustomerForm {...validCustomer}/>);
    expect(form('customer')).not.toBeNull();
  });

  it('has a submit button',() => {
    render(<CustomerForm {...validCustomer}/>);
    const submitButton = element(
      'input[type="submit"]'
    );
    expect(submitButton).not.toBeNull();
  });

  it('calls fetch with the right properties when submitting data', async () => {
    render(
      <CustomerForm {...validCustomer}/>
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

    render(<CustomerForm
      {...validCustomer}
      onSave={saveSpy} />);
    await submit(form('customer'));

    expect(saveSpy).toHaveBeenCalledWith(customer);
  });

  it('does not notify onSave if the POST request returns an error', async () => {
    window.fetch.mockReturnValue(fetchResponseError());
    const saveSpy = jest.fn();
    render(<CustomerForm
      {...validCustomer}
      onSave={saveSpy} />);
    await submit(form('customer'));
    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('prevents the default action when submitting the form', async () => {
    const preventDefaultSpy = jest.fn();
    render(<CustomerForm {...validCustomer}/>);
    await submit(form('customer'), {
        preventDefault: preventDefaultSpy
      });
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('renders error message when fetch call fails', async () => {
    window.fetch.mockReturnValue(fetchResponseError());
    render(<CustomerForm {...validCustomer}/>);
    await submit(form('customer'));

    expect(element('.error')).not.toBeNull();
    expect(element('.error').textContent).toMatch('error occurred');
  });

  it('clears the error message when fetch call succeeds', async() => {
    render(<CustomerForm {...validCustomer}/>);
    window.fetch.mockReturnValue(fetchResponseError());
    await submit(form('customer'));

    const customer = {id: 123};
    window.fetch.mockReturnValue(fetchResponseOk(customer));
    await submit(form('customer'));
    expect(element('.error')).toBeNull();
  });

  const itRendersALabel = (fieldName, text) =>
    it('renders a label', () => {
      render(<CustomerForm {...validCustomer}/>);
      expect(labelFor(fieldName)).not.toBeNull();
      expect(labelFor(fieldName).textContent).toEqual(text);
    });

  const itAssignsAnIdThatMatchesTheLabelId = (fieldName) =>
    it('assigns an id that matches the label id', () => {
      render(<CustomerForm {...validCustomer}/>);
      expect(field('customer', fieldName).id).toEqual(fieldName);
    });

  const itSubmitsExistingValue = (fieldName, value) =>
    it('saves existing value when submitted',  async() => {
      render(
        <CustomerForm
          {...validCustomer}
          { ...{[fieldName]: value}}
        />
      );
      await submit(form('customer'));
      expect(requestBodyOf(window.fetch)).toMatchObject({
        [fieldName]: value
      })
    });

  // it('disables the submit button after the form has been submitted', () => {
  //   render(
  //     <CustomerForm {...validCustomer} />
  //   );
  //   await submit(form('customer'));
  //   expect()
  // });

  const itSavesNewValueWhenSubmitted = (fieldName, value) =>
    it('saves new value when submitted',  async() => {
      render(
        <CustomerForm
          {...validCustomer}
          {...{[fieldName]: 'existingValue' }}
        />
      );
      await change(
        field('customer', fieldName),
        withEvent(fieldName, value));
      await submit(form('customer'));
      expect(requestBodyOf(window.fetch)).toMatchObject({
        [fieldName]: value
      })
    });

  // test for the html text input
  const itRendersAsTextBox = (fieldName) =>
    it('renders as a text box', () => {
      render(<CustomerForm {...validCustomer}/>);
      expectToBeInputFieldOftextType(field('customer', fieldName));
    });

  // test to see if the form field has an initial value:
  const itIncludesTheExistingValue = (fieldName) =>
    it('includes the existing value', () => {
      render(<CustomerForm
        {...validCustomer}
        { ...{[fieldName]: 'value'} } />);
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
    itSubmitsExistingValue('phoneNumber', '12345');
    itSavesNewValueWhenSubmitted('phoneNumber', '67890');
  });

  it('does not submit the form when there are validation errors', async() => {
    render(<CustomerForm />);
    await submit(form('customer'));
    expect(window.fetch).not.toHaveBeenCalled();
  });

  it('renders validation errors after submission fails', async () => {
    render(<CustomerForm />);
    await submit(form('customer'));
    expect(window.fetch).not.toHaveBeenCalled();
    expect(element('.error')).not.toBeNull();
  });

  it('renders field validation errors from server', async() => {
    const errors = {
      phoneNumber: 'Phone number already exists in the system'
    };
    window.fetch.mockReturnValue(
      fetchResponseError(422, { errors })
    );
    render(<CustomerForm {...validCustomer} />);
    await submit(form('customer'));
    expect(element('.error').textContent).toMatch(
      errors.phoneNumber
    );
  });


  describe('submitting indicator', () => {
    it('displays indicator when the form is submitting', async() => {
      render(<CustomerForm {...validCustomer}/>);
      act(() => {
        ReactTestUtils.Simulate.submit(form('customer'));
      });
      await act(async () => {
        expect(element('span.submittingIndicator')).not.toBeNull();
      });
    });
    it('initially does not display the submitting indicator', () => {
      render(<CustomerForm {...validCustomer} />);
      expect(element('.submittingIndicator')).toBeNull();
    });
    it('hides indicator when form has submitted', async () => {
      render(<CustomerForm {...validCustomer} />);
      await submit(form('customer'));
      expect(element('.submittingIndicator')).toBeNull();
    });
  });

  describe('validation', () => {
    const itInvalidatesFieldWithValue = (
      fieldName,
      value,
      description,
    ) => {
      it(`displays error after blur when ${fieldName} field is '${value}'`, () => {
        act(() => {
          render(<CustomerForm {...validCustomer}/>);
          blur(
            field('customer', fieldName),
            withEvent(fieldName, value))
        });
        expect(element('.error')).not.toBeNull();
        expect(element('.error').textContent).toMatch(
          description
        );
      });
    };

    itInvalidatesFieldWithValue(
      'firstName',
      '',
      'First name is required'
    );

    itInvalidatesFieldWithValue(
      'lastName',
      '',
      'Last name is required'
    );

    itInvalidatesFieldWithValue(
      'phoneNumber',
      '',
      'Phone number is required'
    );

    itInvalidatesFieldWithValue(
      'phoneNumber',
      'invalid',
      "Only numbers, spaces and these symbols are allowed: ( ) + -"
    );

    it('accepts standard phone number characters when validating', () => {
      render(<CustomerForm {...validCustomer}/>);
      blur(
        element("[name='phoneNumber']"),
        withEvent('phoneNumber','0123456789+()- ')
      );
      expect(element('.error')).toBeNull();
    });

    const itClearsAnyValidationErrorMessageWhenTheUserCorrectsTheField =
      (fieldName, fieldValue) => {
      it('clears any validation error message when the user corrects the field', async () => {
          render(<CustomerForm {...validCustomer} />);
          blur(
            field('customer', fieldName),
            withEvent(fieldName,''),
          )
          change(
            field('customer', fieldName),
            withEvent(fieldName,fieldValue),
          )
          expect(element('.error')).toBeNull();
        });
      };

    itClearsAnyValidationErrorMessageWhenTheUserCorrectsTheField('firstName', 'name');
    itClearsAnyValidationErrorMessageWhenTheUserCorrectsTheField('lastName', 'name');
    itClearsAnyValidationErrorMessageWhenTheUserCorrectsTheField('phoneNumber', '123');
  });
});