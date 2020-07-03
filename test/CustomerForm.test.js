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
      expect(field('firstName').value).toEqual('value');
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

    it('renders a label', () => {
      render(<CustomerForm />);
      expect(labelFor('firstName')).not.toBeNull();
      expect(labelFor('firstName').textContent).toEqual('First name');
    });

    it('assigns an id that matches the label id', () => {
      render(<CustomerForm />);
      expect(field('firstName').id).toEqual('firstName');
    });

    it('saves existing value when submitted',  async() => {
      expect.hasAssertions();
      render(
        <CustomerForm
          firstName="Ashley"
          onSubmit={({firstName}) =>
            expect(firstName).toEqual('Ashley')
          }
        />
      );
      await ReactTestUtils.Simulate.submit(form('customer'));
    });

    it('saves new value when submitted',  async() => {
      expect.hasAssertions();
      render(
        <CustomerForm
          firstName="Ashley"
          onSubmit={({firstName}) =>
            expect(firstName).toEqual('Jamie')
          }
        />
      );
      await ReactTestUtils.Simulate.change(field('firstName'), {
        target: { value: 'Jamie'}
      });
      await ReactTestUtils.Simulate.submit(form('customer'))
    });
  });
});