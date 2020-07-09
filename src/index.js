import React from 'react';
import ReactDOM from 'react-dom';
import {AppointmentsDayView} from "./AppointmentsDayView";
import {sampleAppointments} from "./sampleData";
import { AppointmentForm } from "./AppointmentForm";
import {CustomerForm} from "./CustomerForm"; CustomerForm

ReactDOM.render(
  <AppointmentForm />,
  document.getElementById('root')
);
