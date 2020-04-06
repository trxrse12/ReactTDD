import React from 'react';
import ReactDOM from 'react-dom';
import { AppointmentsDayView } from "./Appointment";
import { sampleAppointments } from "./sampleData"; // test data

ReactDOM.render(
  <AppointmentsDayView appointments={sampleAppointments} />,
  document.getElementById('root')
)