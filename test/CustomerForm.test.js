// valid tests are the ones with , as the ones with  were part of the old
//    architecture, the one without React Router

import React from 'react';
import ReactTestUtils, {act} from 'react-dom/test-utils';
import 'whatwg-fetch';

import {createContainerWithStore, withEvent} from "./domManipulator";
import { CustomerForm } from '../src/CustomerForm';
import { fetchResponseOk, fetchResponseError, requestBodyOf } from "./spyHelpers";

import {expectRedux} from "expect-redux";

const validCustomer = {
  firstName: 'first',
  lastName: 'last',
  phoneNumber: '123456789',
};

describe('CustomerForm', () => {
  let
    renderWithStore, store,
    container, form, field, labelFor, element, change, submit,
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
      renderWithStore,
      store,
      container,
      form,
      field,
      labelFor,
      element,
      change,
      submit,
      blur,
    } = createContainerWithStore());
    jest
      .spyOn(window,'fetch')
      .mockReturnValue(fetchResponseOk({}))

  });

  afterEach(() => {
    window.fetch.mockRestore();
  });

  it('renders a form', () => {
    renderWithStore(<CustomerForm {...validCustomer}/>);
    expect(form('customer')).not.toBeNull();
  });

  const submitButton = () => element('input[type="submit"]');

  describe('submit button', () => {
    it('has a submit button',() => {
      renderWithStore(<CustomerForm {...validCustomer}/>);
      expect(submitButton()).not.toBeNull();
    });

    it('disables the submit button after the form has been submitted', async() => {
      renderWithStore(
        <CustomerForm {...validCustomer} />
      );
      act(() => {
        ReactTestUtils.Simulate.submit(form('customer'));
      });
      await act(async () => {
        expect(submitButton().disabled).toBeTruthy()
      });
    });

    it('initially does not disable the submit button', () => {
      renderWithStore(<CustomerForm {...validCustomer}/>);
      expect(submitButton().disabled).toBeFalsy();
    });
  });


  // it('calls fetch with the right properties when submitting data', async () => {
  //   renderWithStore(
  //     <CustomerForm {...validCustomer}/>
  //   );
  //   await submit(form('customer'));
  //   expect(window.fetch).toHaveBeenCalledWith('/customers',
  //     expect.objectContaining({
  //       method: 'POST',
  //       credentials: 'same-origin',
  //       headers: {'Content-Type': 'application/json'}
  //     }));
  // });

  it('dispatches ADD_CUSTOMER_REQUEST when submitting data', async() => {
    renderWithStore(<CustomerForm {...validCustomer}/>);
    submit(form('customer'));
    return expectRedux(store)
      .toDispatchAnAction()
      .matching({
        type: 'ADD_CUSTOMER_REQUEST',
        customer: validCustomer,
      })
  });

  it('notifies onSave when form is submitted', async () => {
    const customer = {id: 123};
    window.fetch.mockReturnValue(fetchResponseOk(customer));
    const saveSpy = jest.fn();

    renderWithStore(<CustomerForm
      {...validCustomer}
      onSave={saveSpy} />);
    await submit(form('customer'));

    expect(saveSpy).toHaveBeenCalledWith(customer);
  });

  it('does not notify onSave if the POST request returns an error', async () => {
    window.fetch.mockReturnValue(fetchResponseError());
    const saveSpy = jest.fn();
    renderWithStore(<CustomerForm
      {...validCustomer}
      onSave={saveSpy} />);
    await submit(form('customer'));
    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('prevents the default action when submitting the form', async () => {
    const preventDefaultSpy = jest.fn();
    renderWithStore(<CustomerForm {...validCustomer}/>);
    await submit(form('customer'), {
        preventDefault: preventDefaultSpy
      });
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('renders error message when fetch call fails', async () => {
    window.fetch.mockReturnValue(fetchResponseError());
    renderWithStore(<CustomerForm {...validCustomer}/>);
    await submit(form('customer'));

    expect(element('.error')).not.toBeNull();
    expect(element('.error').textContent).toMatch('error occurred');
  });

  it('clears the error message when fetch call succeeds', async() => {
    renderWithStore(<CustomerForm {...validCustomer}/>);
    window.fetch.mockReturnValue(fetchResponseError());
    await submit(form('customer'));

    const customer = {id: 123};
    window.fetch.mockReturnValue(fetchResponseOk(customer));
    await submit(form('customer'));
    expect(element('.error')).toBeNull();
  });

  it('does not submit the form when there are validation errors', async() => {
    renderWithStore(<CustomerForm />);
    await submit(form('customer'));
    expect(window.fetch).not.toHaveBeenCalled();
  });

  it('renders validation errors after submission fails', async () => {
    renderWithStore(<CustomerForm />);
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
    renderWithStore(<CustomerForm {...validCustomer} />);
    await submit(form('customer'));
    expect(element('.error').textContent).toMatch(
      errors.phoneNumber
    );
  });

  describe('submitting indicator', () => {
    it('displays indicator when the form is submitting', async() => {
      renderWithStore(<CustomerForm {...validCustomer}/>);
      act(() => {
        ReactTestUtils.Simulate.submit(form('customer'));
      });
      await act(async () => {
        expect(element('span.submittingIndicator')).not.toBeNull();
      });
    });

    it('initially does not display the submitting indicator', () => {
      renderWithStore(<CustomerForm {...validCustomer}/>);
      expect(element('.submittingIndicator')).toBeNull();
    });

    it('hides indicator when form has submitted', async () => {
      renderWithStore(<CustomerForm {...validCustomer} />);
      await submit(form('customer'));
      expect(element('.submittingIndicator')).toBeNull();
    });
  });

  const expectToBeInputFieldOfTypeText = formElement => {
    expect(formElement).not.toBeNull();
    expect(formElement.tagName).toEqual('INPUT');
    expect(formElement.type).toEqual('text');
  };

  // test for the html text input
  const itRendersAsTextBox = (fieldName) =>
    it('renders as a text box', () => {
      renderWithStore(<CustomerForm {...validCustomer}/>);
      expectToBeInputFieldOftextType(field('customer', fieldName));
    });

  // test to see if the form field has an initial value:
  const itIncludesTheExistingValue = (fieldName) =>
    it('includes the existing value', () => {
      renderWithStore(<CustomerForm
        {...validCustomer}
        { ...{[fieldName]: 'value'} } />);
      expect(field('customer', fieldName).value).toEqual('value');
    });

  const itRendersALabel = (fieldName, text) =>
    it('renders a label', () => {
      renderWithStore(<CustomerForm {...validCustomer}/>);
      expect(labelFor(fieldName)).not.toBeNull();
      expect(labelFor(fieldName).textContent).toEqual(text);
    });

  const itAssignsAnIdThatMatchesTheLabelId = (fieldName) =>
    it('assigns an id that matches the label id', () => {
      renderWithStore(<CustomerForm {...validCustomer}/>);
      expect(field('customer', fieldName).id).toEqual(fieldName);
    });

  const itSubmitsExistingValue = (fieldName, value) =>
    it('saves existing value when submitted',  async() => {
      renderWithStore(
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

  const itSavesNewValueWhenSubmitted = (fieldName, value) =>
    it('saves new value when submitted',  async() => {
      renderWithStore(
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

  describe('validation', () => {
    const itInvalidatesFieldWithValue = (
      fieldName,
      value,
      description,
    ) => {
      it(`displays error after blur when ${fieldName} field is '${value}'`, () => {
        act(() => {
          renderWithStore(<CustomerForm {...validCustomer}/>);
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

    const itClearsFieldError =
      (fieldName, fieldValue) => {
        it('clears any validation error message when the user corrects the field', async () => {
          renderWithStore(<CustomerForm {...validCustomer} />);
          blur(
            field('customer', fieldName),
            withEvent(fieldName,''),
          );
          change(
            field('customer', fieldName),
            withEvent(fieldName,fieldValue),
          );
          expect(element('.error')).toBeNull();
        });
      };

    const itDoesNotInvalidateFieldOnKeyPress = (
      fieldName, fieldValue,
    ) => {
      it('does not validate field on keypress', async() => {
        renderWithStore(<CustomerForm {...validCustomer}/>);
        change(
          field('customer', fieldName),
          withEvent(fieldName, fieldValue)
        );
        expect(element('.error')).toBeNull();
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

    itClearsFieldError('firstName', 'name');
    itClearsFieldError('lastName', 'name');
    itClearsFieldError('phoneNumber', '123');

    itDoesNotInvalidateFieldOnKeyPress('firstName', '');
    itDoesNotInvalidateFieldOnKeyPress('lastName', '');
    itDoesNotInvalidateFieldOnKeyPress('phoneNumber', '');

    it('accepts standard phone number characters when validating', () => {
      renderWithStore(<CustomerForm {...validCustomer}/>);
      blur(
        element("[name='phoneNumber']"),
        withEvent('phoneNumber','0123456789+()- ')
      );
      expect(element('.error')).toBeNull();
    });
  });
});