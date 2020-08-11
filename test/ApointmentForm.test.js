import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import 'whatwg-fetch';
import { createContainer, withEvent } from "./domManipulator";
import { AppointmentForm } from '../src/AppointmentForm';
import { fetchResponseOk, fetchResponseError, requestBodyOf } from "./spyHelpers";

describe('AppointmentForm', () => {
  let render, container, submit, field, form, children, change, element;
  const customer={id: 123};
  beforeEach(() => {
    ({
      render,
      container,
      form,
      field,
      children,
      submit,
      change,
      element,
    } = createContainer());
    jest
      .spyOn(window, 'fetch')
      .mockReturnValue(fetchResponseOk({}));
  });
  afterEach(() => {
    window.fetch.mockRestore();
  });

  // TDD utilities
  // const form = id => container.querySelector(`form[id="${id}"]`);
  // const field = name => form('appointment').elements[name];
  // retrieve a label by the form element it attaches to:
  const labelFor = formElement =>
    container.querySelector(`label[for="${formElement}`);
  const startsAtField = index =>
    container.querySelectorAll(`input[name="startsAt"]`)[index];
  const findOption = (dropdownNode, textContent) => {
    const options = Array.from(dropdownNode.childNodes);
    return options.find(
      option => option.textContent === textContent
    )
  };

  it('renders a form', () => {
    render(<AppointmentForm />);
    expect(form('appointment')).not.toBeNull();
  });
  it('has a submit button', () => {
    render(<AppointmentForm />);
    const submitButton = container.querySelector(
      'input[type="submit"]'
    );
    expect(submitButton).not.toBeNull();
  });
  const itRendersAsASelectBox = fieldName =>
    it('renders as a select box', () => {
      render(<AppointmentForm/>);
      expect(field('appointment', fieldName)).not.toBeNull();
      expect(field('appointment', fieldName).tagName).toEqual('SELECT');
    });
  const itInitiallyHasABlankValueChosen = fieldName =>
    it('initially has a blank value chosen', () => {
      render(<AppointmentForm/>);
      const firstNode = field('appointment', fieldName).childNodes[0];
      expect(firstNode.value).toEqual('');
      expect(firstNode.selected).toBeTruthy();
    });
  const itPreselectExistingValue = (fieldName, props, existingValue) =>
    it('preselects the existing value', () => {
      render(
        <AppointmentForm
          {...props}
          {...{[fieldName]: existingValue}}
        />
      );
      const option = findOption(
        field('appointment', fieldName),
        existingValue,
      );
      expect(option.selected).toBeTruthy();
    });
  const itRendersALabel = (fieldName, text) =>
    it('renders a label', () => {
      render(<AppointmentForm />);
      expect(labelFor(fieldName, text)).not.toBeNull();
      expect(labelFor(fieldName).textContent).toEqual(text)
    });
  const itAssignsAnIdThatMatchesTheLabelId = (fieldName) =>
    it('assigns an id that matches the label id', () => {
      render(<AppointmentForm/>);
      expect(field('appointment', fieldName).id).toEqual(fieldName)
    });
  it('calls fetch with the right properties when submitting data', async() => {
    render(<AppointmentForm customer={customer}/>);
    await submit(form('appointment'));
    expect(window.fetch).toHaveBeenCalledWith(
      '/appointments',
       expect.objectContaining({
         method: 'POST',
         credentials: 'same-origin',
         headers: {'Content-Type': 'application/json'}
       })
      )
  });
  it('prevents the default action when submitting the form', async () => {
    const preventDefaultSpy = jest.fn();
    render(<AppointmentForm customer={customer}/>);
    await submit(form('appointment'), {
      preventDefault: preventDefaultSpy
    });
    expect(preventDefaultSpy).toHaveBeenCalled();
  });
  it('renders error message when fetch call fails', async () => {
    window.fetch.mockReturnValue(fetchResponseError());
    render(<AppointmentForm customer={customer}/>);
    await submit(form('appointment'));
    expect(element('.error')).not.toBeNull();
    expect(element('.error').textContent).toMatch('error occurred');
  });
  it('clears the error message when fetch call succeeds', async () => {
    window.fetch.mockReturnValueOnce(fetchResponseError());
    window.fetch.mockReturnValue(fetchResponseOk());
    render(<AppointmentForm customer={customer}/>);
    await(submit(form('appointment')));
    await(submit(form('appointment')));
    expect(element('.error')).toBeNull();
  });
  const itSubmitsExistingValue = (fieldName, props) =>
    it('saves existing value when submitted', async () => {
      render(
        <AppointmentForm
          {...props}
          {...{[fieldName]:'value'}}
          customer={ customer}
        />
      );
      await submit(form('appointment'));
      expect(requestBodyOf(window.fetch)).toMatchObject({
        [fieldName]: 'value',
      })
    });
  const itSubmitsNewValue = (fieldName, props) =>
    it('saves new value when submitted', async () => {
      render(
        <AppointmentForm
          {...props}
          {...{[fieldName]: 'existingValue'}}
          customer={ customer}
        />
      );
      change(
        field('appointment',fieldName),
        withEvent(fieldName, 'newValue'));
      await submit(form('appointment'));
      expect(requestBodyOf(window.fetch)).toMatchObject({
        [fieldName]: 'newValue'
      })
    });

  it('passes the customer id to fetch when submitting', async() => {
      render(<AppointmentForm customer={customer} />);
      await submit(form('appointment'));
      expect(requestBodyOf(window.fetch)).toMatchObject({
        customer: customer.id
      })
  });

  describe('service field', () => {
    itRendersAsASelectBox('service');
    itInitiallyHasABlankValueChosen('service');
    itPreselectExistingValue(
      'service',
      {selectableServices: ['Cut', 'Blow-dry']},
      'Blow-dry'
    );
    itRendersALabel('service', 'Service name');
    itAssignsAnIdThatMatchesTheLabelId('service');
    it('lists all the salon\'s services', () => {
      const selectableServices = ['Cut', 'Blow-dry'];
      render(
        <AppointmentForm
          selectableServices={selectableServices}
        />
      );
      // get an array of option nodes
      const renderedServices = children(field('appointment', 'service'))
        .map(node => node.textContent);
      expect(renderedServices).toEqual(
        expect.arrayContaining(selectableServices)
      );
    });
    it('saves existing value when submitted', async () => {
      render(
        <AppointmentForm
          service='Blow-dry'
          customer={customer}
        />
      );
      // await ReactTestUtils.Simulate.submit(form('appointment'))
      await submit(form('appointment'));
      expect(requestBodyOf(window.fetch)).toMatchObject({
        service: 'Blow-dry'
      })
    });
    it('saves new value when submitted', async () => {
      render(
        <AppointmentForm
          service='Blow-dry'
          customer={customer}
        />
      );
      change(
        field('appointment', 'service'),
        withEvent(
          'service', 'Cut'
        )
      );
      await submit(form('appointment'));
    });
  });

  describe('stylist field', () => {
    itRendersAsASelectBox('stylist');
    itInitiallyHasABlankValueChosen('stylist');
    itPreselectExistingValue( // to make this pass be sure you add a default value
      'stylist',
      {selectableStylists: ['Ashley', 'Jo']},
      'Ashley'
    );
    itRendersALabel('stylist', 'Stylist');
    itAssignsAnIdThatMatchesTheLabelId('stylist');
    itSubmitsExistingValue('stylist'); // to make it pass just add the "stylist" to the useState hook
    itSubmitsNewValue('stylist'); // to make it pass just add a change handler that takes a target value
          // as param and calls the state changer with the target value
    it('lists only stylists that can perform the selected service', () => {
      const selectableServices = ['1', '2'];
      const selectableStylists = ['A', 'B', 'C'];
      const serviceStylists = {
        '1':['A', 'B'],
      }
      render(
        <AppointmentForm
            selectableServices={selectableServices}
            selectableStylists={selectableStylists}
            serviceStylists={serviceStylists}
            />
      );
      change(
        field('appointment', 'service'),
        withEvent('service', '1')
      );
      const renderedServices = children(field('appointment','stylist')).map(
        node => node.textContent
      );
      expect(renderedServices).toEqual(
        expect.arrayContaining(['A','B'])
      );
    });
  });

  const timeSlotTable = () => container.querySelector('table#time-slots');

  describe('time slot table', () => {

    it('renders a table from time slots', () => {
      render(<AppointmentForm />);
      expect(
        timeSlotTable()
      ).not.toBeNull();
    });

    it('renders a time slot for every half an hour between open and close time', () => {
      render(
        <AppointmentForm salonOpensAt={9} salonClosesAt={11} />
      );
      const timesOfDay = timeSlotTable().querySelectorAll(
        'tbody >* th'
      );
      expect(timesOfDay).toHaveLength(4);
      expect(timesOfDay[0].textContent).toEqual('09:00');
      expect(timesOfDay[1].textContent).toEqual('09:30');
      expect(timesOfDay[3].textContent).toEqual('10:30');
    });

    it('renders an empty cell at the start of the header row', () => {
      render(<AppointmentForm />);
      const headerRow = timeSlotTable().querySelector(
        'thead > tr'
      );
      expect(headerRow.firstChild.textContent).toEqual('');
    });

    it('renders a week of avgailable dates', () => {
      const today = new Date(2018, 11, 1);
      render(<AppointmentForm today={today} />);
      const dates = timeSlotTable().querySelectorAll(
        'thead >* th:not(:first-child)'
      );
      expect(dates).toHaveLength(7);
      expect(dates[0].textContent).toEqual('Sat 01');
      expect(dates[1].textContent).toEqual('Sun 02');
      expect(dates[6].textContent).toEqual('Fri 07');
    });
    it('renders a radio button for each time slot', () => {
      const today = new Date();
      const availableTimeSlots = [
        { startsAt: today.setHours(9, 0, 0, 0)},
        { startsAt: today.setHours(9, 30, 0, 0)},
      ];
      render(<AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
        />
      );
      const cells = timeSlotTable().querySelectorAll('td');
      expect(
        cells[0].querySelector('input[type="radio"]')
      ).not.toBeNull();
      expect(
        cells[7].querySelector('input[type="radio"]')
      ).not.toBeNull();
    });
    it('does not render radio buttons for unavailable timeslots', () => {
      render(<AppointmentForm availableTimeSlots={[]} />);
      const timesOfDay = timeSlotTable().querySelectorAll('input');
      expect(timesOfDay).toHaveLength(0);
    });
    const today=new Date();
    const availableTimeSlots = [
      {startsAt: today.setHours(9, 0,0,0,)},
      {startsAt: today.setHours(9, 30, 0, 0,)},
    ];

    it('sets radio button to the index of the corresponding appointment', () => {
      render(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
        />
      );
      expect(startsAtField(0).value).toEqual(
        availableTimeSlots[0].startsAt.toString()
      );
      expect(startsAtField(1).value).toEqual(
        availableTimeSlots[1].startsAt.toString()
      );
    });
    it('pre-selects the existing value', () => {
      render(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
          startsAt={availableTimeSlots[0].startsAt}
        />
      );
      expect(startsAtField(0).checked).toEqual(true);
    });
    it('saves existing values when submitted', async () => {
      render(<AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
          startsAt={availableTimeSlots[0].startsAt}
          customer={customer}
        />
      );
      // ReactTestUtils.Simulate.submit(form('appointment'));
      await submit(form('appointment'));
      expect(requestBodyOf(window.fetch)).toMatchObject({
        startsAt: availableTimeSlots[0].startsAt
      })
    });
    it('saves a new value when submitted', async () => {
      render(<AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
          startsAt={availableTimeSlots[0].startsAt}
          customer={customer}
        />
      );

      change(
        startsAtField(1),
        withEvent(
          'startsAt',
          availableTimeSlots[1].startsAt.toString()
        )
      );
      await submit(form('appointment'));
      expect(requestBodyOf(window.fetch)).toMatchObject({
        'startsAt': availableTimeSlots[1].startsAt
      })
    });

    it('does not render radio buttons for unavailable time slots', () => {
      render(<AppointmentForm availableTimeSlots={[]} />);
      const timesOfDay = timeSlotTable().querySelectorAll('input');
      expect(timesOfDay).toHaveLength(0);
    });
    it('filters appointments by selected stylist', () => {
      const availableTimeSlots = [
        {
          startsAt: today.setHours(9,0,0,0),
          stylists: ['A', 'B']
        },
        {
          startsAt: today.setHours(9,30,0,0),
          stylists: ['A'],
        }
      ];
      render(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
          />
      );
      change(
        field('appointment', 'stylist'),
        withEvent('stylist','B')
      );
      const cells = timeSlotTable().querySelectorAll('td');
      expect(
        cells[0].querySelector('input[type="radio"]')
      ).not.toBeNull();
      expect(
        cells[7].querySelector('input[type="radio"]')
      ).toBeNull();
    });
  });
});