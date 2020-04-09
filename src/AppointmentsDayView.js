import React, { useState } from 'react';

const appointmentTimeOfDay = startsAt => {
  const [h,m] = new Date(startsAt).toTimeString().split(':');
  return `${h}:${m}`;
}

export const Appointment = ({customer}) => (
  <div>{customer.firstName}</div>
)

export const AppointmentsDayView = ({appointments}) => {
  // add state to the component
  const [selectedAppointment, setSelectedAppointment] = useState(0);
  return (
    <div id="appointmentsDayView">
      <table>
        <tbody>
          {appointments.map((appointment, i) => (
              <tr key={appointment.startsAt}>
                <td>
                  <button
                    type="button"
                    // the event handler
                    onClick={ () => setSelectedAppointment(i)}
                  >
                    {appointmentTimeOfDay(appointment.startsAt)}
                  </button>
                </td>
              </tr>
          ))}
        </tbody>
      </table>
      {appointments.length === 0 ? (
        <p>There are no appointments scheduled for today.</p>
      ) : (
        <Appointment customer={appointments[selectedAppointment].customer} />
      )}
    </div>
  );
};