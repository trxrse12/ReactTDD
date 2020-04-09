import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import { sampleAppointments as appointments } from '../src/sampleData';

import {
  AppointmentsDayView,
  Appointment,
} from '../src/AppointmentsDayView';

const today = new Date();
const at = hours => today.setHours(hours, 0)

let container;
let customer;

describe('Appointment', function () {
  beforeEach(function () {
    container = document.createElement('div');
  });

  const render = component => ReactDOM.render(component, container);

  it('renders the customer first name ', function () {
    customer = {firstName: 'Ashley'};
    render(<Appointment customer={customer}/>);
    expect(container.textContent).toMatch('Ashley');
  });

  it('renders another customer first name ', function () {
    customer = {firstName: 'Jordan'};
    render(<Appointment customer={customer}/>);
    expect(container.textContent).toMatch('Jordan');
  });
});

describe('AppointmentsDayView', () => {
  let container;
  const today = new Date();
  const appointments = [
    {
      startsAt: at(12),
      customer: {
        firstName: 'Ashley',
        lastname: 'Johnson',
        phoneNumber: '123333242314',
        stylist: 'John McEnroe',
        service: 'The Primrose',
        notes: 'He is bald',
      }
    },
    {
      startsAt: at(13),
      customer: {
        firstName: 'Jordan',
        lastname: 'Doubtfire',
        phoneNumber: '999288828882',
        stylist: 'John McEnroe',
        service: 'Apollo',
        notes: 'None',
      },
    }
  ];
  const render = component => ReactDOM.render(component, container);

  beforeEach(function () {
    container = document.createElement('div');
  });

  it('renders a div with the right id', function () {
    render(<AppointmentsDayView appointments={[]}/>);
    expect(container.querySelector('div#appointmentsDayView')).not.toBeNull();
  });
  it('renders multiple appointments in an table element', () => {
    render(<AppointmentsDayView appointments={appointments}/>);
    expect(container.querySelector('table')).not.toBeNull();
    expect(container.querySelector('table > tbody').children).toHaveLength(appointments.length);
  });
  it('renders each appointment in an <tr>', () => {
    render(<AppointmentsDayView appointments={appointments}/>);
    expect(container.querySelectorAll('tr')).toHaveLength(appointments.length);
    expect(container.querySelectorAll('tr')[0].textContent).toEqual('12:00');
    expect(container.querySelectorAll('tr')[1].textContent).toEqual('13:00');
  });
  it('initially shows a message saying there are no appointments today', () => {
    render(<AppointmentsDayView appointments={[]}/>);
    expect(container.textContent).toMatch(
      'There are no appointments scheduled for today.'
    )
  });
  it('selects the first appointment by default', () => {
    render(<AppointmentsDayView appointments={appointments}/>);
    expect(container.textContent).toMatch('Ashley');
  });
  it('has a button element in each td', () => {
    render(<AppointmentsDayView appointments={appointments}/>);
    expect(
      container.querySelectorAll('td > button')
    ).toHaveLength(appointments.length);
    expect(
      container.querySelectorAll('td > button')[0].type
    ).toEqual('button');
  });
  it('renders another appointment when selected', () => {
    render(<AppointmentsDayView appointments={appointments}/>);
    const button = container.querySelectorAll('button')[1];
    ReactTestUtils.Simulate.click(button);
    expect(container.textContent).toMatch('Jordan');
  })
});
