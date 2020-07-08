import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { createContainer } from "./domManipulator";
import { AppointmentForm } from '../src/AppointmentForm';

describe('AppointmentForm', () => {
  let render, container;

  beforeEach(() => {
    ({render, container} = createContainer());
  });

  const form = id => container.querySelector(`form[id="${id}"]`);

  it('renders a form', () => {
    render(<AppointmentForm />);
    expect(form('appointment')).not.toBeNull();
  });

  const findOption = (dropdownNode, textContent) => {
    const options = Array.from(dropdownNode.childNodes);
    return options.find(
      option => option.textContent === textContent
    )
  };

  describe('service field', () => {
    const field = name => form('appointment').elements[name];

    it('renders as a select box', () => {
      render(<AppointmentForm />);
      expect(field('service')).not.toBeNull();
      expect(field('service').tagName).toEqual('SELECT');
    });
    it('initially has a blank value chosen', () => {
      render(<AppointmentForm/>);
      const firstNode = field('service').childNodes[0];
      expect(firstNode.value).toEqual('');
      expect(firstNode.selected).toBeTruthy();
    });
    it('lists all the salon\'s services', () => {
      const selectableServices = ['Cut', 'Blow-dry'];
      render(
        <AppointmentForm
          selectableServices={selectableServices}
        />
      );
      // get an array of option nodes
      const optionNodes = Array.from(field('service').childNodes);
      const renderedServices = optionNodes.map(node => node.textContent);
      expect(renderedServices).toEqual(
        expect.arrayContaining(selectableServices)
      );
    });
    it('preselects the existing value', () => {
      const services = ['Cut', 'Blow-dry'];
      render(
        <AppointmentForm
          selectableServices={services}
          service='Blow-dry'
        />
      );
      const option = findOption(
        field('service'),
        'Blow-dry',
      );
      expect(option.selected).toBeTruthy();
    });

    // retrieve a label by the form element it attaches to:
    const labelFor = formElement =>
      container.querySelector(`label[for="${formElement}`);
    it('renders a label', () => {
      render(<AppointmentForm />);
      expect(labelFor('service', 'Service name')).not.toBeNull();
      expect(labelFor('service').textContent).toEqual('Service name')
    });

    it('assigns an id that matches the label id', () => {
      render(<AppointmentForm/>);
      expect(field('service').id).toEqual('service')
    });

    it('saves existing value when submitted', async () => {
      expect.hasAssertions();
      render(
        <AppointmentForm
          service='Blow-dry'
          onSubmit={({service}) => expect(service).toEqual('Blow-dry')}
        />
      );
      await ReactTestUtils.Simulate.submit(form('appointment'))
    });

    it('saves new value when submitted', async () => {
      expect.hasAssertions();
      render(
        <AppointmentForm
          service='Blow-dry'
          onSubmit={({service}) =>
            expect(service).toEqual('Cut')}
        />
      );
      await ReactTestUtils.Simulate.change(field('service'), {
        target: {value: 'Cut', name: 'service'}
      });
      await ReactTestUtils.Simulate.submit(form('appointment'));
    });
  });
});