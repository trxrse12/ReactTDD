import React from 'react';
import ReactDOM from 'react-dom';
import {AppointmentsDayView} from "./AppointmentsDayView";
import {sampleAppointments} from "./sampleData";
import { AppointmentForm } from "./AppointmentForm";
import {CustomerForm} from "./CustomerForm";
import { sampleAvailableTimeSlots } from './sampleData';

ReactDOM.render(
  <AppointmentForm
    availableTimeSlots={sampleAvailableTimeSlots}
  />,
  document.getElementById('root')
);
